'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type UserRole } from '@/lib/roles'
import { DEV_BYPASS_AUTH, DEV_MOCK_USER } from '@/lib/devConfig'

interface UserData {
  id: number
  name: string
  lastname: string
  email: string
  phone: string
  type: UserRole
  is_active: boolean
}

interface UserContextValue {
  user: UserData | null
  loading: boolean
  refresh: () => Promise<void>
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(
    DEV_BYPASS_AUTH ? DEV_MOCK_USER : null,
  )
  const [loading, setLoading] = useState(!DEV_BYPASS_AUTH)

  async function loadUser() {
    // ⚠️ DEV: login deshabilitado, ver lib/devConfig.ts
    if (DEV_BYPASS_AUTH) {
      setUser(DEV_MOCK_USER)
      setLoading(false)
      return
    }

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('users')
      .select('id, name, lastname, email, phone, type, is_active')
      .eq('email', authUser.email)
      .single()

    setUser(data ?? null)
    setLoading(false)
  }

  useEffect(() => {
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, refresh: loadUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
