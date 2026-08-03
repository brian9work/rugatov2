import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// POST /api/orders/:id/items — agrega un producto a una orden abierta (audita).
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { item, user_id, user_name } = await req.json()
  if (!item?.product_id)
    return NextResponse.json({ error: 'Producto requerido' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('add_order_item', {
    p_order_id: Number(id),
    p_item: item,
    p_user: user_id ?? null,
    p_user_name: user_name ?? null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data })
}
