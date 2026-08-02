import { type Database } from '@/lib/database.types'

// ── Tipos de fila ──────────────────────────────────────
export type Category      = Database['public']['Tables']['categories']['Row']
export type Product       = Database['public']['Tables']['products']['Row']
export type ProductPrice  = Database['public']['Tables']['product_prices']['Row']
export type Ingredient    = Database['public']['Tables']['ingredients']['Row']
export type Extra         = Database['public']['Tables']['extras']['Row']
export type OptionGroup   = Database['public']['Tables']['option_groups']['Row']
export type OptionItem    = Database['public']['Tables']['option_items']['Row']
export type ProductSize   = Database['public']['Enums']['product_size']
export type PricingMode   = Database['public']['Enums']['pricing_mode']

// ── Producto con todo lo anidado (lo que devuelve la API) ──
export type OptionGroupFull = OptionGroup & { items: OptionItem[] }
export type ProductFull = Product & {
  category: Category | null
  prices: ProductPrice[]
  ingredients: Ingredient[]
  extras: Extra[]
  option_groups: OptionGroupFull[]
}

// ── Payload que consume save_product ───────────────────
export interface SaveProductPayload {
  id?: number | null
  category_id: number
  name: string
  description?: string | null
  is_active?: boolean
  prices: { size: ProductSize; price: number }[]
  ingredients: { name: string }[]
  extras: { name: string; price: number }[]
  option_groups: {
    name: string
    min_choices: number
    max_choices: number
    sort_order: number
    items: { name: string; extra_price: number; sort_order: number }[]
  }[]
}

// ── Etiquetas de tamaño ────────────────────────────────
export const SIZE_LABELS: Record<ProductSize, string> = {
  unico:   'Único',
  chico:   'Chico',
  mediano: 'Mediano',
  grande:  'Grande',
}

/** Tamaños que aplican según el modo de precio de la categoría. */
export function sizesFor(mode: PricingMode): ProductSize[] {
  return mode === 'tres_tamanos'
    ? ['chico', 'mediano', 'grande']
    : ['unico']
}

/** Rango de precios de un producto, para mostrar en la lista. */
export function priceRange(prices: ProductPrice[]): string {
  if (prices.length === 0) return '—'
  const vals = prices.map(p => Number(p.price)).sort((a, b) => a - b)
  const fmt = (n: number) => `$${n.toFixed(0)}`
  return vals[0] === vals[vals.length - 1]
    ? fmt(vals[0])
    : `${fmt(vals[0])} – ${fmt(vals[vals.length - 1])}`
}

// ── Cliente HTTP (llama a los route handlers) ──────────
async function json<T>(res: Response): Promise<T> {
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error ?? 'Error de red')
  return body as T
}

export const menuApi = {
  categories: () =>
    fetch('/api/menu/categories').then(json<{ categories: Category[] }>),

  products: (params?: { categoryId?: number; active?: 'all' | 'active' | 'inactive' }) => {
    const q = new URLSearchParams()
    if (params?.categoryId) q.set('category', String(params.categoryId))
    if (params?.active) q.set('active', params.active)
    const qs = q.toString()
    return fetch(`/api/menu/products${qs ? `?${qs}` : ''}`)
      .then(json<{ products: ProductFull[] }>)
  },

  product: (id: number) =>
    fetch(`/api/menu/products/${id}`).then(json<{ product: ProductFull }>),

  save: (payload: SaveProductPayload) =>
    fetch('/api/menu/products', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<{ id: number }>),

  setActive: (id: number, is_active: boolean) =>
    fetch(`/api/menu/products/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ is_active }),
    }).then(json<{ success: true }>),

  remove: (id: number) =>
    fetch(`/api/menu/products/${id}`, { method: 'DELETE' })
      .then(json<{ success: true }>),
}
