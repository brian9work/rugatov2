'use client'

interface Props<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}

// Segmented control iOS. DISENO.md §6.4
export default function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="inline-flex rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-1">
      {options.map(opt => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-[calc(var(--radius-md)-4px)] px-3 py-1.5 text-[15px] font-medium transition-colors
              ${active ? 'bg-[var(--color-surface)] text-white shadow' : 'text-[var(--color-text-secondary)]'}`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
