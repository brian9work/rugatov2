import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/orders/:id — acciones sobre el ticket: cancelar o entregar.
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const orderId = Number(id)
  const body = await req.json()
  const supabase = createAdminClient()

  if (body.action === 'cancel') {
    // cancela todas las líneas; el trigger deja el ticket en 'cancelado'
    const { error } = await supabase
      .from('order_items').update({ status: 'cancelado' }).eq('order_id', orderId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (body.action === 'deliver') {
    if (!body.payment)
      return NextResponse.json({ error: 'Falta la forma de pago' }, { status: 400 })
    const { error } = await supabase.rpc('deliver_order', {
      p_order_id: orderId,
      p_delivered_by: body.delivered_by ?? null,
      p_payment: body.payment,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (body.action === 'set_payment') {
    if (!body.payment)
      return NextResponse.json({ error: 'Falta la forma de pago' }, { status: 400 })
    const { error } = await supabase.rpc('set_order_payment', {
      p_order: orderId, p_payment: body.payment,
      p_user: body.user_id ?? null, p_user_name: body.user_name ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (body.action === 'set_total') {
    if (typeof body.total !== 'number' || body.total < 0)
      return NextResponse.json({ error: 'Total inválido' }, { status: 400 })
    const { error } = await supabase.rpc('set_order_total', {
      p_order: orderId, p_total: body.total,
      p_user: body.user_id ?? null, p_user_name: body.user_name ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (body.action === 'update_data') {
    const { error } = await supabase.rpc('update_order_data', {
      p_order_id: orderId,
      p_service: body.service,
      p_table: body.table_number ?? null,
      p_customer: body.customer_name ?? null,
      p_notes: body.notes ?? null,
      p_user: body.user_id ?? null,
      p_user_name: body.user_name ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
