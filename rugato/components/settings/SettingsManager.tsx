'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import Sheet from '@/components/ui/Sheet'
import { type Category, type PricingMode } from '@/lib/menu'
import {
  type AppSettings, type Station, type ExpenseCategory, type PaymentMethod,
  ALL_PAYMENTS, PAYMENT_LABELS, settingsApi,
} from '@/lib/settings'

const field =
  'w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]'
const label = 'text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]'

type Tab = 'negocio' | 'estaciones' | 'menu' | 'gastos' | 'cuenta'
const TAB_LABELS: Record<Tab, string> = {
  negocio: 'Negocio', estaciones: 'Estaciones', menu: 'Categorías', gastos: 'Gastos', cuenta: 'Cuenta',
}

export default function SettingsManager() {
  const [tab, setTab] = useState<Tab>('negocio')
  return (
    <div className="mx-auto w-full max-w-[720px]">
      <h1 className="mb-4 text-[34px] font-bold tracking-tight text-white">Configuración</h1>
      <div className="mb-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Segmented<Tab> value={tab} onChange={setTab}
          options={(Object.keys(TAB_LABELS) as Tab[]).map(k => ({ value: k, label: TAB_LABELS[k] }))} />
      </div>
      {tab === 'negocio' && <NegocioTab />}
      {tab === 'estaciones' && <EstacionesTab />}
      {tab === 'menu' && <MenuCategoriesTab />}
      {tab === 'gastos' && <GastosTab />}
      {tab === 'cuenta' && <CuentaTab />}
    </div>
  )
}

function Banner({ error, ok }: { error?: string; ok?: string }) {
  if (error) return <div className="rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-2.5 text-[15px] text-[#fb2424]">{error}</div>
  if (ok) return <div className="rounded-[var(--radius-md)] px-4 py-2.5 text-[15px]" style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}>{ok}</div>
  return null
}

// ── Negocio ────────────────────────────────────────────
function NegocioTab() {
  const [s, setS] = useState<AppSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({})

  useEffect(() => { settingsApi.get().then(setS).catch(e => setMsg({ error: e.message })) }, [])

  if (!s) return <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>

  const togglePayment = (p: PaymentMethod) => {
    const has = s.payments.includes(p)
    setS({ ...s, payments: has ? s.payments.filter(x => x !== p) : [...s.payments, p] })
  }

  async function save() {
    setMsg({})
    if (!s) return
    try {
      setSaving(true)
      await settingsApi.update({
        business_name: s.business_name, business_address: s.business_address,
        business_phone: s.business_phone, payments: s.payments, bell_enabled: s.bell_enabled,
      })
      setMsg({ ok: 'Guardado' })
    } catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <Banner {...msg} />
      <Labeled label="Nombre del negocio">
        <input className={field} value={s.business_name ?? ''} onChange={e => setS({ ...s, business_name: e.target.value })} />
      </Labeled>
      <Labeled label="Dirección">
        <input className={field} value={s.business_address ?? ''} onChange={e => setS({ ...s, business_address: e.target.value })} placeholder="Opcional" />
      </Labeled>
      <Labeled label="Teléfono">
        <input className={field} inputMode="tel" value={s.business_phone ?? ''} onChange={e => setS({ ...s, business_phone: e.target.value })} placeholder="Opcional" />
      </Labeled>

      <Labeled label="Formas de pago aceptadas">
        <div className="flex flex-wrap gap-2">
          {ALL_PAYMENTS.map(p => {
            const active = s.payments.includes(p)
            return (
              <button key={p} onClick={() => togglePayment(p)}
                className="rounded-full px-3 py-2 text-[15px] font-medium"
                style={active ? { background: 'var(--color-accent)', color: '#111827' } : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
                {PAYMENT_LABELS[p]}
              </button>
            )
          })}
        </div>
      </Labeled>

      <label className="flex items-center justify-between">
        <span className="text-[17px] text-white">Sonido de campana en cocina</span>
        <input type="checkbox" checked={s.bell_enabled} onChange={e => setS({ ...s, bell_enabled: e.target.checked })}
               className="h-6 w-6 accent-[var(--color-accent)]" />
      </label>

      <Button block onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
    </div>
  )
}

// ── Estaciones + mapeo categoría→estación ──────────────
function EstacionesTab() {
  const [stations, setStations] = useState<Station[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({})

  const load = useCallback(async () => {
    try { setStations(await settingsApi.stations()); setCategories(await settingsApi.categories()) }
    catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }, [])
  useEffect(() => { load() }, [load])

  async function addStation() {
    if (!newName.trim()) return
    try { await settingsApi.addStation(newName.trim()); setNewName(''); load() }
    catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }
  async function renameStation(id: number, name: string) {
    try { await settingsApi.updateStation(id, { name }); load() } catch { /* noop */ }
  }
  async function setStation(catId: number, stationId: number | null) {
    try { await settingsApi.setCategoryStation(catId, stationId); load() }
    catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }

  return (
    <div className="flex flex-col gap-6">
      <Banner {...msg} />

      <section>
        <h2 className={label + ' mb-2'}>Estaciones</h2>
        <div className="flex flex-col gap-2">
          {stations.map(st => (
            <div key={st.id} className="flex items-center gap-2">
              <input className={field} defaultValue={st.name}
                     onBlur={e => e.target.value.trim() && e.target.value !== st.name && renameStation(st.id, e.target.value.trim())} />
              <span className="w-20 shrink-0 text-[13px] text-[var(--color-text-tertiary)]">{st.role_hint ?? '—'}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input className={field} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nueva estación" />
            <Button variant="tinted" onClick={addStation}><Plus size={18} /></Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className={label + ' mb-2'}>Cada categoría se prepara en…</h2>
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
          {categories.map((c, i) => (
            <div key={c.id} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
              <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
              <span className="flex-1 text-[15px] text-white">{c.name}</span>
              <select value={c.station_id ?? 0} onChange={e => setStation(c.id, Number(e.target.value) || null)}
                      className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-2 py-1.5 text-[13px] text-white outline-none">
                <option value={0}>Cocina (default)</option>
                {stations.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Categorías de menú ─────────────────────────────────
function MenuCategoriesTab() {
  const [cats, setCats] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState<{ error?: string }>({})

  const load = useCallback(async () => {
    try { setCats(await settingsApi.categories()) } catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }, [])
  useEffect(() => { load() }, [load])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Banner {...msg} />
        <Button onClick={() => { setEditing(null); setOpen(true) }}><Plus size={18} /> Nueva</Button>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
        {cats.map((c, i) => (
          <button key={c.id} onClick={() => { setEditing(c); setOpen(true) }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-2)] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
            <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
            <span className="flex-1 text-[15px] text-white">{c.name}</span>
            <span className="text-[12px] text-[var(--color-text-tertiary)]">
              {c.pricing_mode === 'tres_tamanos' ? '3 tamaños' : 'único'}{c.has_options && ' · armable'}{c.is_freeform && ' · libre'}
            </span>
            <Pencil size={16} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>
        ))}
      </div>
      <CategoryEditor open={open} category={editing} nextSort={cats.length + 1}
        onClose={() => setOpen(false)} onSaved={load} />
    </div>
  )
}

function CategoryEditor({ open, category, nextSort, onClose, onSaved }: {
  open: boolean; category: Category | null; nextSort: number; onClose: () => void; onSaved: () => void
}) {
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [color, setColor] = useState('#607D8B')
  const [mode, setMode] = useState<PricingMode>('unico')
  const [hasOptions, setHasOptions] = useState(false)
  const [isFreeform, setIsFreeform] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    if (category) {
      setName(category.name); setShortName(category.short_name ?? ''); setColor(category.color)
      setMode(category.pricing_mode); setHasOptions(category.has_options); setIsFreeform(category.is_freeform)
    } else {
      setName(''); setShortName(''); setColor('#607D8B'); setMode('unico'); setHasOptions(false); setIsFreeform(false)
    }
  }, [open, category])

  async function save() {
    setError('')
    if (!name.trim()) { setError('El nombre es obligatorio'); return }
    try {
      setSaving(true)
      await settingsApi.saveCategory({
        id: category?.id, name: name.trim(), short_name: shortName.trim() || null, color,
        pricing_mode: mode, has_options: hasOptions, is_freeform: isFreeform,
        sort_order: category?.sort_order ?? nextSort,
      })
      onSaved(); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Error') }
    finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onClose={onClose} title={category ? 'Editar categoría' : 'Nueva categoría'}
      footer={<div className="flex flex-col gap-2">{error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}<Button block onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button></div>}>
      <div className="flex flex-col gap-5">
        <Labeled label="Nombre"><input className={field} value={name} onChange={e => setName(e.target.value)} /></Labeled>
        <Labeled label="Abreviatura"><input className={field} value={shortName} onChange={e => setShortName(e.target.value)} placeholder="Opcional" /></Labeled>
        <Labeled label="Color">
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-11 w-14 rounded-[var(--radius-md)] bg-transparent" />
            <input className={field} value={color} onChange={e => setColor(e.target.value)} />
          </div>
        </Labeled>
        <Labeled label="Modo de precio">
          <Segmented<PricingMode> value={mode} onChange={setMode}
            options={[{ value: 'unico', label: 'Precio único' }, { value: 'tres_tamanos', label: 'Tres tamaños' }]} />
        </Labeled>
        <label className="flex items-center justify-between">
          <span className="text-[17px] text-white">Producto armable (opciones)</span>
          <input type="checkbox" checked={hasOptions} onChange={e => setHasOptions(e.target.checked)} className="h-6 w-6 accent-[var(--color-accent)]" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-[17px] text-white">Captura libre (al gusto)</span>
          <input type="checkbox" checked={isFreeform} onChange={e => setIsFreeform(e.target.checked)} className="h-6 w-6 accent-[var(--color-accent)]" />
        </label>
      </div>
    </Sheet>
  )
}

// ── Categorías de gasto ────────────────────────────────
function GastosTab() {
  const [cats, setCats] = useState<ExpenseCategory[]>([])
  const [newName, setNewName] = useState('')
  const [msg, setMsg] = useState<{ error?: string }>({})

  const load = useCallback(async () => {
    try { setCats(await settingsApi.expenseCategories()) } catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }, [])
  useEffect(() => { load() }, [load])

  async function add() {
    if (!newName.trim()) return
    try { await settingsApi.addExpenseCategory(newName.trim()); setNewName(''); load() }
    catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
  }

  return (
    <div className="flex flex-col gap-4">
      <Banner {...msg} />
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
        {cats.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
            <input className="flex-1 bg-transparent text-[15px] text-white outline-none" defaultValue={c.name}
                   onBlur={e => e.target.value.trim() && e.target.value !== c.name && settingsApi.updateExpenseCategory(c.id, { name: e.target.value.trim() }).then(load)} />
            <label className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)]">
              activa
              <input type="checkbox" checked={c.is_active}
                     onChange={e => settingsApi.updateExpenseCategory(c.id, { is_active: e.target.checked }).then(load)}
                     className="h-5 w-5 accent-[var(--color-accent)]" />
            </label>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input className={field} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nueva categoría de gasto" />
        <Button variant="tinted" onClick={add}><Plus size={18} /></Button>
      </div>
    </div>
  )
}

// ── Cuenta (contraseña) ────────────────────────────────
function CuentaTab() {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({})

  async function save() {
    setMsg({})
    if (p1.length < 6) { setMsg({ error: 'Mínimo 6 caracteres' }); return }
    if (p1 !== p2) { setMsg({ error: 'Las contraseñas no coinciden' }); return }
    try { setSaving(true); await settingsApi.changePassword(p1); setP1(''); setP2(''); setMsg({ ok: 'Contraseña actualizada' }) }
    catch (e) { setMsg({ error: e instanceof Error ? e.message : 'Error' }) }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <Banner {...msg} />
      <Labeled label="Nueva contraseña"><input type="password" className={field} value={p1} onChange={e => setP1(e.target.value)} /></Labeled>
      <Labeled label="Confirmar contraseña"><input type="password" className={field} value={p2} onChange={e => setP2(e.target.value)} /></Labeled>
      <Button block onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Cambiar contraseña'}</Button>
    </div>
  )
}

function Labeled({ label: l, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><span className={label}>{l}</span>{children}</div>
}
