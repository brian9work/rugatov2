import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, lastname, email, type, is_active, phone, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ users: data })
}

export async function POST(req: NextRequest) {
  const { name, lastname, phone, username, password, acronym, type, email } = await req.json()

  if (!email || !password || !type) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  const { error: dbError } = await supabaseAdmin
    .from('users')
    .insert({ name, lastname, phone, type, email, is_active: true })

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest) {
  const { id, name, lastname, phone, username, acronym, type } = await req.json()

  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('users')
    .update({ name, lastname, phone, username, acronym, type, last_updated: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { id, is_active } = await req.json()

  if (!id || is_active === undefined) {
    return NextResponse.json({ error: 'ID y estado requeridos' }, { status: 400 })
  }

  // Obtener el email del usuario para actualizar también en Auth
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('email')
    .eq('id', id)
    .single()

  if (userData?.email) {
    // Buscar el usuario en Auth por email
    const { data: authList } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = authList?.users.find(u => u.email === userData.email)

    if (authUser) {
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        ban_duration: is_active ? 'none' : '876000h',
      })
    }
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ is_active, last_updated: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
