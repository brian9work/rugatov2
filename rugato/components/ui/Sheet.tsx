'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

// Bottom sheet en móvil, modal centrado en escritorio. DISENO.md §6.3
export default function Sheet({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="rg-fade-in absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        className="rg-sheet-up relative flex max-h-[92vh] w-full flex-col overflow-hidden bg-[var(--color-surface)]
                   rounded-t-[var(--radius-xl)] sm:max-w-lg sm:rounded-[var(--radius-xl)]"
      >
        {/* agarradera */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1 w-9 rounded-full bg-[var(--color-text-tertiary)]" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-[17px] font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>

        {/* footer */}
        {footer && (
          <div className="border-t border-[var(--color-border)] p-4"
               style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
