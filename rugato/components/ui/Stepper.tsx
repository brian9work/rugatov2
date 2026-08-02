'use client'

import { Minus, Plus } from 'lucide-react'

// Stepper − valor + para cantidades. DISENO.md §6.7
export default function Stepper({ value, onChange, min = 1 }: {
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-white disabled:opacity-40'
  return (
    <div className="flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        <Minus size={18} />
      </button>
      <span className="tabular w-8 text-center text-[17px] font-semibold text-white">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)}>
        <Plus size={18} />
      </button>
    </div>
  )
}
