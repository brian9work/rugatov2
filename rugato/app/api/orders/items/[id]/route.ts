import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/orders/items/:id — avanza estado (status) o cambia cantidad (qty).
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const supabase = createAdminClient()

  if (typeof body.qty === 'number') {
    const { error } = await supabase.rpc('update_order_item_qty', {
      p_item_id: Number(id), p_qty: body.qty,
      p_user: body.user_id ?? null, p_user_name: body.user_name ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (body.status) {
    const { error } = await supabase.rpc('set_item_status', {
      p_item_id: Number(id), p_status: body.status,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Falta status o qty' }, { status: 400 })
}

// DELETE /api/orders/items/:id — quita un producto de una orden abierta (audita).
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('remove_order_item', {
    p_item_id: Number(id),
    p_user: body.user_id ?? null,
    p_user_name: body.user_name ?? null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
