import { supabase } from '@/lib/supabase'
import { type Database } from '@/lib/database.types'
import { type Category, type PricingMode } from '@/lib/menu'

export type AppSettings   = Database['public']['Tables']['app_settings']['Row']
export type Station       = Database['public']['Tables']['stations']['Row']
export type ExpenseCategory = Database['public']['Tables']['expense_categories']['Row']
export type PaymentMethod = Database['public']['Enums']['payment_method']

export const ALL_PAYMENTS: PaymentMethod[] = ['efectivo', 'tarjeta', 'transferencia']
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia',
}

export const settingsApi = {
  // ── Ajustes del negocio ──
  async get(): Promise<AppSettings> {
    const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).single()
    if (error) throw new Error(error.message)
    return data
  },
  async update(patch: Partial<AppSettings>): Promise<void> {
    const { error } = await supabase.from('app_settings').update(patch).eq('id', 1)
    if (error) throw new Error(error.message)
  },

  // ── Estaciones ──
  async stations(): Promise<Station[]> {
    const { data, error } = await supabase.from('stations').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  },
  async addStation(name: string): Promise<void> {
    const { error } = await supabase.from('stations').insert({ name })
    if (error) throw new Error(error.message)
  },
  async updateStation(id: number, patch: Partial<Station>): Promise<void> {
    const { error } = await supabase.from('stations').update(patch).eq('id', id)
    if (error) throw new Error(error.message)
  },

  // ── Categorías de menú ──
  async categories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return (data ?? []) as Category[]
  },
  async setCategoryStation(categoryId: number, stationId: number | null): Promise<void> {
    const { error } = await supabase.from('categories').update({ station_id: stationId }).eq('id', categoryId)
    if (error) throw new Error(error.message)
  },
  async saveCategory(input: {
    id?: number; name: string; short_name: string | null; color: string
    pricing_mode: PricingMode; has_options: boolean; is_freeform: boolean; sort_order: number
  }): Promise<void> {
    const { id, ...fields } = input
    const q = id
      ? supabase.from('categories').update(fields).eq('id', id)
      : supabase.from('categories').insert(fields)
    const { error } = await q
    if (error) throw new Error(error.message)
  },

  // ── Categorías de gasto ──
  async expenseCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase.from('expense_categories').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  },
  async addExpenseCategory(name: string): Promise<void> {
    const { error } = await supabase.from('expense_categories').insert({ name })
    if (error) throw new Error(error.message)
  },
  async updateExpenseCategory(id: number, patch: Partial<ExpenseCategory>): Promise<void> {
    const { error } = await supabase.from('expense_categories').update(patch).eq('id', id)
    if (error) throw new Error(error.message)
  },

  // ── Cuenta ──
  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message)
  },
}
