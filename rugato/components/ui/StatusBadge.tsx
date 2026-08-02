import { STATUS_LABELS, STATUS_HEX, type OrderStatus } from '@/lib/roles'

// Píldora de estatus: color de fondo al 20% + texto pleno. DISENO.md §6.5
export default function StatusBadge({ status }: { status: OrderStatus }) {
  const hex = STATUS_HEX[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
      style={{ background: `color-mix(in srgb, ${hex} 20%, transparent)`, color: hex }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
