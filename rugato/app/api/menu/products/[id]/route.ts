import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const NESTED =
  '*, category:categories(*), prices:product_prices(*), ingredients(*), extras(*), option_groups(*, items:option_items(*))'

type Params = { params: Promise<{ id: string }> }

// GET /api/menu/products/:id — un producto completo.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products').select(NESTED).eq('id', Number(id)).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ product: data })
}

// PATCH /api/menu/products/:id — baja/alta lógica.
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { is_active } = await req.json()
  if (typeof is_active !== 'boolean')
    return NextResponse.json({ error: 'is_active requerido' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products').update({ is_active }).eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

// DELETE /api/menu/products/:id — baja física (cascade a hijos).
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
