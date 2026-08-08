'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChefHat, Check, ArrowRight, Pencil, Trash2, Plus, Clock } from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import Stepper from '@/components/ui/Stepper'
import StatusBadge from '@/components/ui/StatusBadge'
import AddItemSheet from '@/components/orders/AddItemSheet'
import { supabase } from '@/lib/supabase'
import {
  type OrderWithItems, type OrderItem, type OrderAudit, type OrderStatus,
  type PaymentMethod, type ServiceType, type Actor, type StaffMember,
  SERVICE_LABELS, PAYMENT_LABELS, isEditable, ordersApi, fetchStaff,
} from '@/lib/orders'
import { STATUS_LABELS, STATUS_HEX } from '@/lib/roles'

export default function OrderDetail({ order, actor, canDeliver, canEdit = true, canEditPrice = false, canEditPayment = false, onClose, onChanged }: {
  order: OrderWithItems
  actor: Actor
  canDeliver: boolean
  canEdit?: boolean
  canEditPrice?: boolean
  canEditPayment?: boolean
  onClose: () => void
  onChanged: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [payment, setPayment] = useState<PaymentMethod>('efectivo')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [audit, setAudit] = useState<OrderAudit[]>([])

  const editable = canEdit && isEditable(order.status)

  // datos editables
  const [service, setService] = useState<ServiceType>(order.service)
  const [table, setTable] = useState(order.table_number?.toString() ?? '')
  const [customer, setCustomer] = useState(order.customer_name ?? '')
  const [notes, setNotes] = useState(order.notes ?? '')

  const loadAudit = useCallback(async () => {
    const { data } = await supabase.from('order_audit')
      .select('*').eq('order_id', order.id).order('id', { ascending: true })
    setAudit((data ?? []) as OrderAudit[])
  }, [order.id])

  useEffect(() => { loadAudit() }, [loadAudit, order])

  const [flashId, setFlashId] = useState<number | null>(null)

  // Empleado al que se le asigna el cobro (por defecto, el usuario actual).
  const [collectors, setCollectors] = useState<StaffMember[]>([])
  const [collectorId, setCollectorId] = useState<number | null>(actor.id)
  useEffect(() => {
    if (canDeliver && order.status !== 'entregado') {
      fetchStaff().then(list => {
        setCollectors(list)
        setCollectorId(cur => cur ?? actor.id ?? list[0]?.id ?? null)
      }).catch(() => {})
    }
  }, [canDeliver, order.status, actor.id])

  async function run(fn: () => Promise<unknown>) {
    setError('')
    try { setBusy(true); await fn(); onChanged(); await loadAudit() }
    catch (e) { setError(e instanceof Error ? e.message : 'Error') }
    finally { setBusy(false) }
  }

  // Avanza el estado de una línea + destello de confirmación.
  async function advance(itemId: number, target: OrderStatus) {
    await run(() => ordersApi.setItemStatus(itemId, target))
    setFlashId(itemId)
    setTimeout(() => setFlashId(null), 700)
  }

  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState('')

  async function savePrice() {
    const v = Number(priceInput)
    if (Number.isNaN(v) || v < 0) { setError('Total inválido'); return }
    await run(() => ordersApi.setTotal(order.id, v, actor))
    setEditingPrice(false)
  }

  const next: Record<string, OrderStatus | undefined> = { pendiente: 'preparando', preparando: 'listo' }
  const allReady = order.items.every(i => i.status === 'listo' || i.status === 'cancelado')

  async function saveData() {
    await run(() => ordersApi.updateData(order.id, {
      service, table_number: table ? Number(table) : null,
      customer_name: customer.trim() || null, notes: notes.trim() || null,
    }, actor))
  }

  return (
    <>
      <Sheet
        open onClose={onClose} title={`Orden #${order.folio}`}
        footer={!editing && (
          <div className="flex flex-col gap-2">
            {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
            {canDeliver && order.status !== 'entregado' && (
              <div className="flex flex-col gap-2">
                <Segmented<PaymentMethod>
                  value={payment} onChange={setPayment}
                  options={(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map(p => ({ value: p, label: PAYMENT_LABELS[p] }))}
                />
                <label className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                  Cobra:
                  <select value={collectorId ?? ''} onChange={e => setCollectorId(Number(e.target.value) || null)}
                          className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2 text-[15px] text-white outline-none">
                    {collectors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <Button block disabled={busy || !allReady}
                        onClick={() => run(() => ordersApi.deliver(order.id, collectorId, payment))}>
                  {allReady ? `Entregar y cobrar $${Number(order.total).toFixed(0)}` : 'Faltan productos por estar listos'}
                </Button>
              </div>
            )}
            {editable && (
              <Button variant="destructive" block disabled={busy}
                      onClick={() => run(() => ordersApi.cancel(order.id))}>
                Cancelar orden
              </Button>
            )}
          </div>
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Datos + editar */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-x-3 text-[15px] text-[var(--color-text-secondary)]">
                <span>{SERVICE_LABELS[order.service]}</span>
                {order.table_number != null && <span>· Mesa {order.table_number}</span>}
                {order.customer_name && <span>· {order.customer_name}</span>}
              </div>
              <div className="flex flex-col text-[13px] text-[var(--color-text-tertiary)]">
                {order.created_by_name && <span>Tomó: {order.created_by_name}</span>}
                {order.delivered_by_name && <span>Cobró: {order.delivered_by_name}</span>}
              </div>
            </div>
            {editable && (
              <button onClick={() => setEditing(e => !e)}
                      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold"
                      style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}>
                <Pencil size={14} /> {editing ? 'Listo' : 'Editar'}
              </button>
            )}
          </div>

          {error && editing && <p className="text-[15px] text-[#fb2424]">{error}</p>}

          {/* Editor de datos */}
          {editing && (
            <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)] p-3">
              <Segmented<ServiceType> value={service} onChange={setService}
                options={[{ value: 'llevar', label: 'Para llevar' }, { value: 'aqui', label: 'Aquí' }]} />
              <div className="flex gap-2">
                <input className={field} inputMode="numeric" value={table} onChange={e => setTable(e.target.value)} placeholder="Mesa" />
                <input className={field} value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Cliente" />
              </div>
              <textarea className={`${field} min-h-14`} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas" />
              <Button variant="tinted" block disabled={busy} onClick={saveData}>Guardar datos</Button>
            </div>
          )}

          {/* Líneas */}
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)]">
            {order.items.map((it, i) => {
              const target = next[it.status]
              const clickable = !editing && !!target
              const border = i > 0 ? 'border-t border-[var(--color-border)]' : ''
              const flash = flashId === it.id ? 'rg-flash' : ''
              const Icon = target === 'preparando' ? ChefHat : target === 'listo' ? Check : ArrowRight

              const content = (
                <>
                  {!editing && <span className="tabular mt-0.5 text-[15px] font-semibold text-white">{it.quantity}×</span>}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-white">{it.product_name}</p>
                    <p className="text-[13px] text-[var(--color-text-secondary)]">{itemDetail(it)}</p>
                    {it.station_name && <p className="text-[12px] text-[var(--color-text-tertiary)]">{it.station_name}</p>}
                    {editing && (
                      <div className="mt-2">
                        <Stepper value={it.quantity} onChange={q => run(() => ordersApi.setItemQty(it.id, q, actor))} />
                      </div>
                    )}
                  </div>
                  {editing ? (
                    <button disabled={busy} onClick={() => run(() => ordersApi.removeItem(it.id, actor))}
                            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[#fb2424]">
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={it.status} />
                      {target && (
                        <span className="rg-pulse inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                              style={{ background: `color-mix(in srgb, ${STATUS_HEX[target]} 18%, transparent)`, color: STATUS_HEX[target] }}>
                          <Icon size={14} strokeWidth={2.5} />
                          {STATUS_LABELS[target]}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )

              return clickable ? (
                <button key={it.id} type="button" disabled={busy}
                        onClick={() => advance(it.id, target)}
                        className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-2)] ${border} ${flash}`}>
                  {content}
                </button>
              ) : (
                <div key={it.id} className={`flex items-start gap-3 px-3 py-3 ${border} ${flash}`}>
                  {content}
                </div>
              )
            })}
          </div>

          {editing && (
            <Button variant="tinted" block onClick={() => setAddOpen(true)}>
              <Plus size={18} /> Agregar producto
            </Button>
          )}

          {!editing && order.items.some(it => next[it.status]) && (
            <p className="text-center text-[13px] text-[var(--color-text-tertiary)]">Toca un producto para avanzar su estado</p>
          )}

          {/* Total */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] text-[var(--color-text-secondary)]">Total</span>
            {editingPrice ? (
              <div className="flex items-center gap-2">
                <div className="relative w-28">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">$</span>
                  <input autoFocus inputMode="decimal" value={priceInput} onChange={e => setPriceInput(e.target.value)}
                         className="tabular w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] py-2 pl-7 pr-2 text-[17px] text-white outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                </div>
                <Button variant="tinted" disabled={busy} onClick={savePrice}>Guardar</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="tabular text-[20px] font-bold" style={{ color: 'var(--color-accent)' }}>${Number(order.total).toFixed(0)}</span>
                {canEditPrice && (
                  <button onClick={() => { setPriceInput(String(order.total)); setEditingPrice(true) }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-white">
                    <Pencil size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Forma de pago (corregir en órdenes ya cobradas) */}
          {order.status === 'entregado' && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">Forma de pago</span>
              {canEditPayment ? (
                <Segmented<PaymentMethod>
                  value={(order.payment ?? 'efectivo') as PaymentMethod}
                  onChange={p => run(() => ordersApi.setPayment(order.id, p, actor))}
                  options={(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map(p => ({ value: p, label: PAYMENT_LABELS[p] }))}
                />
              ) : (
                <span className="text-[15px] text-white">{order.payment ? PAYMENT_LABELS[order.payment] : 'Sin registrar'}</span>
              )}
            </div>
          )}

          {/* Historial */}
          {audit.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                <Clock size={14} /> Historial
              </h3>
              <div className="flex flex-col gap-2">
                {audit.map(a => (
                  <div key={a.id} className="flex items-start gap-2 text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-tertiary)]" />
                    <div className="flex-1">
                      <span className="text-white">{auditText(a)}</span>
                      <span className="text-[var(--color-text-tertiary)]"> · {a.user_name ?? 'Sistema'} · {fmtTime(a.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Sheet>

      <AddItemSheet open={addOpen} onClose={() => setAddOpen(false)}
                    onAdd={line => run(() => ordersApi.addItem(order.id, line, actor))} />
    </>
  )
}

const field =
  'w-full rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 py-2.5 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]'

function itemDetail(it: OrderItem): string {
  const d = (it.details ?? {}) as { removed?: string[]; extras?: { name: string }[]; options?: { name: string }[] }
  const parts: string[] = []
  if (it.size !== 'unico') parts.push(it.size)
  if (d.removed?.length) parts.push(`Sin: ${d.removed.join(', ')}`)
  if (d.extras?.length) parts.push(`Con: ${d.extras.map(e => e.name).join(', ')}`)
  if (d.options?.length) parts.push(d.options.map(o => o.name).join(', '))
  if (it.notes) parts.push(`“${it.notes}”`)
  return parts.join(' · ') || 'Sencillo'
}

function auditText(a: OrderAudit): string {
  const d = (a.detail ?? {}) as Record<string, unknown>
  switch (a.action) {
    case 'crear':    return 'Creó la orden'
    case 'agregar':  return `Agregó ${d.cantidad}× ${d.producto}`
    case 'quitar':   return `Quitó ${d.producto}`
    case 'cantidad': return `Cambió ${d.producto} de ${d.de} a ${d.a}`
    case 'datos':    return 'Editó los datos'
    case 'precio':   return `Cambió el total de $${d.de} a $${d.a}`
    case 'pago':     return `Cambió la forma de pago de ${d.de ?? '—'} a ${d.a}`
    case 'entregar': return `Entregó y cobró (${d.payment})`
    case 'cancelar': return 'Canceló la orden'
    default:         return a.action
  }
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}
