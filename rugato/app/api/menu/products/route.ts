import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { type SaveProductPayload } from '@/lib/menu'

const NESTED =
  '*, category:categories(*), prices:product_prices(*), ingredients(*), extras(*), option_groups(*, items:option_items(*))'

// GET /api/menu/products?category=&active=all|active|inactive
export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const active = searchParams.get('active') ?? 'active'

  let query = supabase.from('products').select(NESTED).order('name')
  if (category) query = query.eq('category_id', Number(category))
  if (active === 'active') query = query.eq('is_active', true)
  if (active === 'inactive') query = query.eq('is_active', false)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ products: data })
}

// POST /api/menu/products — crea o edita (payload.id define cuál) de forma atómica.
export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const payload = (await req.json()) as SaveProductPayload

  if (!payload.name?.trim())
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  if (!payload.category_id)
    return NextResponse.json({ error: 'La categoría es obligatoria' }, { status: 400 })

  const { data, error } = await supabase.rpc('save_product', {
    payload: payload as never,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data })
}
