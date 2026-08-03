'use client'

import { useEffect, useState } from 'react'
import Sheet from '@/components/ui/Sheet'
import ProductConfig from '@/components/orders/ProductConfig'
import ProductPicker from '@/components/orders/ProductPicker'
import { type Category, type ProductFull, menuApi } from '@/lib/menu'
import { type CartLine } from '@/lib/orders'

// Selector de producto para agregar a una orden existente. Devuelve una línea.
export default function AddItemSheet({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (line: CartLine) => void
}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loading, setLoading] = useState(true)
  const [configuring, setConfiguring] = useState<ProductFull | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    Promise.all([menuApi.categories(), menuApi.products({ active: 'active' })])
      .then(([{ categories }, { products }]) => { setCategories(categories); setProducts(products) })
      .finally(() => setLoading(false))
  }, [open])

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Agregar producto">
        {loading ? (
          <p className="text-[15px] text-[var(--color-text-secondary)]">Cargando menú…</p>
        ) : (
          <ProductPicker categories={categories} products={products} onPick={setConfiguring} />
        )}
      </Sheet>

      {configuring && (
        <ProductConfig
          product={configuring}
          onClose={() => setConfiguring(null)}
          onAdd={line => { onAdd(line); setConfiguring(null); onClose() }}
        />
      )}
    </>
  )
}
