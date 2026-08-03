'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3,
  DollarSign, Users, Settings, MoreHorizontal, LogOut,
} from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import { type UserRole } from '@/lib/roles'

interface Item { label: string; href: string; icon: React.ElementType }

const HOME:   Item = { label: 'Inicio',   href: '/dashboard',          icon: LayoutDashboard }
const ORD:    Item = { label: 'Órdenes',  href: '/dashboard/ordenes',  icon: ClipboardList }
const MENU:   Item = { label: 'Menú',     href: '/dashboard/menu',     icon: UtensilsCrossed }
const REP:    Item = { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 }
const GASTOS: Item = { label: 'Gastos',        href: '/dashboard/gastos',        icon: DollarSign }
const EMP:    Item = { label: 'Empleados',     href: '/dashboard/empleados',     icon: Users }
const CFG:    Item = { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings }

// Pestañas primarias + overflow ("Más") por rol
const NAV: Record<UserRole, { primary: Item[]; more: Item[] }> = {
  admin:  { primary: [HOME, ORD, MENU, REP], more: [GASTOS, EMP, CFG] },
  cocina: { primary: [HOME, ORD],            more: [] },
  user:   { primary: [HOME, ORD],            more: [] },
}

export default function MobileNav({ role, onLogout }: { role: UserRole; onLogout: () => void }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const { primary, more } = NAV[role]

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {primary.map(it => <Tab key={it.href} item={it} active={isActive(it.href)} />)}
        {/* "Más" siempre visible: contiene overflow + cerrar sesión */}
        <button onClick={() => setMoreOpen(true)}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[var(--color-text-tertiary)]">
          <MoreHorizontal size={22} />
          <span className="text-[11px] font-medium">Más</span>
        </button>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="Más">
        <div className="flex flex-col gap-4">
          {more.length > 0 && (
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)]">
              {more.map((it, i) => {
                const Icon = it.icon
                return (
                  <Link key={it.href} href={it.href} onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
                    <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                    <span className="flex-1 text-[17px] text-white">{it.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
          <button onClick={() => { setMoreOpen(false); onLogout() }}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-primary)] px-4 py-3 text-left">
            <LogOut size={20} className="text-[#fb2424]" />
            <span className="flex-1 text-[17px] text-[#fb2424]">Cerrar sesión</span>
          </button>
        </div>
      </Sheet>
    </>
  )
}

function Tab({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon
  return (
    <Link href={item.href}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
          style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
      <Icon size={22} />
      <span className="text-[11px] font-medium">{item.label}</span>
    </Link>
  )
}
