'use client'

import { useMemo, useState } from 'react'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import Segmented from '@/components/ui/Segmented'
import Stepper from '@/components/ui/Stepper'
import {
  type ProductFull, type ProductSize, SIZE_LABELS, sizesFor,
} from '@/lib/menu'
import { type CartLine, unitPriceOf, lineTotal } from '@/lib/orders'

let keySeq = 0

interface Props {
  product: ProductFull
  onClose: () => void
  onAdd: (line: CartLine) => void
}

export default function ProductConfig({ product, onClose, onAdd }: Props) {
  const mode = product.category?.pricing_mode ?? 'unico'
  const sizes = sizesFor(mode)

  const [size, setSize] = useState<ProductSize>(sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState<number[]>([])
  const [extraIds, setExtraIds] = useState<number[]>([])
  const [optionIds, setOptionIds] = useState<number[]>([])
  const [notes, setNotes] = useState('')

  const draft: CartLine = useMemo(() => ({
    key: '', product, size, quantity,
    removedIngredientIds: removed, extraIds, optionIds, notes, extraCharge: 0,
  }), [product, size, quantity, removed, extraIds, optionIds, notes])

  function toggle(list: number[], set: (v: number[]) => void, id: number) {
    set(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  // opciones: respeta max_choices por grupo
  function toggleOption(groupMax: number, groupItemIds: number[], id: number) {
    setOptionIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      const inGroup = prev.filter(x => groupItemIds.includes(x))
      if (groupMax === 1) return [...prev.filter(x => !groupItemIds.includes(x)), id] // radio
      if (inGroup.length >= groupMax) return prev // límite alcanzado
      return [...prev, id]
    })
  }

  function add() {
    onAdd({ ...draft, key: `l${++keySeq}` })
    onClose()
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={product.name}
      footer={
        <Button block onClick={add}>
          Agregar · ${lineTotal(draft).toFixed(0)}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {product.category && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
                style={{ background: `color-mix(in srgb, ${product.category.color} 25%, transparent)`, color: '#fff' }}>
            {product.category.name}
          </span>
        )}

        {/* Tamaño */}
        {mode === 'tres_tamanos' && (
          <Section label="Tamaño">
            <Segmented<ProductSize>
              value={size}
              onChange={setSize}
              options={sizes.map(s => ({ value: s, label: `${SIZE_LABELS[s]} · $${unitPriceOf(product, s).toFixed(0)}` }))}
            />
          </Section>
        )}

        {/* Quitar ingredientes */}
        {product.ingredients.length > 0 && (
          <Section label="Quitar ingredientes">
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map(i => (
                <Chip key={i.id} active={removed.includes(i.id)} danger
                      onClick={() => toggle(removed, setRemoved, i.id)}>
                  {removed.includes(i.id) ? `Sin ${i.name}` : i.name}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        {/* Extras */}
        {product.extras.length > 0 && (
          <Section label="Extras">
            <div className="flex flex-wrap gap-2">
              {product.extras.map(e => (
                <Chip key={e.id} active={extraIds.includes(e.id)}
                      onClick={() => toggle(extraIds, setExtraIds, e.id)}>
                  {e.name} +${Number(e.price).toFixed(0)}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        {/* Grupos de opciones (armables) */}
        {product.option_groups.map(g => {
          const ids = g.items.map(i => i.id)
          return (
            <Section key={g.id} label={`${g.name}${g.max_choices > 1 ? ` (máx ${g.max_choices})` : ''}`}>
              <div className="flex flex-wrap gap-2">
                {g.items.map(o => (
                  <Chip key={o.id} active={optionIds.includes(o.id)}
                        onClick={() => toggleOption(g.max_choices, ids, o.id)}>
                    {o.name}{Number(o.extra_price) > 0 ? ` +$${Number(o.extra_price).toFixed(0)}` : ''}
                  </Chip>
                ))}
              </div>
            </Section>
          )
        })}

        {/* Cantidad */}
        <Section label="Cantidad">
          <Stepper value={quantity} onChange={setQuantity} />
        </Section>

        {/* Notas */}
        <Section label="Notas">
          <textarea
            className="min-h-16 w-full rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-[17px] text-white placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej. poco hielo" />
        </Section>
      </div>
    </Sheet>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">{label}</span>
      {children}
    </div>
  )
}

function Chip({ active, danger, onClick, children }: {
  active: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-2 text-[15px] font-medium transition-colors"
      style={
        active
          ? danger
            ? { background: 'color-mix(in srgb, #fb2424 20%, transparent)', color: '#fb2424' }
            : { background: 'var(--color-accent)', color: '#111827' }
          : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }
      }
    >
      {children}
    </button>
  )
}
