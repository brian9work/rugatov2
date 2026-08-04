'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Users,
  UtensilsCrossed,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { type UserRole, ROLE_LABELS, ROLE_TEXT, ROLE_BORDER, ROLE_BG } from '@/lib/roles'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Panel de Control', href: '/dashboard',              icon: <LayoutDashboard size={20} /> },
    { label: 'Gastos',           href: '/dashboard/gastos',       icon: <DollarSign size={20} /> },
    { label: 'Empleados',        href: '/dashboard/empleados',    icon: <Users size={20} /> },
    { label: 'Menú',             href: '/dashboard/menu',         icon: <UtensilsCrossed size={20} /> },
    { label: 'Órdenes',          href: '/dashboard/ordenes',      icon: <ClipboardList size={20} /> },
    { label: 'Reportes',         href: '/dashboard/reportes',     icon: <BarChart3 size={20} /> },
    { label: 'Configuración',    href: '/dashboard/configuracion',icon: <Settings size={20} /> },
  ],
  cocina: [
    { label: 'Panel de Control', href: '/dashboard',         icon: <LayoutDashboard size={20} /> },
    { label: 'Órdenes',          href: '/dashboard/ordenes', icon: <ClipboardList size={20} /> },
  ],
  barra: [
    { label: 'Panel de Control', href: '/dashboard',         icon: <LayoutDashboard size={20} /> },
    { label: 'Órdenes',          href: '/dashboard/ordenes', icon: <ClipboardList size={20} /> },
  ],
  user: [
    { label: 'Panel de Control', href: '/dashboard',         icon: <LayoutDashboard size={20} /> },
    { label: 'Órdenes',          href: '/dashboard/ordenes', icon: <ClipboardList size={20} /> },
  ],
}

interface SidebarProps {
  role: UserRole
  userName: string
  onLogout: () => void
}

export default function Sidebar({ role, userName, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const colors = { text: ROLE_TEXT[role], border: ROLE_BORDER[role], bg: ROLE_BG[role] }
  const navItems = navByRole[role]

  return (
    <aside
      className={`relative flex flex-col bg-bg-secondary border-r border-gray-700 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-bg-secondary border border-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center justify-center border-b border-gray-700 ${collapsed ? 'px-2 py-4' : 'px-4 py-5'}`}>
        <Image
          src={collapsed ? '/logo-sm.webp' : '/logo.webp'}
          alt="Rugato"
          width={collapsed ? 40 : 180}
          height={collapsed ? 40 : 58}
          priority
          className={collapsed ? 'h-9 w-9 object-contain' : 'h-auto w-full max-w-[170px] object-contain'}
        />
      </div>

      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-700 ${collapsed ? 'justify-center' : ''}`}>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-bg-primary text-sm ${colors.bg}`}>
          {userName.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userName}</p>
            <p className={`text-xs font-medium ${colors.text}`}>{ROLE_LABELS[role]}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${isActive
                  ? `${colors.bg} text-bg-primary`
                  : `text-gray-400 hover:text-white hover:bg-bg-primary`
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={onLogout}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-bg-primary transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
