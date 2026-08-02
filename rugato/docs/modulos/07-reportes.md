# Módulo 7 — Reportes y Panel

> Estado: **implementado.** Reportes en `/dashboard/reportes` y panel de control
> (vista general) en `/dashboard`. Migración `0006_report_function.sql`.

## 1. Objetivo

Dar al admin la foto del negocio: ventas, gastos, balance, órdenes, ticket
promedio, productos más vendidos y desglose por categoría, para un rango
(Hoy / 7 días / 30 días). El panel resume el día y da accesos rápidos.

## 2. Fuente de datos

Sin tablas nuevas. Todo se calcula sobre lo existente:

- **Ventas** = órdenes con `status='entregado'`, por `delivered_at`.
- **Productos / categorías** = `order_items` de esas ventas (join a `products` →
  `categories`).
- **Gastos** = `expenses` por `created_at`.

## 3. `get_report(p_start, p_end) → jsonb`

Agrega **en el servidor** (no se traen filas crudas al navegador). Devuelve:

```jsonc
{
  "totals": { "ventas", "ordenes", "ticket_promedio", "gastos", "balance" },
  "by_day": [{ "dia", "ventas", "ordenes", "gastos" }],
  "top_products": [{ "name", "qty", "revenue" }],        // top 10
  "sales_by_category": [{ "name", "color", "qty", "revenue" }],
  "expenses_by_category": [{ "name", "amount" }]
}
```

- `security invoker` + guard `is_admin()` → **solo admin**; no admin recibe
  error (probado: HTTP 400). Respeta RLS de las tablas base.
- Agrupación por día en **horario mexicano**
  (`at time zone 'America/Mexico_City'`).
- `grant execute … to authenticated` (el guard interno restringe a admin).

## 4. Pantallas

### Reportes — `/dashboard/reportes` → `components/reports/ReportsManager.tsx`
- Segmented de rango: Hoy / 7 días / 30 días (rango en horario mexicano,
  `lib/reports.ts` → `rangeFor`).
- KPIs: Ventas, Gastos, Balance, Órdenes, Ticket promedio.
- Barras de ventas vs gastos por día.
- Productos más vendidos (barras).
- Ventas por categoría (con color) y gastos por categoría.

### Panel — `/dashboard` → `components/dashboard/PanelHome.tsx`
- Saludo + nombre + rol.
- **Admin**: tarjetas Ventas/Gastos/Balance de hoy + Órdenes activas + accesos a
  todos los módulos.
- **Cocina / mesero**: tarjeta grande "Órdenes activas hoy" con enlace directo;
  sin datos financieros (no pueden llamar `get_report`).
- Órdenes activas = `orders` con estado activo y `created_at ≥ hoy` (México),
  vía RLS (staff todas, mesero las suyas).

## 5. Archivos

| Acción | Archivo |
|--------|---------|
| nuevo | `supabase/migrations/0006_report_function.sql` |
| editar | `lib/database.types.ts` (función `get_report`) |
| nuevo | `lib/reports.ts` |
| nuevo | `components/reports/ReportsManager.tsx` |
| nuevo | `components/dashboard/PanelHome.tsx` |
| editar | `app/dashboard/reportes/page.tsx`, `app/dashboard/page.tsx` |

## 6. Pruebas hechas

- [x] `get_report` como admin → estructura correcta con datos reales.
- [x] `get_report` como usuario no admin → 400 (no autorizado).
- [x] Agrupación por día en horario mexicano.
- [x] `npm run build` pasa.

## 7. Pendientes

1. **Rango personalizado** (fechas from/to libres); hoy solo 3 presets.
2. **Ventas por estación** y por forma de pago (datos ya disponibles).
3. **Exportar** (CSV/PDF).
4. Caja / corte formal — depende del módulo de Caja.
