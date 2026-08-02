import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/orders/items/:id — avanza el estado de una línea (cocina/barra).
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { status } = await req.json()
  if (!status)
    return NextResponse.json({ error: 'Falta el estado' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.rpc('set_item_status', {
    p_item_id: Number(id),
    p_status: status,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
