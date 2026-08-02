'use client'

import { type ButtonHTMLAttributes } from 'react'

type Variant = 'filled' | 'tinted' | 'plain' | 'destructive'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  block?: boolean
}

// Botón iOS. El acento sale de --color-accent (color del rol). DISENO.md §6.2
export default function Button({
  variant = 'filled',
  block = false,
  className = '',
  style,
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold ' +
    'transition-[opacity,transform] duration-100 active:scale-[0.97] disabled:opacity-40 ' +
    'disabled:pointer-events-none select-none cursor-pointer min-h-[44px] px-4 text-[17px]'

  const styles: Record<Variant, React.CSSProperties> = {
    filled:      { background: 'var(--color-accent)', color: '#111827' },
    tinted:      { background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' },
    plain:       { background: 'transparent', color: 'var(--color-accent)' },
    destructive: { background: 'color-mix(in srgb, #fb2424 15%, transparent)', color: '#fb2424' },
  }

  return (
    <button
      className={`${base} ${block ? 'w-full' : ''} ${className}`}
      style={{ ...styles[variant], ...style }}
      {...rest}
    />
  )
}
