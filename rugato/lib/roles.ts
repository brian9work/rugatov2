export type UserRole = 'admin' | 'cocina' | 'user'
export type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado'

// ── Roles ──────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:  'Administrador',
  cocina: 'Cocina',
  user:   'Usuario',
}

export const ROLE_TEXT: Record<UserRole, string> = {
  admin:  'text-role-admin',
  cocina: 'text-role-cocina',
  user:   'text-role-user',
}

export const ROLE_BG: Record<UserRole, string> = {
  admin:  'bg-role-admin',
  cocina: 'bg-role-cocina',
  user:   'bg-role-user',
}

export const ROLE_BORDER: Record<UserRole, string> = {
  admin:  'border-role-admin',
  cocina: 'border-role-cocina',
  user:   'border-role-user',
}

export const ROLE_HEX: Record<UserRole, string> = {
  admin:  '#25f575',
  cocina: '#c58d00',
  user:   '#3b82f6',
}

export function getRoleClasses(role: UserRole) {
  return {
    text:   ROLE_TEXT[role],
    bg:     ROLE_BG[role],
    border: ROLE_BORDER[role],
    hex:    ROLE_HEX[role],
    label:  ROLE_LABELS[role],
  }
}

// ── Estatus de órdenes ────────────────────────────────

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente:  'Pendiente',
  preparando: 'Preparando',
  listo:      'Listo',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
}

export const STATUS_HEX: Record<OrderStatus, string> = {
  pendiente:  '#fbbf24',
  preparando: '#3b82f6',
  listo:      '#25f575',
  entregado:  '#25f575',
  cancelado:  '#fb2424',
}

export const STATUS_TEXT: Record<OrderStatus, string> = {
  pendiente:  'text-status-pendiente',
  preparando: 'text-status-preparando',
  listo:      'text-status-listo',
  entregado:  'text-status-entregado',
  cancelado:  'text-status-cancelado',
}

export const STATUS_BG: Record<OrderStatus, string> = {
  pendiente:  'bg-yellow-900/30 text-status-pendiente',
  preparando: 'bg-blue-900/30   text-status-preparando',
  listo:      'bg-green-900/30  text-status-listo',
  entregado:  'bg-green-900/30  text-status-entregado',
  cancelado:  'bg-red-900/30    text-status-cancelado',
}

export function getStatusClasses(status: OrderStatus) {
  return {
    text:  STATUS_TEXT[status],
    bg:    STATUS_BG[status],
    hex:   STATUS_HEX[status],
    label: STATUS_LABELS[status],
  }
}
