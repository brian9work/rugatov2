'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList, UtensilsCrossed, DollarSign, BarChart3, Users, Settings,
  ArrowRight, TrendingUp, TrendingDown, Wallet,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/UserContext'
import { getReport, type ReportTotals } from '@/lib/reports'
import { mexicoTodayStartISO } from '@/lib/time'
import { ROLE_LABELS } from '@/lib/roles'

const money = (n: number) => `$${Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`

const LINKS = {
  ordenes:  { label: 'Órdenes',       href: '/dashboard/ordenes',       icon: ClipboardList },
  menu:     { label: 'Menú',          href: '/dashboard/menu',          icon: UtensilsCrossed },
  gastos:   { label: 'Gastos',        href: '/dashboard/gastos',        icon: DollarSign },
  reportes: { label: 'Reportes',      href: '/dashboard/reportes',      icon: BarChart3 },
  empleados:{ label: 'Empleados',     href: '/dashboard/empleados',     icon: Users },
  config:   { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
} as const

export default function PanelHome() {
  const { user } = useUser()
  const [totals, setTotals] = useState<ReportTotals | null>(null)
  const [activeOrders, setActiveOrders] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.type === 'admin'

  useEffect(() => {
    if (!user) return
    let alive = true
    ;(async () => {
      setLoading(true)
      // órdenes activas de hoy (RLS: staff todas, user las suyas)
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pendiente', 'preparando', 'listo'])
        .gte('created_at', mexicoTodayStartISO())
      if (alive) setActiveOrders(count ?? 0)

      if (isAdmin) {
        try { const r = await getReport('hoy'); if (alive) setTotals(r.totals) } catch { /* noop */ }
      }
      if (alive) setLoading(false)
    })()
    return () => { alive = false }
  }, [user, isAdmin])

  const links = isAdmin
    ? [LINKS.ordenes, LINKS.menu, LINKS.gastos, LINKS.reportes, LINKS.empleados, LINKS.config]
    : [LINKS.ordenes]

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <p className="text-[15px] text-[var(--color-text-secondary)]">
        {greeting()} {user && <span style={{ color: 'var(--color-accent)' }}>· {ROLE_LABELS[user.type]}</span>}
      </p>
      <h1 className="mb-5 text-[34px] font-bold tracking-tight text-white">{user?.name ?? 'Panel'}</h1>

      {/* Resumen del día */}
      {isAdmin ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Ventas hoy" value={loading ? '…' : money(totals?.ventas ?? 0)} color="var(--color-role-admin)" icon={<TrendingUp size={16} />} />
          <Stat label="Gastos hoy" value={loading ? '…' : money(totals?.gastos ?? 0)} color="#fb2424" icon={<TrendingDown size={16} />} />
          <Stat label="Balance" value={loading ? '…' : money(totals?.balance ?? 0)} color={(totals?.balance ?? 0) >= 0 ? 'var(--color-role-admin)' : '#fb2424'} icon={<Wallet size={16} />} />
          <Stat label="Órdenes activas" value={loading ? '…' : String(activeOrders ?? 0)} color="#fff" icon={<ClipboardList size={16} />} />
        </div>
      ) : (
        <Link href="/dashboard/ordenes"
              className="mb-6 flex items-center gap-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5 hover:brightness-110">
          <span className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'color-mix(in srgb, var(--color-accent) 18%, transparent)', color: 'var(--color-accent)' }}>
            <ClipboardList size={24} />
          </span>
          <div className="flex-1">
            <p className="text-[15px] text-[var(--color-text-secondary)]">Órdenes activas hoy</p>
            <p className="tabular text-[28px] font-bold text-white">{loading ? '…' : activeOrders ?? 0}</p>
          </div>
          <ArrowRight size={22} style={{ color: 'var(--color-text-tertiary)' }} />
        </Link>
      )}

      {/* Accesos */}
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Accesos</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {links.map(l => {
          const Icon = l.icon
          return (
            <Link key={l.href} href={l.href}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 hover:brightness-110">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]"
                    style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}>
                <Icon size={20} />
              </span>
              <span className="flex-1 text-[15px] font-medium text-white">{l.label}</span>
              <ArrowRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]" style={{ color }}>
        {icon}<span className="text-[12px] uppercase tracking-wide text-[var(--color-text-secondary)]">{label}</span>
      </div>
      <p className="tabular mt-1 text-[22px] font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
