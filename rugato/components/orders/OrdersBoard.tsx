'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, ClipboardList, RotateCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import NewOrderSheet from '@/components/orders/NewOrderSheet'
import OrderDetail from '@/components/orders/OrderDetail'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/UserContext'
import { type OrderWithItems, SERVICE_LABELS } from '@/lib/orders'
import { STATUS_LABELS } from '@/lib/roles'
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
          actor={{ id: user?.id ?? null, name: user?.name ?? null }}
          canDeliver={user?.type === 'admin' || user?.type === 'user'}
          onClose={() => setSelected(null)}
          onChanged={load}
        />
      )}
    </div>
  )
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'hace un momento'
  const m = Math.floor(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.floor(m / 60)
  return `hace ${h} h`
}
