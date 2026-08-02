# Módulo 6 — Gastos

> Estado: **implementado.** Registro y consulta de gastos en `/dashboard/gastos`
> (solo admin). Migración `0005_finances_expenses.sql`.
>
> Alcance de esta entrega: **gastos**. Ingresos manuales (`revenues`) y caja
> (`cash_movements`) quedan para el módulo de Reportes/Caja.

## 1. Objetivo

Que el admin registre gastos con categoría, monto y motivo, y vea el total por
periodo (hoy / semana / mes).

## 2. Qué hacía el 0.1

Ver [SISTEMA-0.1.md §5, §6](../SISTEMA-0.1.md). El 0.1 tenía `expense` **y**
`financial_expense` (duplicadas) con montos en `varchar`. Aquí se fusionan en una
sola tabla `expenses` con `numeric(10,2)` y categoría normalizada.

## 3. Modelo de datos

- `expense_categories` — catálogo (sembrado: Insumos, Servicios, Nómina, Renta,
  Mantenimiento, Otros).
- `expenses` — `user_id`, `category_id`, `amount numeric(10,2) > 0`, `reason`,
  timestamps. Trigger `set_expense_user` rellena `user_id` con el usuario
  autenticado si no viene.

**RLS:**

| Tabla | select | insert / update / delete |
|-------|--------|--------------------------|
| `expense_categories` | autenticado | admin |
| `expenses` | **admin** | **admin** |

## 4. Acceso a datos

A diferencia de menú y órdenes, **todo va por el cliente Supabase con RLS**
(no hay route handlers): la pantalla es solo-admin y el admin autenticado pasa
`is_admin()`. `lib/expenses.ts` encapsula las llamadas.

## 5. Pantalla

`/dashboard/gastos` → `components/expenses/ExpensesManager.tsx`:

- Título "Gastos" + botón "Nuevo".
- Segmented de periodo: Hoy / Semana / Mes.
- Tarjeta con el **total** del periodo.
- Lista de gastos (categoría, motivo, fecha, monto) con eliminar.
- Alta en **Sheet**: monto (teclado numérico), categoría, descripción.
- Estados vacío / carga / error.

## 6. Archivos

| Acción | Archivo |
|--------|---------|
| nuevo | `supabase/migrations/0005_finances_expenses.sql` |
| editar | `lib/database.types.ts` (tablas `expense_categories`, `expenses`) |
| nuevo | `lib/expenses.ts` |
| nuevo | `components/expenses/ExpensesManager.tsx` |
| editar | `app/dashboard/gastos/page.tsx` |

## 7. Pruebas hechas

- [x] Admin inserta gasto → `user_id` se auto-rellena (trigger); monto numeric.
- [x] Admin lee sus gastos.
- [x] Usuario no admin: lectura devuelve `[]`; insert responde **403**.
- [x] `npm run build` pasa.

## 8. Pendientes

1. **Ingresos y caja** (`revenues`, `cash_movements`) — módulo Reportes/Caja.
2. **CRUD de categorías de gasto** desde la UI (hoy por SQL).
3. **¿El mesero registra gastos?** Decisión abierta ([MODELO-DATOS §9](../MODELO-DATOS.md)).
   Hoy es solo-admin.
4. **Editar gasto** (hoy solo alta y borrado).
