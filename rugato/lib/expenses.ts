import { supabase } from '@/lib/supabase'
import { type Database } from '@/lib/database.types'
import { mexicoTodayStartISO } from '@/lib/time'

export type Expense         = Database['public']['Tables']['expenses']['Row']
export type ExpenseCategory = Database['public']['Tables']['expense_categories']['Row']
export type ExpenseWithCategory = Expense & { category: ExpenseCategory | null }

export type Period = 'hoy' | 'semana' | 'mes'

export const PERIOD_LABELS: Record<Period, string> = {
  hoy: 'Hoy', semana: 'Semana', mes: 'Mes',
}

/** Fecha de inicio (ISO) para el periodo, en horario mexicano. */
export function periodStart(period: Period): string {
  const start = mexicoTodayStartISO() // hoy 00:00 en México
  if (period === 'hoy') return start
  const d = new Date(start)
  if (period === 'semana') d.setDate(d.getDate() - 6)
  if (period === 'mes') d.setDate(1)
  return d.toISOString()
}

export interface Sale {
  id: number
  folio: number
  total: number
  at: string
}

export const expensesApi = {
  // Ventas del periodo = órdenes entregadas (ingreso real cobrado).
  async sales(period: Period): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('id, folio, total, delivered_at')
      .eq('status', 'entregado')
      .gte('delivered_at', periodStart(period))
      .order('delivered_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map(o => ({
      id: o.id, folio: o.folio, total: Number(o.total), at: o.delivered_at as string,
    }))
  },

  async categories(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase
      .from('expense_categories').select('*').eq('is_active', true).order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async list(period: Period): Promise<ExpenseWithCategory[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, category:expense_categories(*)')
      .gte('created_at', periodStart(period))
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as ExpenseWithCategory[]
  },

  async add(input: { category_id: number; amount: number; reason: string | null }): Promise<void> {
    const { error } = await supabase.from('expenses').insert(input)
    if (error) throw new Error(error.message)
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
