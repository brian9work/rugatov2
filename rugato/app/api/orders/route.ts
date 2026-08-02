import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { type CreateOrderPayload } from '@/lib/orders'

// POST /api/orders — crea la orden de forma atómica (create_order).
export async function POST(req: NextRequest) {
  const payload = (await req.json()) as CreateOrderPayload

  if (!payload.items?.length)
    return NextResponse.json({ error: 'La orden no tiene productos' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('create_order', {
    payload: payload as never,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data })
}
