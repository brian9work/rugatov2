'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/UserContext'
import { supabase } from '@/lib/supabase'
import { ROLE_HEX } from '@/lib/roles'
import Sidebar from './components/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      className="flex min-h-screen bg-bg-primary"
      style={{ ['--color-accent' as string]: ROLE_HEX[user.type] }}
    >
      {/* Sidebar solo en escritorio */}
      <div className="hidden md:flex">
        <Sidebar role={user.type} userName={user.name} onLogout={handleLogout} />
      </div>

      <main className="flex-1 overflow-auto p-4 pb-24 md:p-6 md:pb-6">{children}</main>

      {/* Tab bar solo en móvil */}
      <MobileNav role={user.type} onLogout={handleLogout} />
    </div>
  )
}
