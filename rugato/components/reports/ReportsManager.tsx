'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Segmented from '@/components/ui/Segmented'
import StatusBadge from '@/components/ui/StatusBadge'
import OrderDetail from '@/components/orders/OrderDetail'
import { useUser } from '@/lib/UserContext'
import { type OrderWithItems, SERVICE_LABELS, PAYMENT_LABELS } from '@/lib/orders'
import {
  type Report, type RangeKey, type Employee, type CustomRange,
  RANGE_LABELS, getReport, listEmployees, ordersInRange,
} from '@/lib/reports'

const money = (n: number) => `$${Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`

type Tab = 'ventas' | 'listas' | 'empleados' | 'gastos'
const TAB_LABELS: Record<Tab, string> = {
  ventas: 'Ventas', listas: 'Órdenes listas', empleados: 'Empleados', gastos: 'Gastos e ingresos',
}

export default function ReportsManager() {
  const { user } = useUser()
  const [range, setRange] = useState<RangeKey>('7d')
  const [tab, setTab] = useState<Tab>('ventas')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState<number | 0>(0)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [ready, setReady] = useState<OrderWithItems[]>([])
  const [selected, setSelected] = useState<OrderWithItems | null>(null)

  // rango personalizado (fechas)
  const [dFrom, setDFrom] = useState(() => isoDaysAgo(6))
  const [dTo, setDTo] = useState(() => isoDaysAgo(0))
  const custom: CustomRange | null = range === 'custom' ? { start: dFrom, end: dTo } : null

  const load = useCallback(async () => {
    try { setLoading(true); setError(''); setReport(await getReport(range, custom)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Error al cargar') }
    finally { setLoading(false) }
  }, [range, custom?.start, custom?.end]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = useCallback(async () => {
    try {
      const rows = await ordersInRange(range, employeeId || null, undefined, custom)
      setOrders(rows)
      setSelected(prev => prev ? rows.find(o => o.id === prev.id) ?? null : null)
    } catch { /* el error del reporte ya se muestra */ }
  }, [range, employeeId, custom?.start, custom?.end]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadReady = useCallback(async () => {
    try { setReady(await ordersInRange(range, null, ['listo', 'entregado'], custom)) }
    catch { /* noop */ }
  }, [range, custom?.start, custom?.end]) // eslint-disable-line react-hooks/exhaustive-deps

  const refreshAll = useCallback(() => { loadOrders(); loadReady() }, [loadOrders, loadReady])

  useEffect(() => { load() }, [load])
  useEffect(() => { loadOrders() }, [loadOrders])
  useEffect(() => { loadReady() }, [loadReady])
  useEffect(() => { listEmployees().then(setEmployees).catch(() => {}) }, [])

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] font-bold tracking-tight text-white">Reportes</h1>
        <Segmented<RangeKey>
          value={range} onChange={setRange}
          options={(Object.keys(RANGE_LABELS) as RangeKey[]).map(k => ({ value: k, label: RANGE_LABELS[k] }))}
        />
      </div>

      {/* Rango de fechas personalizado */}
      {range === 'custom' && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input type="date" value={dFrom} max={dTo} onChange={e => setDFrom(e.target.value)}
                 className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-3 py-2 text-[15px] text-white outline-none" />
          <span className="text-[15px] text-[var(--color-text-secondary)]">a</span>
          <input type="date" value={dTo} min={dFrom} onChange={e => setDTo(e.target.value)}
                 className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-3 py-2 text-[15px] text-white outline-none" />
        </div>
      )}

      {/* Secciones */}
      <div className="mb-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Segmented<Tab>
          value={tab} onChange={setTab}
          options={(Object.keys(TAB_LABELS) as Tab[]).map(k => ({ value: k, label: TAB_LABELS[k] }))}
        />
      </div>

      {error && <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">{error}</div>}

      {loading || !report ? (
        <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando…</p>
      ) : tab === 'ventas' ? (
        <VentasTab report={report} />
      ) : tab === 'gastos' ? (
        <GastosTab report={report} />
      ) : tab === 'listas' ? (
        <ListasTab orders={ready} onSelect={setSelected} />
      ) : (
        <EmpleadosTab
          employees={employees} employeeId={employeeId} setEmployeeId={setEmployeeId}
          orders={orders} onSelect={setSelected}
        />
      )}

      {selected && (
        <OrderDetail
          order={selected}
          actor={{ id: user?.id ?? null, name: user?.name ?? null }}
          canDeliver={false}
          canEdit={false}
          canEditPrice
          canEditPayment
          onClose={() => setSelected(null)}
          onChanged={refreshAll}
        />
      )}
    </div>
  )
}

// ── Ventas generales ───────────────────────────────────
function VentasTab({ report }: { report: Report }) {
  const t = report.totals
  const maxDay = Math.max(1, ...report.by_day.map(d => Math.max(d.ventas, d.gastos)))
  const maxProd = Math.max(1, ...report.top_products.map(p => p.revenue))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Kpi label="Ventas" value={money(t.ventas)} color="var(--color-role-admin)" />
        <Kpi label="Órdenes" value={String(t.ordenes)} color="#fff" />
        <Kpi label="Ticket prom." value={money(t.ticket_promedio)} color="#fff" />
      </div>

      <Section title="Ventas y gastos por día">
        {report.by_day.length === 0 ? <Empty /> : (
          <div className="flex flex-col gap-3">
            {report.by_day.map(d => (
              <div key={d.dia} className="flex flex-col gap-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--color-text-secondary)]">{fmtDay(d.dia)}</span>
                  <span className="tabular text-[var(--color-text-secondary)]">
                    <span style={{ color: 'var(--color-role-admin)' }}>{money(d.ventas)}</span>{' · '}
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

      <PaymentBreakdown rows={report.sales_by_payment} />
    </div>
  )
}

// Dónde está el dinero: ventas por método de pago.
function PaymentBreakdown({ rows }: { rows: import('@/lib/reports').PaymentRow[] }) {
  return (
    <Section title="Ventas por método de pago">
      {rows.length === 0 ? <Empty /> : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
          {rows.map((r, i) => (
            <div key={r.method} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
              <span className="h-3 w-3 rounded-full" style={{ background: PAY_COLOR[r.method] ?? 'var(--color-text-tertiary)' }} />
              <span className="flex-1 text-[15px] text-white">{payLabel(r.method)}</span>
              <span className="tabular text-[13px] text-[var(--color-text-secondary)]">{r.ordenes} órd</span>
              <span className="tabular text-[15px] font-medium text-white">{money(r.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

const PAY_COLOR: Record<string, string> = {
  efectivo: 'var(--color-role-admin)', tarjeta: 'var(--color-role-user)',
  transferencia: 'var(--color-role-barra)', sin_registrar: 'var(--color-text-tertiary)',
}
function payLabel(m: string): string {
  return (PAYMENT_LABELS as Record<string, string>)[m] ?? 'Sin registrar'
}

// ── Gastos e ingresos ──────────────────────────────────
function GastosTab({ report }: { report: Report }) {
  const t = report.totals
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="Ingresos" value={money(t.ventas)} color="var(--color-role-admin)" />
        <Kpi label="Gastos" value={money(t.gastos)} color="#fb2424" />
        <Kpi label="Balance" value={money(t.balance)} color={t.balance >= 0 ? 'var(--color-role-admin)' : '#fb2424'} />
      </div>

      <PaymentBreakdown rows={report.sales_by_payment} />

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
  )
}

// ── Empleados (con desglose por tiempo) ────────────────
function EmpleadosTab({ employees, employeeId, setEmployeeId, orders, onSelect }: {
  employees: Employee[]
  employeeId: number | 0
  setEmployeeId: (v: number | 0) => void
  orders: OrderWithItems[]
  onSelect: (o: OrderWithItems) => void
}) {
  // desglose por día (horario mexicano) de las órdenes filtradas
  const byDay = useMemo(() => {
    const map = new Map<string, { ordenes: number; ventas: number }>()
    for (const o of orders) {
      const key = dayKeyMX(o.created_at)
      const cur = map.get(key) ?? { ordenes: 0, ventas: 0 }
      cur.ordenes += 1
      if (o.status === 'entregado') cur.ventas += Number(o.total)
      map.set(key, cur)
    }
    return [...map.entries()].map(([dia, v]) => ({ dia, ...v })).sort((a, b) => a.dia.localeCompare(b.dia))
  }, [orders])

  const totalVentas = byDay.reduce((a, d) => a + d.ventas, 0)
  const maxDay = Math.max(1, ...byDay.map(d => d.ventas))

  return (
    <div className="flex flex-col gap-6">
      <select value={employeeId} onChange={e => setEmployeeId(Number(e.target.value))}
              className="w-full rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-3 py-2.5 text-[15px] text-white outline-none">
        <option value={0}>Todos los empleados</option>
        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Órdenes" value={String(orders.length)} color="#fff" />
        <Kpi label="Ventas (entregadas)" value={money(totalVentas)} color="var(--color-role-admin)" />
      </div>

      {/* Desglose por tiempo */}
      <Section title="Por día">
        {byDay.length === 0 ? <Empty /> : (
          <div className="flex flex-col gap-3">
            {byDay.map(d => (
              <div key={d.dia} className="flex flex-col gap-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--color-text-secondary)]">{fmtDay(d.dia)}</span>
                  <span className="tabular text-[var(--color-text-secondary)]">
                    <span className="text-white">{d.ordenes}</span> órd · <span style={{ color: 'var(--color-role-admin)' }}>{money(d.ventas)}</span>
                  </span>
                </div>
                <Bar value={d.ventas} max={maxDay} color="var(--color-role-admin)" />
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Lista de órdenes */}
      <Section title="Órdenes">
        {orders.length === 0 ? <Empty /> : <OrdersList orders={orders} onSelect={onSelect} />}
      </Section>
    </div>
  )
}

// ── Órdenes listas / entregadas ────────────────────────
function ListasTab({ orders, onSelect }: {
  orders: OrderWithItems[]; onSelect: (o: OrderWithItems) => void
}) {
  const total = orders.filter(o => o.status === 'entregado').reduce((a, o) => a + Number(o.total), 0)
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Órdenes listas" value={String(orders.length)} color="#fff" />
        <Kpi label="Ventas (entregadas)" value={money(total)} color="var(--color-role-admin)" />
      </div>
      <Section title="Listas y entregadas">
        {orders.length === 0 ? <Empty /> : <OrdersList orders={orders} onSelect={onSelect} />}
      </Section>
    </div>
  )
}

// ── Compartidos ────────────────────────────────────────
function OrdersList({ orders, onSelect }: {
  orders: OrderWithItems[]; onSelect: (o: OrderWithItems) => void
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
      {orders.map((o, i) => (
        <button key={o.id} onClick={() => onSelect(o)}
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

// Clave de día (YYYY-MM-DD) en horario mexicano.
function dayKeyMX(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso))
}

// Fecha (YYYY-MM-DD, México) de hace N días.
function isoDaysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n)
  return dayKeyMX(d.toISOString())
}
