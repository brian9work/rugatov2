'use client'

import { useSyncExternalStore } from 'react'
import { type ProductFull } from '@/lib/menu'
import { type CartLine, type ServiceType } from '@/lib/orders'

// Borradores de orden: se guardan SOLO en este dispositivo (localStorage), no
// en la base. Sirven para dejar una orden a medias y retomarla después.

export interface OrderDraft {
  id: string
  savedAt: string // ISO
  savedBy: string | null
  service: ServiceType
  table: string
  customer: string
  notes: string
  lines: CartLine[]
}

const KEY = 'rugato:borradores:v1'
const EVENT = 'rugato:borradores' // avisa a la misma pestaña; 'storage' cubre otras

let cacheRaw: string | null = null
let cache: OrderDraft[] = []
const EMPTY: OrderDraft[] = []

function read(): OrderDraft[] {
  let raw: string | null = null
  try { raw = localStorage.getItem(KEY) } catch { /* almacenamiento bloqueado */ }
  if (raw !== cacheRaw) {
    cacheRaw = raw
    try { cache = raw ? (JSON.parse(raw) as OrderDraft[]) : [] } catch { cache = [] }
  }
  return cache
}

function write(list: OrderDraft[]): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { return false }
  window.dispatchEvent(new Event(EVENT))
  return true
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/** Borradores de este dispositivo, del más reciente al más viejo. */
export function useDrafts(): OrderDraft[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function newDraftId(): string {
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/** Crea o actualiza (por id). Devuelve false si el dispositivo no deja guardar. */
export function saveDraft(draft: OrderDraft): boolean {
  return write([draft, ...read().filter(d => d.id !== draft.id)])
}

export function deleteDraft(id: string): void {
  write(read().filter(d => d.id !== id))
}

/**
 * Pone una línea guardada al día con el menú actual. Editar un producto en
 * Menú regenera los ids de extras/opciones/ingredientes, así que se re-mapean
 * por nombre; lo que ya no existe se descarta.
 */
export function rehydrateLine(line: CartLine, products: ProductFull[]): CartLine {
  const fresh = products.find(p => p.id === line.product.id)
  if (!fresh) return line // inactivo o borrado: se queda como estaba

  const remap = (ids: number[], before: { id: number; key: string }[], after: { id: number; key: string }[]) =>
    ids
      .map(id => {
        const key = before.find(x => x.id === id)?.key
        return (after.find(x => x.id === id && x.key === key) ?? after.find(x => x.key === key))?.id
      })
      .filter((id): id is number => id != null)

  const named = (list: { id: number; name: string }[]) => list.map(x => ({ id: x.id, key: x.name }))
  const options = (p: ProductFull) =>
    p.option_groups.flatMap(g => g.items.map(i => ({ id: i.id, key: `${g.name}|${i.name}` })))

  return {
    ...line,
    product: fresh,
    removedIngredientIds: remap(line.removedIngredientIds, named(line.product.ingredients), named(fresh.ingredients)),
    extraIds: remap(line.extraIds, named(line.product.extras), named(fresh.extras)),
    optionIds: remap(line.optionIds, options(line.product), options(fresh)),
  }
}
