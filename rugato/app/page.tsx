'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DEV_BYPASS_AUTH } from '@/lib/devConfig'

export default function LoginPage() {
  const router = useRouter()

  // ⚠️ DEV: login deshabilitado, ver lib/devConfig.ts
  useEffect(() => {
    if (DEV_BYPASS_AUTH) router.replace('/dashboard')
  }, [router])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('type, name, is_active')
      .eq('email', authData.user.email)
      .single()

    if (!userData) {
      setError('No se encontró el usuario en el sistema')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!userData.is_active) {
      setError('Tu cuenta está desactivada. Contacta al administrador.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-sm bg-bg-secondary rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Rugato</h1>
          <p className="text-gray-400 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="bg-bg-primary border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-role-admin transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-primary border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-role-admin transition-colors"
            />
          </div>

          {error && (
            <p className="text-status-cancelado text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-role-admin text-bg-primary font-semibold rounded-lg py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
