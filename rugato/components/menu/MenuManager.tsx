'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, EyeOff, Eye, UtensilsCrossed } from 'lucide-react'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import ProductEditor from '@/components/menu/ProductEditor'
import {
  type Category, type ProductFull, menuApi, priceRange,
} from '@/lib/menu'

type ActiveFilter = 'active' | 'inactive' | 'all'

export default function MenuManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [active, setActive] = useState<ActiveFilter>('active')
  const [categoryId, setCategoryId] = useState<number | 0>(0) // 0 = todas

  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<ProductFull | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('')
      const [{ categories }, { products }] = await Promise.all([
        menuApi.categories(),
        menuApi.products({ active, categoryId: categoryId || undefined }),
      ])
      setCategories(categories)
      setProducts(products)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [active, categoryId])

  useEffect(() => { load() }, [load])

  async function toggleActive(p: ProductFull) {
    await menuApi.setActive(p.id, !p.is_active)
    load()
  }

  async function remove(p: ProductFull) {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await menuApi.remove(p.id)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo eliminar')
    }
  }

  // Agrupar por categoría, respetando el orden del catálogo
  const grouped = categories
    .map(cat => ({ cat, items: products.filter(p => p.category_id === cat.id) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="mx-auto w-full max-w-[720px]">
      {/* Título grande */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[34px] font-bold tracking-tight text-white">Menú</h1>
        <Button onClick={() => { setEditing(null); setEditorOpen(true) }}>
          <Plus size={20} /> Nuevo
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Segmented<ActiveFilter>
          value={active}
          onChange={setActive}
          options={[
            { value: 'active', label: 'Activos' },
            { value: 'inactive', label: 'Inactivos' },
            { value: 'all', label: 'Todos' },
          ]}
        />
        <select
          value={categoryId}
          onChange={e => setCategoryId(Number(e.target.value))}
          className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] px-3 py-2 text-[15px] text-white outline-none"
        >
          <option value={0}>Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius-md)] bg-[#fb2424]/15 px-4 py-3 text-[15px] text-[#fb2424]">
          {error}
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <SkeletonList />
      ) : grouped.length === 0 ? (
        <EmptyState onAdd={() => { setEditing(null); setEditorOpen(true) }} />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ cat, items }) => (
            <section key={cat.id}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  {cat.name}
                </h2>
              </div>
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
                {items.map((p, i) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    divider={i > 0}
                    onEdit={() => { setEditing(p); setEditorOpen(true) }}
                    onToggle={() => toggleActive(p)}
                    onDelete={() => remove(p)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ProductEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={load}
        categories={categories}
        product={editing}
      />
    </div>
  )
}

function ProductRow({ product, divider, onEdit, onToggle, onDelete }: {
  product: ProductFull
  divider: boolean
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${divider ? 'border-t border-[var(--color-border)]' : ''}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-[17px] font-semibold ${product.is_active ? 'text-white' : 'text-[var(--color-text-tertiary)] line-through'}`}>
            {product.name}
          </p>
          {!product.is_active && (
            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[12px] text-[var(--color-text-secondary)]">
              Inactivo
            </span>
          )}
        </div>
        <p className="mt-0.5 flex flex-wrap gap-x-3 text-[13px] text-[var(--color-text-secondary)]">
          <span className="tabular font-medium text-[var(--color-accent)]">{priceRange(product.prices)}</span>
          {product.ingredients.length > 0 && <span>{product.ingredients.length} ingr.</span>}
          {product.extras.length > 0 && <span>{product.extras.length} extras</span>}
          {product.option_groups.length > 0 && <span>{product.option_groups.length} grupos</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <IconBtn label="Editar" onClick={onEdit}><Pencil size={18} /></IconBtn>
        <IconBtn label={product.is_active ? 'Desactivar' : 'Activar'} onClick={onToggle}>
          {product.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconBtn>
        <IconBtn label="Eliminar" onClick={onDelete} danger><Trash2 size={18} /></IconBtn>
      </div>
    </div>
  )
}

function IconBtn({ children, label, onClick, danger }: {
  children: React.ReactNode; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-colors
        ${danger ? 'text-[#fb2424] hover:bg-[#fb2424]/10' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-white'}`}
    >
      {children}
    </button>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <UtensilsCrossed size={48} className="text-[var(--color-text-tertiary)]" />
      <p className="text-[17px] font-semibold text-white">Sin productos</p>
      <p className="max-w-xs text-[15px] text-[var(--color-text-secondary)]">
        No hay productos con este filtro. Crea el primero para empezar a armar el menú.
      </p>
      <Button onClick={onAdd}><Plus size={20} /> Nuevo producto</Button>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-6">
      {[0, 1].map(s => (
        <div key={s}>
          <div className="mb-2 h-3 w-32 rounded bg-[var(--color-surface-2)]" />
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
            {[0, 1, 2].map(i => (
              <div key={i} className={`flex items-center gap-3 px-4 py-4 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-[var(--color-surface-2)]" />
                  <div className="mt-2 h-3 w-24 rounded bg-[var(--color-surface-2)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
