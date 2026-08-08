import { type Database } from '@/lib/database.types'
import { type ProductFull, type ProductSize } from '@/lib/menu'

export type Order      = Database['public']['Tables']['orders']['Row']
export type OrderItem  = Database['public']['Tables']['order_items']['Row']
export type OrderAudit = Database['public']['Tables']['order_audit']['Row']
export type OrderStatus  = Database['public']['Enums']['order_status']
export type ServiceType  = Database['public']['Enums']['service_type']
export type PaymentMethod = Database['public']['Enums']['payment_method']

export type OrderWithItems = Order & { items: OrderItem[] }

/** ¿La orden todavía se puede editar? */
export function isEditable(status: OrderStatus): boolean {
  return status !== 'entregado' && status !== 'cancelado'
}

/** Autor de una acción (quién la hace, para el registro). */
export interface Actor { id: number | null; name: string | null }

export const SERVICE_LABELS: Record<ServiceType, string> = {
  llevar: 'Para llevar',
  aqui:   'Para comer aquí',
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo:      'Efectivo',
  tarjeta:       'Tarjeta',
  transferencia: 'Transferencia',
}

// ── Carrito (estado en cliente antes de enviar) ────────
export interface CartLine {
  key: string
  product: ProductFull
  size: ProductSize
  quantity: number
  removedIngredientIds: number[]
  extraIds: number[]
  optionIds: number[]
  notes: string
  extraCharge: number
  price: number // precio unitario escrito a mano (solo productos "al gusto")
}

export function unitPriceOf(product: ProductFull, size: ProductSize): number {
  const row = product.prices.find(p => p.size === size)
  return row ? Number(row.price) : 0
}

export function lineTotal(line: CartLine): number {
  const base = line.product.category?.is_freeform ? (line.price || 0) : unitPriceOf(line.product, line.size)
  const extras = line.product.extras
    .filter(e => line.extraIds.includes(e.id))
    .reduce((a, e) => a + Number(e.price), 0)
  const options = line.product.option_groups
    .flatMap(g => g.items)
    .filter(o => line.optionIds.includes(o.id))
    .reduce((a, o) => a + Number(o.extra_price), 0)
  return line.quantity * (base + extras + options) + (line.extraCharge || 0)
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((a, l) => a + lineTotal(l), 0)
}

// ── Payload que consume create_order ───────────────────
export interface CreateOrderPayload {
  created_by: number | null
  service: ServiceType
  table_number: number | null
  customer_name: string | null
  notes: string | null
  items: {
    product_id: number
    size: ProductSize
    quantity: number
    extra_charge: number
    price: number
    notes: string | null
    removed_ingredients: string[]
    extras: string[]
    options: string[]
  }[]
}

/** Una línea de carrito → item para add_order_item / create_order. */
export function lineToItem(l: CartLine) {
  return {
    product_id: l.product.id,
    size: l.size,
    quantity: l.quantity,
    extra_charge: l.extraCharge || 0,
    price: l.price || 0, // el servidor lo usa solo para productos "al gusto"
    notes: l.notes.trim() || null,
    removed_ingredients: l.removedIngredientIds.map(String),
    extras: l.extraIds.map(String),
    options: l.optionIds.map(String),
  }
}

export function cartToPayload(
  lines: CartLine[],
  meta: { created_by: number | null; service: ServiceType; table_number: number | null; customer_name: string | null; notes: string | null },
): CreateOrderPayload {
  return { ...meta, items: lines.map(lineToItem) }
}

// ── Cliente HTTP (writes → route handlers con service_role) ──
async function json<T>(res: Response): Promise<T> {
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error ?? 'Error de red')
  return body as T
}

export interface StaffMember { id: number; name: string; type: string; is_active: boolean }

/** Empleados activos (vía route handler service_role; el mesero no puede listar por RLS). */
export async function fetchStaff(): Promise<StaffMember[]> {
  const { users } = await fetch('/api/usuarios').then(json<{ users: StaffMember[] }>)
  return (users ?? []).filter(u => u.is_active)
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<{ id: number }>),

  setItemStatus: (itemId: number, status: OrderStatus) =>
    fetch(`/api/orders/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(json<{ success: true }>),

  // Cancela la orden, pone el total en 0 y lo registra (botón "Eliminar").
  cancel: (orderId: number, by: Actor) =>
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),

  deliver: (orderId: number, deliveredBy: number | null, payment: PaymentMethod) =>
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'deliver', delivered_by: deliveredBy, payment }),
    }).then(json<{ success: true }>),

  // ── Edición (registra en la auditoría) ──
  addItem: (orderId: number, line: CartLine, by: Actor) =>
    fetch(`/api/orders/${orderId}/items`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ item: lineToItem(line), user_id: by.id, user_name: by.name }),
    }).then(json<{ id: number }>),

  removeItem: (itemId: number, by: Actor) =>
    fetch(`/api/orders/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),

  setItemQty: (itemId: number, qty: number, by: Actor) =>
    fetch(`/api/orders/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ qty, user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),

  updateData: (
    orderId: number,
    data: { service: ServiceType; table_number: number | null; customer_name: string | null; notes: string | null },
    by: Actor,
  ) =>
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update_data', ...data, user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),

  // Corrige el total manualmente (queda en el historial).
  setTotal: (orderId: number, total: number, by: Actor) =>
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'set_total', total, user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),

  // Corrige el método de pago de una orden ya cobrada (queda en el historial).
  setPayment: (orderId: number, payment: PaymentMethod, by: Actor) =>
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'set_payment', payment, user_id: by.id, user_name: by.name }),
    }).then(json<{ success: true }>),
}
