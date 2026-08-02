'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, ClipboardList, RotateCw, ChefHat, Check, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Sheet from '@/components/ui/Sheet'
import Segmented from '@/components/ui/Segmented'
import StatusBadge from '@/components/ui/StatusBadge'
import NewOrderSheet from '@/components/orders/NewOrderSheet'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/UserContext'
import {
  type OrderWithItems, type OrderItem, type PaymentMethod,
  SERVICE_LABELS, PAYMENT_LABELS, ordersApi,
} from '@/lib/orders'
import { STATUS_LABELS, STATUS_HEX } from '@/lib/roles'
import { type OrderStatus } from '@/lib/orders'
import { mexicoTodayStartISO } from '@/lib/time'

const ACTIVE = ['pendiente', 'preparando', 'listo'] as const

export default function OrdersBoard() {
  const { user } = useUser()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [selected, setSelected] = useState<OrderWithItems | null>(null)
  const knownIds = useRef<Set<number>>(new Set())
  const audioRef = useRef<AudioContext | null>(null)

  const load = useCallback(async () => {
    setError('')
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .in('status', ACTIVE as unknown as string[])
      .gte('created_at', mexicoTodayStartISO()) // solo hoy (horario mexicano)
      .order('created_at', { ascending: true })
    if (error) { setError(error.message); setLoading(false); return }
    const rows = (data ?? []) as OrderWithItems[]
    setOrders(rows)
    setSelected(prev => prev ? rows.find(o => o.id === prev.id) ?? null : null)
    setLoading(false)
    return rows
  }, [])

  // campana (Web Audio) — heredada del 0.1 §7.6
  const bell = useCallback(() => {
    try {
      audioRef.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioRef.current
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain()
      o1.type = o2.type = 'sine'
      o1.frequency.value = 830; o2.frequency.value = 1245
      g.gain.setValueAtTime(0.5, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      o1.connect(g); o2.connect(g); g.connect(ctx.destination)
      o1.start(); o2.start(); o1.stop(ctx.currentTime + 1.2); o2.stop(ctx.currentTime + 1.2)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    load().then(rows => { knownIds.current = new Set((rows ?? []).map(o => o.id)) })

    const channel = supabase
      .channel('orders-board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const rows = await load()
        if (rows) {
          for (const o of rows) if (!knownIds.current.has(o.id)) { bell(); break }
          knownIds.current = new Set(rows.map(o => o.id))
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => { load() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [load, bell])

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[34px] font-bold tracking-tight text-white">Órdenes</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => load()} title="Actualizar"
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-white">
            <RotateCw size={18} />
          </button>
          <Button onClick={() => setNewOpen(true)}><Plus size={20} /> Nueva</Button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">{error}</div>}

      {loading ? (
        <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <ClipboardList size={48} className="text-[var(--color-text-tertiary)]" />
          <p className="text-[17px] font-semibold text-white">Sin órdenes pendientes</p>
          <p className="text-[15px] text-[var(--color-text-secondary)]">Las órdenes nuevas aparecerán aquí en tiempo real.</p>
          <Button onClick={() => setNewOpen(true)}><Plus size={20} /> Nueva orden</Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {orders.map(o => (
            <button key={o.id} onClick={() => setSelected(o)}
                    className="flex flex-col gap-2 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 text-left hover:brightness-110">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-bold text-white">#{o.folio}</span>
                <StatusBadge status={o.status} />
              </div>
              <div className="flex flex-wrap gap-x-3 text-[13px] text-[var(--color-text-secondary)]">
                <span>{SERVICE_LABELS[o.service]}</span>
                {o.table_number != null && <span>Mesa {o.table_number}</span>}
                {o.customer_name && <span>{o.customer_name}</span>}
              </div>
              <div className="flex flex-col gap-0.5">
                {o.items.map(it => (
                  <div key={it.id} className="flex items-center gap-2 text-[13px]">
                    <span className="tabular text-white">{it.quantity}×</span>
                    <span className="flex-1 truncate text-white">{it.product_name}</span>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{STATUS_LABELS[it.status]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[13px] text-[var(--color-text-tertiary)]">{timeAgo(o.created_at)}</span>
                <span className="tabular text-[17px] font-semibold" style={{ color: 'var(--color-accent)' }}>${Number(o.total).toFixed(0)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <NewOrderSheet open={newOpen} onClose={() => setNewOpen(false)} onCreated={load} />

      {selected && (
        <OrderDetail
          order={selected}
          canDeliver={user?.type === 'admin' || user?.type === 'user'}
          deliveredBy={user?.id ?? null}
          onClose={() => setSelected(null)}
          onChanged={load}
        />
      )}
    </div>
  )
}

function OrderDetail({ order, canDeliver, deliveredBy, onClose, onChanged }: {
  order: OrderWithItems
  canDeliver: boolean
  deliveredBy: number | null
  onClose: () => void
  onChanged: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [payment, setPayment] = useState<PaymentMethod>('efectivo')
  const [error, setError] = useState('')

  async function run(fn: () => Promise<unknown>) {
    setError('')
    try { setBusy(true); await fn(); onChanged() }
    catch (e) { setError(e instanceof Error ? e.message : 'Error') }
    finally { setBusy(false) }
  }

  const next: Record<string, OrderItem['status'] | undefined> = {
    pendiente: 'preparando', preparando: 'listo',
  }
  const allReady = order.items.every(i => i.status === 'listo' || i.status === 'cancelado')

  return (
    <Sheet
      open onClose={onClose} title={`Orden #${order.folio}`}
      footer={
        <div className="flex flex-col gap-2">
          {error && <p className="text-center text-[15px] text-[#fb2424]">{error}</p>}
          {canDeliver && order.status !== 'entregado' && (
            <div className="flex flex-col gap-2">
              <Segmented<PaymentMethod>
                value={payment} onChange={setPayment}
                options={(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map(p => ({ value: p, label: PAYMENT_LABELS[p] }))}
              />
              <Button block disabled={busy || !allReady}
                      onClick={() => run(() => ordersApi.deliver(order.id, deliveredBy, payment))}>
                {allReady ? `Entregar y cobrar $${Number(order.total).toFixed(0)}` : 'Faltan productos por estar listos'}
              </Button>
            </div>
          )}
          <Button variant="destructive" block disabled={busy}
                  onClick={() => run(() => ordersApi.cancel(order.id))}>
            Cancelar orden
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-3 text-[15px] text-[var(--color-text-secondary)]">
          <span>{SERVICE_LABELS[order.service]}</span>
          {order.table_number != null && <span>· Mesa {order.table_number}</span>}
          {order.customer_name && <span>· {order.customer_name}</span>}
        </div>
        {order.notes && <p className="text-[15px] text-white">{order.notes}</p>}

        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)]">
          {order.items.map((it, i) => {
            const target = next[it.status]
            const advance = () => target && run(() => ordersApi.setItemStatus(it.id, target))
            return (
              <button
                key={it.id}
                type="button"
                disabled={busy || !target}
                onClick={advance}
                className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors
                  ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}
                  ${target ? 'hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-2)] cursor-pointer' : 'cursor-default'}`}
              >
                <span className="tabular mt-0.5 text-[15px] font-semibold text-white">{it.quantity}×</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-white">{it.product_name}</p>
                  <p className="text-[13px] text-[var(--color-text-secondary)]">{itemDetail(it)}</p>
                  {it.station_name && <p className="text-[12px] text-[var(--color-text-tertiary)]">{it.station_name}</p>}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={it.status} />
                  {target && <NextHint to={target} />}
                </div>
              </button>
            )
          })}
        </div>
        {order.items.some(it => next[it.status]) && (
          <p className="text-center text-[13px] text-[var(--color-text-tertiary)]">
            Toca un producto para avanzar su estado
          </p>
        )}
      </div>
    </Sheet>
  )
}

// Indicador del siguiente estado al tocar la línea (no es botón; la fila entera
// es el área de clic). Color del estado destino: azul = preparando, verde = listo.
function NextHint({ to }: { to: OrderStatus }) {
  const hex = STATUS_HEX[to]
  const Icon = to === 'preparando' ? ChefHat : to === 'listo' ? Check : ArrowRight
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ background: `color-mix(in srgb, ${hex} 18%, transparent)`, color: hex }}
    >
      <Icon size={14} strokeWidth={2.5} />
      {STATUS_LABELS[to]}
    </span>
  )
}

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

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'hace un momento'
  const m = Math.floor(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.floor(m / 60)
  return `hace ${h} h`
}
