'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import ProductConfig from '@/components/orders/ProductConfig'
import ProductPicker from '@/components/orders/ProductPicker'
import { useUser } from '@/lib/UserContext'
import { type Category, type ProductFull, menuApi, SIZE_LABELS } from '@/lib/menu'
import {
  type CartLine, type ServiceType, cartTotal, lineTotal, cartToPayload, ordersApi, customExtraText,
} from '@/lib/orders'
import { type OrderDraft, newDraftId, saveDraft, deleteDraft, rehydrateLine } from '@/lib/drafts'

interface Props {
  open: boolean
  draft?: OrderDraft | null // retomar un borrador guardado en el dispositivo
  onClose: () => void
  onCreated: () => void
}

// Se monta al abrir (OrdersBoard), así que el estado inicial sale del borrador.
export default function NewOrderSheet({ open, draft, onClose, onCreated }: Props) {
  const { user } = useUser()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState<CartLine[]>(draft?.lines ?? [])
  // producto a configurar; con `line` se edita esa línea del carrito
  const [configuring, setConfiguring] = useState<{ product: ProductFull; line?: CartLine } | null>(null)

  const [draftId, setDraftId] = useState<string | null>(draft?.id ?? null)
  const [service, setService] = useState<ServiceType>(draft?.service ?? 'llevar')
  const [table, setTable] = useState(draft?.table ?? '')
  const [customer, setCustomer] = useState(draft?.customer ?? '')
  const [orderNotes] = useState(draft?.notes ?? '') // aún sin campo en pantalla; se conserva en el borrador
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true); setError('')
    Promise.all([menuApi.categories(), menuApi.products({ active: 'active' })])
      .then(([{ categories }, { products }]) => {
        setCategories(categories); setProducts(products)
        setCart(c => c.map(l => rehydrateLine(l, products))) // borrador al día con el menú
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Error al cargar el menú'))
      .finally(() => setLoading(false))
  }, [open])

  function persistDraft(): boolean {
    const id = draftId ?? newDraftId()
    const ok = saveDraft({
      id, savedAt: new Date().toISOString(), savedBy: user?.name ?? null,
      service, table, customer, notes: orderNotes, lines: cart,
    })
    if (ok) setDraftId(id)
    else setError('Este dispositivo no permite guardar borradores')
    return ok
  }

  function saveAndClose() {
    if (persistDraft()) onClose()
  }

  // Cerrar con productos sin enviar: un borrador retomado se actualiza solo;
  // una orden nueva pregunta si se guarda como borrador.
  function handleClose() {
    if (cart.length > 0) {
      if (draftId) { if (!persistDraft()) return }
      else if (confirm(`Tienes ${cart.length} producto(s) sin enviar.\n\n¿Guardar como borrador?\nAceptar: guardar · Cancelar: descartar`)) {
        if (!persistDraft()) return
      }
    }
    onClose()
  }

  function editLine(l: CartLine) {
    setConfiguring({ product: products.find(p => p.id === l.product.id) ?? l.product, line: l })
  }


  async function submit() {
    setError('')
    if (cart.length === 0) { setError('Agrega al menos un producto'); return }
    try {
      setSaving(true)
      await ordersApi.create(cartToPayload(cart, {
        created_by: user?.id ?? null,
        service,
        table_number: table ? Number(table) : null,
        customer_name: customer.trim() || null,
        notes: orderNotes.trim() || null,
      }))
      if (draftId) deleteDraft(draftId)
      onCreated()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la orden')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Sheet
        open={open}
        onClose={handleClose}
        title={draftId ? 'Borrador' : 'Nueva orden'}
        footer={
          <div className="flex flex-col gap-2">
            {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[var(--color-text-secondary)]">Total</span>
              <span className="tabular text-[22px] font-bold" style={{ color: 'var(--color-accent)' }}>
                ${cartTotal(cart).toFixed(0)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="tinted" onClick={saveAndClose} disabled={saving || cart.length === 0}>
                Guardar borrador
              </Button>
              <Button className="flex-1" onClick={submit} disabled={saving || cart.length === 0}>
                {saving ? 'Enviando…' : `Enviar orden (${cart.length})`}
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          {/* Datos de la orden */}
          <div className="flex flex-col gap-3">
            <Segmented<ServiceType>
              value={service}
              onChange={setService}
              options={[{ value: 'llevar', label: 'Para llevar' }, { value: 'aqui', label: 'Aquí' }]}
            />
            <div className="flex gap-2">
              <input className={field} inputMode="numeric" value={table}
                     onChange={e => setTable(e.target.value)} placeholder="Mesa" />
              <input className={field} value={customer}
                     onChange={e => setCustomer(e.target.value)} placeholder="Cliente (opcional)" />
            </div>
          </div>

          {/* Carrito */}
          {cart.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className={sectionLabel}>Carrito</span>
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)]">
                {cart.map((l, i) => (
                  <div key={l.key} className={`flex items-start gap-3 px-3 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                    {/* tocar la línea = editarla */}
                    <button onClick={() => editLine(l)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                      <span className="tabular mt-0.5 text-[15px] font-semibold text-white">{l.quantity}×</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-white">{l.product.name}</p>
                        <p className="text-[13px] text-[var(--color-text-secondary)]">{describe(l)}</p>
                      </div>
                      <span className="tabular text-[15px] font-medium text-white">${lineTotal(l).toFixed(0)}</span>
                    </button>
                    <button onClick={() => editLine(l)} aria-label="Editar"
                            className="text-[var(--color-text-secondary)] hover:text-white"><Pencil size={18} /></button>
                    <button onClick={() => setCart(cart.filter(x => x.key !== l.key))} aria-label="Quitar"
                            className="text-[#fb2424]"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menú */}
          <div className="flex flex-col gap-2">
            <span className={sectionLabel}>Agregar productos</span>
            {loading ? (
              <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando menú…</p>
            ) : products.length === 0 ? (
              <p className="text-[15px] text-[var(--color-text-secondary)]">No hay productos activos. Crea productos en Menú.</p>
            ) : (
              <ProductPicker categories={categories} products={products} onPick={p => setConfiguring({ product: p })} />
            )}
          </div>
        </div>
      </Sheet>

      {configuring && (
        <ProductConfig
          product={configuring.product}
          initial={configuring.line}
          onClose={() => setConfiguring(null)}
          onAdd={line => setCart(c => c.some(x => x.key === line.key)
            ? c.map(x => (x.key === line.key ? line : x))
            : [...c, line])}
        />
      )}
    </>
  )
}

const field =
  'w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]'
const sectionLabel = 'text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]'

function describe(l: CartLine): string {
  const parts: string[] = []
  if (l.product.category?.pricing_mode === 'tres_tamanos') parts.push(SIZE_LABELS[l.size])
  const removed = l.product.ingredients.filter(i => l.removedIngredientIds.includes(i.id)).map(i => i.name)
  if (removed.length) parts.push(`Sin: ${removed.join(', ')}`)
  const extras = l.product.extras.filter(e => l.extraIds.includes(e.id)).map(e => e.name)
  if (extras.length) parts.push(`Con: ${extras.join(', ')}`)
  const opts = l.product.option_groups.flatMap(g => g.items).filter(o => l.optionIds.includes(o.id)).map(o => o.name)
  if (opts.length) parts.push(opts.join(', '))
  for (const e of l.customExtras) parts.push(customExtraText(e))
  if (l.notes.trim()) parts.push(`“${l.notes.trim()}”`)
  return parts.join(' · ') || 'Sencillo'
}
