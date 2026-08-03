'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import ProductConfig from '@/components/orders/ProductConfig'
import ProductPicker from '@/components/orders/ProductPicker'
import { useUser } from '@/lib/UserContext'
import { type Category, type ProductFull, menuApi, SIZE_LABELS } from '@/lib/menu'
import {
  type CartLine, type ServiceType, cartTotal, lineTotal, cartToPayload, ordersApi,
} from '@/lib/orders'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function NewOrderSheet({ open, onClose, onCreated }: Props) {
  const { user } = useUser()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState<CartLine[]>([])
  const [configuring, setConfiguring] = useState<ProductFull | null>(null)

  const [service, setService] = useState<ServiceType>('llevar')
  const [table, setTable] = useState('')
  const [customer, setCustomer] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true); setError('')
    Promise.all([menuApi.categories(), menuApi.products({ active: 'active' })])
      .then(([{ categories }, { products }]) => { setCategories(categories); setProducts(products) })
      .catch(e => setError(e instanceof Error ? e.message : 'Error al cargar el menú'))
      .finally(() => setLoading(false))
  }, [open])

  // limpiar al cerrar
  useEffect(() => {
    if (!open) { setCart([]); setService('llevar'); setTable(''); setCustomer(''); setOrderNotes('') }
  }, [open])


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
        onClose={onClose}
        title="Nueva orden"
        footer={
          <div className="flex flex-col gap-2">
            {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[var(--color-text-secondary)]">Total</span>
              <span className="tabular text-[22px] font-bold" style={{ color: 'var(--color-accent)' }}>
                ${cartTotal(cart).toFixed(0)}
              </span>
            </div>
            <Button block onClick={submit} disabled={saving || cart.length === 0}>
              {saving ? 'Enviando…' : `Enviar orden (${cart.length})`}
            </Button>
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
                    <span className="tabular mt-0.5 text-[15px] font-semibold text-white">{l.quantity}×</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-white">{l.product.name}</p>
                      <p className="text-[13px] text-[var(--color-text-secondary)]">{describe(l)}</p>
                    </div>
                    <span className="tabular text-[15px] font-medium text-white">${lineTotal(l).toFixed(0)}</span>
                    <button onClick={() => setCart(cart.filter(x => x.key !== l.key))}
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
              <ProductPicker categories={categories} products={products} onPick={setConfiguring} />
            )}
          </div>
        </div>
      </Sheet>

      {configuring && (
        <ProductConfig
          product={configuring}
          onClose={() => setConfiguring(null)}
          onAdd={line => setCart(c => [...c, line])}
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
  if (l.notes.trim()) parts.push(`“${l.notes.trim()}”`)
  return parts.join(' · ') || 'Sencillo'
}
