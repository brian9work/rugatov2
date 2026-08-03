import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/usuarios — lista de empleados
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, lastname, email, type, is_active, phone, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ users: data })
}

// POST /api/usuarios — alta: crea cuenta de Auth + fila de dominio
export async function POST(req: NextRequest) {
  const { name, lastname, phone, password, type, email } = await req.json()

  if (!email || !password || !type || !name) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'No se pudo crear la cuenta' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('users').insert({
    auth_id: authData.user.id,
    email,
    name,
    lastname: lastname || null,
    phone: phone || null,
    type,
    is_active: true,
  })

  if (dbError) {
    // rollback de la cuenta de Auth si falla la fila de dominio
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

// PUT /api/usuarios — edición de datos (no toca la contraseña)
export async function PUT(req: NextRequest) {
  const { id, name, lastname, phone, type } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('users')
    .update({ name, lastname: lastname || null, phone: phone || null, type })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

// PATCH /api/usuarios — activar/desactivar (banea la cuenta de Auth en paralelo)
export async function PATCH(req: NextRequest) {
  const { id, is_active } = await req.json()
  if (!id || is_active === undefined) {
    return NextResponse.json({ error: 'ID y estado requeridos' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: userData } = await supabase
    .from('users').select('auth_id').eq('id', id).single()

  if (userData?.auth_id) {
    await supabase.auth.admin.updateUserById(userData.auth_id, {
      ban_duration: is_active ? 'none' : '876000h',
    })
  }

  const { error } = await supabase.from('users').update({ is_active }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
