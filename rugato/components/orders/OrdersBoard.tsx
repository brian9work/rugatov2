'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [stations, setStations] = useState<{ id: number; role_hint: string | null }[]>([])
  const knownIds = useRef<Set<number>>(new Set())
  const audioRef = useRef<AudioContext | null>(null)

  const role = user?.type
  // Meseros y admin gestionan (crear/editar/entregar); cocina/barra solo avanzan estados.
  const canManage = role === 'admin' || role === 'user'

  useEffect(() => {
    supabase.from('stations').select('id, role_hint').then(({ data }) => setStations(data ?? []))
  }, [])

  // Estación del rol (cocina/barra ven solo la suya; admin/mesero ven todo).
  const myStationId = useMemo(() => {
    if (role === 'cocina' || role === 'barra') return stations.find(s => s.role_hint === role)?.id ?? null
    return null
  }, [role, stations])

  const forStation = useCallback((o: OrderWithItems): OrderWithItems => {
    if (myStationId == null) return o
    return { ...o, items: o.items.filter(it => (it.station_id ?? 1) === myStationId) }
  }, [myStationId])

  // Órdenes visibles según el rol.
  const visible = useMemo(() => {
    if (myStationId == null) return orders
    return orders.map(forStation).filter(o => o.items.length > 0)
  }, [orders, myStationId, forStation])

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

  const getCtx = useCallback(() => {
    audioRef.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    return audioRef.current
  }, [])

  // Desbloquea el audio en el primer gesto (móvil bloquea autoplay hasta entonces).
  useEffect(() => {
    const unlock = () => {
      try {
        const ctx = getCtx()
        ctx.resume()
        const src = ctx.createBufferSource()
        src.buffer = ctx.createBuffer(1, 1, 22050)
        src.connect(ctx.destination); src.start(0) // "blip" silencioso para iOS
      } catch { /* ignore */ }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('touchend', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchend', unlock)
    }
  }, [getCtx])

  // campana (Web Audio) — heredada del 0.1 §7.6
  const bell = useCallback(() => {
    try {
      const ctx = getCtx()
      if (ctx.state === 'suspended') ctx.resume()
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain()
      o1.type = o2.type = 'sine'
      o1.frequency.value = 830; o2.frequency.value = 1245
      g.gain.setValueAtTime(0.6, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      o1.connect(g); o2.connect(g); g.connect(ctx.destination)
      o1.start(); o2.start(); o1.stop(ctx.currentTime + 1.2); o2.stop(ctx.currentTime + 1.2)
    } catch { /* ignore */ }
  }, [getCtx])

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
          {canManage && <Button onClick={() => setNewOpen(true)}><Plus size={20} /> Nueva</Button>}
        </div>
      </div>

      {error && <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">{error}</div>}

      {loading ? (
        <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <ClipboardList size={48} className="text-[var(--color-text-tertiary)]" />
          <p className="text-[17px] font-semibold text-white">Sin órdenes pendientes</p>
          <p className="text-[15px] text-[var(--color-text-secondary)]">Las órdenes nuevas aparecerán aquí en tiempo real.</p>
          {canManage && <Button onClick={() => setNewOpen(true)}><Plus size={20} /> Nueva orden</Button>}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map(o => (
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
          order={forStation(selected)}
          actor={{ id: user?.id ?? null, name: user?.name ?? null }}
          canDeliver={canManage}
          canEdit={canManage}
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
