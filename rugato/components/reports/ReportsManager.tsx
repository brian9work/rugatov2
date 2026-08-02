'use client'

import { useCallback, useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import Segmented from '@/components/ui/Segmented'
import {
  type Report, type RangeKey, RANGE_LABELS, getReport,
} from '@/lib/reports'

const money = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

export default function ReportsManager() {
  const [range, setRange] = useState<RangeKey>('7d')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try { setLoading(true); setError(''); setReport(await getReport(range)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Error al cargar') }
    finally { setLoading(false) }
  }, [range])

  useEffect(() => { load() }, [load])

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
