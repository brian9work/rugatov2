'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { type Category, type ProductFull } from '@/lib/menu'

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

// Selector de producto con búsqueda + filtro por categoría. Reutilizable.
export default function ProductPicker({ categories, products, onPick }: {
  categories: Category[]
  products: ProductFull[]
  onPick: (p: ProductFull) => void
}) {
  const [query, setQuery] = useState('')
  const [catId, setCatId] = useState<number | 0>(0) // 0 = todas

  const q = norm(query)
  const filtered = useMemo(
    () => products.filter(p =>
      (catId === 0 || p.category_id === catId) &&
      (q === '' || norm(p.name).includes(q)),
    ),
    [products, catId, q],
  )

  const grouped = categories
    .map(cat => ({ cat, items: filtered.filter(p => p.category_id === cat.id) }))
    .filter(g => g.items.length > 0)

  // solo categorías que tienen productos
  const usableCats = categories.filter(c => products.some(p => p.category_id === c.id))

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador + chips (pegados arriba al hacer scroll) */}
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-2 bg-[var(--color-surface)] px-4 pb-2 pt-1">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar platillo…"
            className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] py-2.5 pl-10 pr-10 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip label="Todas" active={catId === 0} onClick={() => setCatId(0)} />
          {usableCats.map(c => (
            <Chip key={c.id} label={c.short_name || c.name} color={c.color}
                  active={catId === c.id} onClick={() => setCatId(c.id)} />
          ))}
        </div>
      </div>

      {/* Resultados */}
      {grouped.length === 0 ? (
        <p className="px-1 py-6 text-center text-[15px] text-[var(--color-text-secondary)]">
          Sin resultados para “{query}”.
        </p>
      ) : (
        grouped.map(({ cat, items }) => (
          <div key={cat.id}>
            <div className="mb-1 flex items-center gap-2 px-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.color }} />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">{cat.name}</span>
            </div>
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)]">
              {items.map((p, i) => (
                <button key={p.id} onClick={() => onPick(p)}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[var(--color-surface-2)] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                  <span className="flex-1 text-[15px] text-white">{p.name}</span>
                  <span className="tabular text-[13px] text-[var(--color-text-secondary)]">{priceHint(p)}</span>
                  <Plus size={18} style={{ color: 'var(--color-accent)' }} />
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function Chip({ label, active, color, onClick }: {
  label: string; active: boolean; color?: string; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
      style={active
        ? { background: 'var(--color-accent)', color: '#111827' }
        : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
      {color && !active && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {label}
    </button>
  )
}

function priceHint(p: ProductFull): string {
  if (p.prices.length === 0) return ''
  const vals = p.prices.map(x => Number(x.price)).sort((a, b) => a - b)
  return vals[0] === vals[vals.length - 1] ? `$${vals[0]}` : `$${vals[0]}–${vals[vals.length - 1]}`
}
