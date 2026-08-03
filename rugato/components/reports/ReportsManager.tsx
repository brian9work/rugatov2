'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Segmented from '@/components/ui/Segmented'
import StatusBadge from '@/components/ui/StatusBadge'
import OrderDetail from '@/components/orders/OrderDetail'
import { useUser } from '@/lib/UserContext'
import { type OrderWithItems, SERVICE_LABELS } from '@/lib/orders'
import {
  type Report, type RangeKey, type Employee,
  RANGE_LABELS, getReport, listEmployees, ordersInRange,
} from '@/lib/reports'

const money = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

export default function ReportsManager() {
  const { user } = useUser()
  const [range, setRange] = useState<RangeKey>('7d')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // historial de órdenes + filtro por empleado
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState<number | 0>(0)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [selected, setSelected] = useState<OrderWithItems | null>(null)

  const load = useCallback(async () => {
    try { setLoading(true); setError(''); setReport(await getReport(range)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Error al cargar') }
    finally { setLoading(false) }
  }, [range])

  const loadOrders = useCallback(async () => {
    try {
      const rows = await ordersInRange(range, employeeId || null)
      setOrders(rows)
      setSelected(prev => prev ? rows.find(o => o.id === prev.id) ?? null : null)
    } catch { /* se muestra el error del reporte */ }
  }, [range, employeeId])

  useEffect(() => { load() }, [load])
  useEffect(() => { loadOrders() }, [loadOrders])
  useEffect(() => { listEmployees().then(setEmployees).catch(() => {}) }, [])

  const t = report?.totals
  const maxDay = Math.max(1, ...(report?.by_day.map(d => Math.max(d.ventas, d.gastos)) ?? [1]))
  const maxProd = Math.max(1, ...(report?.top_products.map(p => p.revenue) ?? [1]))

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] font-bold tracking-tight text-white">Reportes</h1>
        <Segmented<RangeKey>
          value={range} onChange={setRange}
          options={(Object.keys(RANGE_LABELS) as RangeKey[]).map(k => ({ value: k, label: RANGE_LABELS[k] }))}
        />
      </div>

      {error && <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">{error}</div>}

      {loading || !t ? (
        <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Kpi label="Ventas" value={money(t.ventas)} color="var(--color-role-admin)" />
            <Kpi label="Gastos" value={money(t.gastos)} color="#fb2424" />
            <Kpi label="Balance" value={money(t.balance)} color={t.balance >= 0 ? 'var(--color-role-admin)' : '#fb2424'} />
            <Kpi label="Órdenes" value={String(t.ordenes)} color="#fff" />
            <Kpi label="Ticket prom." value={money(t.ticket_promedio)} color="#fff" />
          </div>

          {/* Ventas vs gastos por día */}
          <Section title="Ventas y gastos por día">
            {report.by_day.length === 0 ? <Empty /> : (
              <div className="flex flex-col gap-3">
                {report.by_day.map(d => (
                  <div key={d.dia} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[var(--color-text-secondary)]">{fmtDay(d.dia)}</span>
                      <span className="tabular text-[var(--color-text-secondary)]">
                        <span style={{ color: 'var(--color-role-admin)' }}>{money(d.ventas)}</span>
                        {' · '}
                        <span style={{ color: '#fb2424' }}>{money(d.gastos)}</span>
                      </span>
                    </div>
                    <Bar value={d.ventas} max={maxDay} color="var(--color-role-admin)" />
                    <Bar value={d.gastos} max={maxDay} color="#fb2424" />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Top productos */}
          <Section title="Productos más vendidos">
            {report.top_products.length === 0 ? <Empty /> : (
              <div className="flex flex-col gap-3">
                {report.top_products.map(p => (
                  <div key={p.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[15px]">
                      <span className="text-white">{p.name}</span>
                      <span className="tabular text-[var(--color-text-secondary)]">
                        <span className="tabular text-white">{p.qty}</span> · {money(p.revenue)}
                      </span>
                    </div>
                    <Bar value={p.revenue} max={maxProd} color="var(--color-accent)" />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Ventas por categoría */}
          <Section title="Ventas por categoría">
            {report.sales_by_category.length === 0 ? <Empty /> : (
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
                {report.sales_by_category.map((c, i) => (
                  <div key={c.name} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                    <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                    <span className="flex-1 text-[15px] text-white">{c.name}</span>
                    <span className="tabular text-[13px] text-[var(--color-text-secondary)]">{c.qty} uds</span>
                    <span className="tabular text-[15px] font-medium text-white">{money(c.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Gastos por categoría */}
          <Section title="Gastos por categoría">
            {report.expenses_by_category.length === 0 ? <Empty /> : (
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
                {report.expenses_by_category.map((c, i) => (
                  <div key={c.name} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                    <span className="flex-1 text-[15px] text-white">{c.name}</span>
                    <span className="tabular text-[15px] font-medium" style={{ color: '#fb2424' }}>{money(c.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      )}

      {/* Historial de órdenes + filtro por empleado */}
      <section className="mt-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Órdenes del periodo
          </h2>
          <select value={employeeId} onChange={e => setEmployeeId(Number(e.target.value))}
                  className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-3 py-2 text-[15px] text-white outline-none">
            <option value={0}>Todos los empleados</option>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        </div>

        {orders.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
            {orders.map((o, i) => (
              <button key={o.id} onClick={() => setSelected(o)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-2)] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-white">#{o.folio}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-[var(--color-text-secondary)]">
                    {fmtDateTime(o.created_at)} · {SERVICE_LABELS[o.service]}
                    {o.created_by_name && ` · Tomó: ${o.created_by_name}`}
                    {o.delivered_by_name && ` · Cobró: ${o.delivered_by_name}`}
                  </p>
                </div>
                <span className="tabular text-[15px] font-semibold text-white">{money(o.total)}</span>
                <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <OrderDetail
          order={selected}
          actor={{ id: user?.id ?? null, name: user?.name ?? null }}
          canDeliver={false}
          onClose={() => setSelected(null)}
          onChanged={loadOrders}
        />
      )}
    </div>
  )
}

function Kpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4">
      <p className="text-[12px] uppercase tracking-wide text-[var(--color-text-secondary)]">{label}</p>
      <p className="tabular mt-1 text-[22px] font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">{title}</h2>
      {children}
    </section>
  )
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(2, Math.round((value / max) * 100))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function Empty() {
  return <p className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] px-4 py-6 text-center text-[15px] text-[var(--color-text-secondary)]">Sin datos en este periodo</p>
}

function fmtDay(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
