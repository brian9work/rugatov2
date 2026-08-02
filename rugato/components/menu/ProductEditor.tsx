'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import {
  type Category, type ProductFull, type SaveProductPayload, type ProductSize,
  SIZE_LABELS, sizesFor, menuApi,
} from '@/lib/menu'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  categories: Category[]
  product: ProductFull | null // null = alta
}

const fieldCls =
  'w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-[17px] ' +
  'text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 ' +
  'focus:ring-[var(--color-accent)]'

const labelCls = 'text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]'

export default function ProductEditor({ open, onClose, onSaved, categories, product }: Props) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id ?? 0)
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [prices, setPrices] = useState<Record<ProductSize, string>>({
    unico: '', chico: '', mediano: '', grande: '',
  })
  const [ingredients, setIngredients] = useState<string[]>([])
  const [extras, setExtras] = useState<{ name: string; price: string }[]>([])
  const [groups, setGroups] = useState<
    { name: string; min: string; max: string; items: { name: string; extra: string }[] }[]
  >([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const category = useMemo(
    () => categories.find(c => c.id === categoryId) ?? null,
    [categories, categoryId],
  )
  const sizes = category ? sizesFor(category.pricing_mode) : ['unico' as ProductSize]

  // Cargar estado al abrir
  useEffect(() => {
    if (!open) return
    setError('')
    if (product) {
      setName(product.name)
      setCategoryId(product.category_id)
      setDescription(product.description ?? '')
      setIsActive(product.is_active)
      const p: Record<ProductSize, string> = { unico: '', chico: '', mediano: '', grande: '' }
      product.prices.forEach(pr => { p[pr.size] = String(pr.price) })
      setPrices(p)
      setIngredients(product.ingredients.map(i => i.name))
      setExtras(product.extras.map(e => ({ name: e.name, price: String(e.price) })))
      setGroups(product.option_groups.map(g => ({
        name: g.name, min: String(g.min_choices), max: String(g.max_choices),
        items: g.items.map(it => ({ name: it.name, extra: String(it.extra_price) })),
      })))
    } else {
      setName(''); setCategoryId(categories[0]?.id ?? 0); setDescription(''); setIsActive(true)
      setPrices({ unico: '', chico: '', mediano: '', grande: '' })
      setIngredients([]); setExtras([]); setGroups([])
    }
  }, [open, product, categories])

  async function handleSave() {
    setError('')
    if (!name.trim()) { setError('El nombre es obligatorio'); return }
    const priceRows = sizes
      .filter(s => prices[s] !== '' && !Number.isNaN(Number(prices[s])))
      .map(s => ({ size: s, price: Number(prices[s]) }))
    if (priceRows.length === 0) { setError('Agrega al menos un precio'); return }

    const payload: SaveProductPayload = {
      id: product?.id ?? null,
      category_id: categoryId,
      name: name.trim(),
      description: description.trim() || null,
      is_active: isActive,
      prices: priceRows,
      ingredients: ingredients.filter(n => n.trim()).map(n => ({ name: n.trim() })),
      extras: extras.filter(e => e.name.trim()).map(e => ({ name: e.name.trim(), price: Number(e.price) || 0 })),
      option_groups: (category?.has_options ? groups : [])
        .filter(g => g.name.trim())
        .map((g, gi) => ({
          name: g.name.trim(),
          min_choices: Number(g.min) || 0,
          max_choices: Number(g.max) || 1,
          sort_order: gi,
          items: g.items.filter(it => it.name.trim()).map((it, ii) => ({
            name: it.name.trim(), extra_price: Number(it.extra) || 0, sort_order: ii,
          })),
        })),
    }

    try {
      setSaving(true)
      await menuApi.save(payload)
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
      footer={
        <div className="flex flex-col gap-2">
          {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
          <Button block onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Datos básicos */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Nombre</label>
          <input className={fieldCls} value={name} onChange={e => setName(e.target.value)}
                 placeholder="Ej. Licuado de fresa" />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Categoría</label>
          <select className={fieldCls} value={categoryId}
                  onChange={e => setCategoryId(Number(e.target.value))}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {category && (
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              {category.pricing_mode === 'tres_tamanos' ? 'Tres tamaños' : 'Precio único'}
              {category.has_options && ' · Armable'}
              {category.is_freeform && ' · Al gusto'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Descripción</label>
          <textarea className={`${fieldCls} min-h-20`} value={description}
                    onChange={e => setDescription(e.target.value)} placeholder="Opcional" />
        </div>

        {/* Precios */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Precios</label>
          <div className="flex flex-col gap-2">
            {sizes.map(s => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-24 text-[15px] text-[var(--color-text-secondary)]">
                  {SIZE_LABELS[s]}
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">$</span>
                  <input className={`${fieldCls} tabular pl-7`} inputMode="decimal"
                         value={prices[s]} onChange={e => setPrices({ ...prices, [s]: e.target.value })}
                         placeholder="0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredientes quitables */}
        <ListEditor
          label="Ingredientes que se pueden quitar"
          items={ingredients}
          onAdd={() => setIngredients([...ingredients, ''])}
          onRemove={i => setIngredients(ingredients.filter((_, x) => x !== i))}
          render={(v, i) => (
            <input className={fieldCls} value={v} placeholder="Ej. Cebolla"
                   onChange={e => setIngredients(ingredients.map((x, xi) => xi === i ? e.target.value : x))} />
          )}
        />

        {/* Extras de pago */}
        <ListEditor
          label="Extras de pago"
          items={extras}
          onAdd={() => setExtras([...extras, { name: '', price: '' }])}
          onRemove={i => setExtras(extras.filter((_, x) => x !== i))}
          render={(v, i) => (
            <div className="flex gap-2">
              <input className={fieldCls} value={v.name} placeholder="Ej. Queso"
                     onChange={e => setExtras(extras.map((x, xi) => xi === i ? { ...x, name: e.target.value } : x))} />
              <div className="relative w-28 shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">$</span>
                <input className={`${fieldCls} tabular pl-7`} inputMode="decimal" value={v.price} placeholder="0"
                       onChange={e => setExtras(extras.map((x, xi) => xi === i ? { ...x, price: e.target.value } : x))} />
              </div>
            </div>
          )}
        />

        {/* Grupos de opciones (solo categorías armables) */}
        {category?.has_options && (
          <div className="flex flex-col gap-3">
            <label className={labelCls}>Grupos de opciones (armable)</label>
            {groups.map((g, gi) => (
              <div key={gi} className="rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)] p-3">
                <div className="flex items-center gap-2">
                  <input className={fieldCls} value={g.name} placeholder="Ej. Proteína"
                         onChange={e => setGroups(groups.map((x, xi) => xi === gi ? { ...x, name: e.target.value } : x))} />
                  <button onClick={() => setGroups(groups.filter((_, xi) => xi !== gi))}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[#fb2424]">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <label className="flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)]">
                    Mín
                    <input className={`${fieldCls} tabular w-16`} inputMode="numeric" value={g.min}
                           onChange={e => setGroups(groups.map((x, xi) => xi === gi ? { ...x, min: e.target.value } : x))} />
                  </label>
                  <label className="flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)]">
                    Máx
                    <input className={`${fieldCls} tabular w-16`} inputMode="numeric" value={g.max}
                           onChange={e => setGroups(groups.map((x, xi) => xi === gi ? { ...x, max: e.target.value } : x))} />
                  </label>
                </div>
                {/* items del grupo */}
                <div className="mt-2 flex flex-col gap-2">
                  {g.items.map((it, ii) => (
                    <div key={ii} className="flex gap-2">
                      <input className={fieldCls} value={it.name} placeholder="Ej. Pollo"
                             onChange={e => setGroups(groups.map((x, xi) => xi === gi
                               ? { ...x, items: x.items.map((y, yi) => yi === ii ? { ...y, name: e.target.value } : y) } : x))} />
                      <div className="relative w-24 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">$</span>
                        <input className={`${fieldCls} tabular pl-7`} inputMode="decimal" value={it.extra} placeholder="0"
                               onChange={e => setGroups(groups.map((x, xi) => xi === gi
                                 ? { ...x, items: x.items.map((y, yi) => yi === ii ? { ...y, extra: e.target.value } : y) } : x))} />
                      </div>
                      <button onClick={() => setGroups(groups.map((x, xi) => xi === gi
                                ? { ...x, items: x.items.filter((_, yi) => yi !== ii) } : x))}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[#fb2424]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setGroups(groups.map((x, xi) => xi === gi
                            ? { ...x, items: [...x.items, { name: '', extra: '' }] } : x))}
                          className="flex items-center gap-1 text-[15px] text-[var(--color-accent)]">
                    <Plus size={16} /> Opción
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setGroups([...groups, { name: '', min: '0', max: '1', items: [] }])}
                    className="flex items-center gap-1 text-[15px] text-[var(--color-accent)]">
              <Plus size={16} /> Agregar grupo
            </button>
          </div>
        )}

        {/* Activo */}
        <label className="flex items-center justify-between">
          <span className="text-[17px] text-white">Activo</span>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                 className="h-6 w-6 accent-[var(--color-accent)]" />
        </label>
      </div>
    </Sheet>
  )
}

// Editor genérico de lista con "Agregar" / "Quitar"
function ListEditor<T>({ label, items, onAdd, onRemove, render }: {
  label: string
  items: T[]
  onAdd: () => void
  onRemove: (i: number) => void
  render: (item: T, i: number) => React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">{render(item, i)}</div>
          <button onClick={() => onRemove(i)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[#fb2424]">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button onClick={onAdd} className="flex items-center gap-1 self-start text-[15px] text-[var(--color-accent)]">
        <Plus size={16} /> Agregar
      </button>
    </div>
  )
}
