'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Sheet from '@/components/ui/Sheet'
import {
  type ExpenseCategory, type ExpenseWithCategory, type Sale, expensesApi,
} from '@/lib/expenses'

type Movement =
  | { kind: 'venta'; id: number; label: string; amount: number; at: string }
  | { kind: 'gasto'; id: number; label: string; sub: string; amount: number; at: string }

export default function ExpensesManager() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('')
      const [cats, exps, sls] = await Promise.all([
        expensesApi.categories(),
        expensesApi.list('hoy'),
        expensesApi.sales('hoy'),
      ])
      setCategories(cats); setExpenses(exps); setSales(sls)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const ventasTotal = sales.reduce((a, s) => a + s.total, 0)
  const gastosTotal = expenses.reduce((a, e) => a + Number(e.amount), 0)
  const balance = ventasTotal - gastosTotal

  // movimientos del día, ventas + gastos, ordenados por hora desc
  const movements: Movement[] = [
    ...sales.map<Movement>(s => ({ kind: 'venta', id: s.id, label: `Venta #${s.folio}`, amount: s.total, at: s.at })),
    ...expenses.map<Movement>(e => ({
      kind: 'gasto', id: e.id, label: e.category?.name ?? 'Gasto',
      sub: e.reason || 'Sin descripción', amount: Number(e.amount), at: e.created_at,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  async function remove(id: number) {
    if (!confirm('¿Eliminar este gasto?')) return
    try { await expensesApi.remove(id); load() }
    catch (e) { alert(e instanceof Error ? e.message : 'No se pudo eliminar') }
  }

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-[34px] font-bold tracking-tight text-white">Gastos</h1>
        <Button onClick={() => setAddOpen(true)}><Plus size={20} /> Nuevo</Button>
      </div>
      <p className="mb-4 text-[15px] text-[var(--color-text-secondary)]">Movimientos de hoy</p>

      {/* Resumen del día */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <SummaryCard label="Ventas" value={ventasTotal} color="var(--color-role-admin)" />
        <SummaryCard label="Gastos" value={gastosTotal} color="#fb2424" />
        <SummaryCard label="Balance" value={balance} color={balance >= 0 ? 'var(--color-role-admin)' : '#fb2424'} />
      </div>

      {error && <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">{error}</div>}

      {loading ? (
        <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>
      ) : movements.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <Wallet size={48} className="text-[var(--color-text-tertiary)]" />
          <p className="text-[17px] font-semibold text-white">Sin movimientos hoy</p>
          <p className="text-[15px] text-[var(--color-text-secondary)]">Las ventas entregadas y los gastos aparecerán aquí.</p>
          <Button onClick={() => setAddOpen(true)}><Plus size={20} /> Registrar gasto</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
          {movements.map((m, i) => {
            const isVenta = m.kind === 'venta'
            const color = isVenta ? 'var(--color-role-admin)' : '#fb2424'
            return (
              <div key={`${m.kind}-${m.id}`} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
                  {isVenta ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-white">{m.label}</p>
                  <p className="text-[13px] text-[var(--color-text-secondary)]">
                    {(isVenta ? 'Venta' : m.sub)} · {fmtTime(m.at)}
                  </p>
                </div>
                <span className="tabular text-[17px] font-semibold" style={{ color }}>
                  {isVenta ? '+' : '−'}${m.amount.toFixed(2)}
                </span>
                {!isVenta && (
                  <button onClick={() => remove(m.id)} className="text-[#fb2424]"><Trash2 size={18} /></button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <AddExpenseSheet open={addOpen} onClose={() => setAddOpen(false)} onSaved={load} categories={categories} />
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-3">
      <p className="text-[12px] uppercase tracking-wide text-[var(--color-text-secondary)]">{label}</p>
      <p className="tabular text-[20px] font-bold" style={{ color }}>${value.toFixed(0)}</p>
    </div>
  )
}

function AddExpenseSheet({ open, onClose, onSaved, categories }: {
  open: boolean; onClose: () => void; onSaved: () => void; categories: ExpenseCategory[]
}) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<number>(0)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) { setAmount(''); setReason(''); setCategoryId(categories[0]?.id ?? 0); setError('') }
  }, [open, categories])

  async function save() {
    setError('')
    const value = Number(amount)
    if (!value || value <= 0) { setError('Ingresa un monto válido'); return }
    if (!categoryId) { setError('Elige una categoría'); return }
    try {
      setSaving(true)
      await expensesApi.add({ category_id: categoryId, amount: value, reason: reason.trim() || null })
      onSaved(); onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally { setSaving(false) }
  }

  const field =
    'w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]'
  const label = 'text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]'

  return (
    <Sheet
      open={open} onClose={onClose} title="Nuevo gasto"
      footer={
        <div className="flex flex-col gap-2">
          {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
          <Button block onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className={label}>Monto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">$</span>
            <input className={`${field} tabular pl-7`} inputMode="decimal" value={amount}
                   onChange={e => setAmount(e.target.value)} placeholder="0.00" autoFocus />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className={label}>Categoría</label>
          <select className={field} value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className={label}>Descripción</label>
          <textarea className={`${field} min-h-20`} value={reason}
                    onChange={e => setReason(e.target.value)} placeholder="Opcional" />
        </div>
      </div>
    </Sheet>
  )
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}
