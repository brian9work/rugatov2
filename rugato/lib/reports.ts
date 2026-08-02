import { supabase } from '@/lib/supabase'
import { mexicoTodayStartISO } from '@/lib/time'

export interface ReportTotals {
  ventas: number
  ordenes: number
  ticket_promedio: number
  gastos: number
  balance: number
}
export interface DayRow { dia: string; ventas: number; ordenes: number; gastos: number }
export interface ProductRow { name: string; qty: number; revenue: number }
export interface CategoryRow { name: string; color: string; qty: number; revenue: number }
export interface ExpenseCatRow { name: string; amount: number }

export interface Report {
  totals: ReportTotals
  by_day: DayRow[]
  top_products: ProductRow[]
  sales_by_category: CategoryRow[]
  expenses_by_category: ExpenseCatRow[]
}

export type RangeKey = 'hoy' | '7d' | '30d'
export const RANGE_LABELS: Record<RangeKey, string> = {
  hoy: 'Hoy', '7d': '7 días', '30d': '30 días',
}

/** [inicio, fin) del rango en horario mexicano. fin = inicio de mañana. */
export function rangeFor(key: RangeKey): { start: string; end: string } {
  const todayStart = mexicoTodayStartISO()
  const end = new Date(todayStart); end.setDate(end.getDate() + 1)
  const start = new Date(todayStart)
  if (key === '7d') start.setDate(start.getDate() - 6)
  if (key === '30d') start.setDate(start.getDate() - 29)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function getReport(range: RangeKey): Promise<Report> {
  const { start, end } = rangeFor(range)
  const { data, error } = await supabase.rpc('get_report', { p_start: start, p_end: end })
  if (error) throw new Error(error.message)
  return data as unknown as Report
}
