# Módulo 4 — Órdenes

> Estado: **base de datos implementada y validada.** UI pendiente (siguiente
> paso). Migración `0003_orders.sql` aplicada.

## 1. Objetivo

Tomar comandas: un **ticket** con varias **líneas** (productos con cantidad,
tamaño, ingredientes quitados, extras y opciones). Cada línea se **enruta a una
estación/perfil** (cocina, barra, …) y avanza su estado por separado. Cocina ve
lo suyo en tiempo real. El total se calcula en el servidor.

## 2. Qué hacía el 0.1

Ver [SISTEMA-0.1.md §7.1, §7.4–7.6](../SISTEMA-0.1.md). Cambios clave:

| 0.1 | v2 |
|-----|-----|
| Una fila de `orders` **por producto** | `orders` (ticket) + `order_items` (líneas con `quantity`) |
| Un POST por producto en un `forEach` | Una RPC atómica `create_order` |
| `details` = JSON en texto | `details jsonb` + tablas normalizadas de selección |
| Total y precio desde el cliente | Precio leído de `product_prices` **en el servidor** |
| Estatus único por orden | **Estatus por línea**; el del ticket se deriva |
| Cocina por polling | **Supabase Realtime** |
| Sin enrutamiento | **Estación por línea** (producto→categoría→default) |

## 3. Enrutamiento por estación (decisión central)

Requisito del negocio: *"dependiendo del producto se verá en un perfil diferente
(cocina, usuario o admin)"*. El **mapeo concreto aún no está definido**, así que
se construyó el **mecanismo**, configurable, no el mapeo.

- Tabla `stations` (catálogo editable). Sembradas: **Cocina** (`role_hint=cocina`)
  y **Barra** (`role_hint=user`).
- `categories.station_id` y `products.station_id` (override por producto).
- `resolve_station(product)` = producto → categoría → **default Cocina (id 1)**.
- Cada `order_items` guarda `station_id` + `station_name` (snapshot). La pantalla
  de cada estación filtra por ahí.

**Para fijar el mapeo** (cuando lo definas): actualizar `categories.station_id`.
Ejemplo: mandar todas las bebidas a Barra →
`update categories set station_id = 2 where pricing_mode='tres_tamanos';`

## 4. Estado por línea

`order_items.status` es independiente por línea (la barra puede tener listo lo
suyo antes que cocina). `orders.status` se **deriva automáticamente** (trigger
`order_items_status_sync` → `recompute_order_status`):

- Si todas las líneas están canceladas → `cancelado`.
- Si no, el ticket muestra la línea **menos avanzada**
  (`pendiente < preparando < listo < entregado`).

Validado: una línea en preparando con otra pendiente → ticket `pendiente`;
ambas listas → `listo`; entrega → `entregado`.

## 5. Funciones (todas `security definer`, sin execute a anon)

| Función | Qué hace |
|---------|----------|
| `create_order(payload jsonb) → bigint` | Crea ticket + líneas + selecciones; lee precios y resuelve estación en el servidor; calcula `line_total` y `total` |
| `set_item_status(item_id, status)` | Avanza una línea (cocina/barra) |
| `deliver_order(order_id, delivered_by, payment)` | Marca todo entregado y captura quién entrega + forma de pago |
| `resolve_station(product_id)` | Estación efectiva de un producto |
| `recompute_order_status(order_id)` | Recalcula estado del ticket |

### Forma del payload de `create_order`

```jsonc
{
  "created_by": null,           // en dev; con auth real sale de current_user_id()
  "service": "aqui",            // 'llevar' | 'aqui'
  "table_number": 5,
  "customer_name": "Juan",
  "notes": "…",
  "items": [
    {
      "product_id": 3,
      "size": "grande",         // según pricing_mode de la categoría
      "quantity": 2,
      "extra_charge": 0,        // "Costo Extra" manual del 0.1
      "notes": "sin popote",
      "removed_ingredients": ["10"],  // ids de ingredients
      "extras": ["2"],                // ids de extras
      "options": ["6"]                // ids de option_items
    }
  ]
}
```

**Cálculo por línea:** `line_total = quantity × (unit_price + extras + opciones) + extra_charge`.
Validado: 2 licuados grandes ($50) + extra ($20) + 1 ensalada ($65) + opción Atún ($10) = **$215**.

## 6. Acceso a datos y RLS

- **Escrituras** (crear orden, cambiar estatus, entregar) → route handlers con
  `service_role` que invocan las RPC. Igual que el menú, funciona sin auth real
  (login bypasseado).
- **Lecturas** → con auth real irán por cliente Supabase + RLS; se pueden
  suscribir a Realtime.

RLS aplicada:

| Tabla | select | insert / update |
|-------|--------|-----------------|
| `orders` | staff (admin/cocina) todas; `user` las suyas | insert autenticado; update staff o dueño |
| `order_items` | según visibilidad del ticket | insert autenticado; update staff |
| selección (3 tablas) | según visibilidad de la línea | staff |
| `stations` | autenticado | admin |

## 7. Realtime

`orders` y `order_items` están en la publicación `supabase_realtime`. La
pantalla de cocina se suscribe a `order_items` filtrando su estación y toca la
**campana** del 0.1 (§7.6 de SISTEMA-0.1) al llegar un `INSERT`.

## 8. Pantallas (pendiente de construir)

Según [DISENO.md](../DISENO.md), por rol:

- **Mesero** — armar orden: navegar menú por categoría → hoja de producto
  (tamaño, quitar ingredientes, extras, opciones si es armable, cantidad, notas,
  mesa) → carrito → enviar (un solo `create_order`). Luego "Mis órdenes".
- **Cocina** — tablero en tiempo real de líneas de su estación; marcar
  preparando / listo; campana en orden nueva.
- **Admin** — todas las órdenes, historial, cancelar/revertir, entregar
  (captura pago).

Componentes a reutilizar: `Sheet`, `Button`, `Segmented`, `Badge` (nuevo),
`Stepper` (nuevo). El detalle de armado de producto es el más complejo (espejo
de `ProductEditor` pero para consumir, no editar).

## 9. Archivos

| Acción | Archivo |
|--------|---------|
| nuevo | `supabase/migrations/0003_orders.sql` |
| editar | `lib/database.types.ts` (regenerar — incluye stations/orders/order_items) |
| pendiente | `lib/orders.ts` (tipos + cliente HTTP) |
| pendiente | `app/api/orders/**` (route handlers) |
| pendiente | `components/orders/**`, `components/kitchen/**` |
| pendiente | páginas en `app/dashboard/ordenes/` |

## 10. Pruebas hechas

- [x] `create_order` con extras y opciones; total correcto ($215).
- [x] Snapshots `details` correctos (removed/extras/options).
- [x] Estación resuelta al default (Cocina) sin mapeo.
- [x] Estado por línea + derivación del ticket (pendiente→listo→entregado).
- [x] `deliver_order` fija pago y fecha.
- [x] RLS activa en las 6 tablas; RPC sin execute a anon.
- [x] Realtime: `orders` y `order_items` publicadas.
- [ ] **Pendiente**: UI y prueba con roles reales.

## 11. Pendientes / decisiones abiertas

1. **Mapeo producto/categoría → estación/perfil.** Falta que definas cuál va a
   cocina, cuál a barra/usuario, cuál a admin (§3). Hoy todo cae en Cocina.
2. **`created_by` es nullable** (dev, login bypasseado). Volver a `not null` con
   el módulo 1 (login real). Igual `delivered_by`.
3. **Deuda del menú activa:** al existir `order_items` con FK `restrict` a
   ingredientes/extras/opciones, `save_product` ya **no** puede borrar/reinsertar
   hijos referenciados. Cambiar a conciliación por id antes de usar órdenes en
   serio. Ver [03-menu.md §9](03-menu.md).
4. **Folio** es secuencia continua; si debe reiniciarse por día/turno, requiere
   tabla de turnos (§9 de MODELO-DATOS).
5. **Formas de pago** del enum `payment_method` a confirmar con el negocio.
