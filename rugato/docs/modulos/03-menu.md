# Módulo 3 — Menú

> Estado: **implementado** (CRUD admin). Base de datos, route handlers y UI.
> Falta: refactor a tab bar (pendiente global de diseño) y mover lecturas a RLS
> cuando exista auth real.

## 1. Objetivo

Que el admin gestione el catálogo: productos con sus precios (por tamaño),
ingredientes quitables, extras de pago y grupos de opciones para productos
armables. Las categorías vienen sembradas y definen el comportamiento.

## 2. Qué hacía el 0.1

Ver [SISTEMA-0.1.md §7](../SISTEMA-0.1.md). Resumen de lo que se conserva:

- Producto con **precio único** o **tres tamaños** (ch/med/gde), según categoría.
- Ingredientes **quitables**, extras **de pago**, productos **armables** (builds).
- 15 categorías con color.

Lo que se descartó y por qué:

| 0.1 | v2 |
|-----|-----|
| Categorías **hardcodeadas** en el frontend (`["1","2",...].includes(cat)`) | `pricing_mode`, `has_options`, `is_freeform` como **columnas** de `categories` |
| Cuatro columnas de precio (`price`, `price_ch/med/gde`) en `varchar` | Tabla `product_prices` con `numeric(10,2)` por tamaño |
| Guardado en **4 llamadas** sin transacción | Una sola RPC atómica `save_product` |
| `builds.ingredients_list` texto serializado | `option_groups` + `option_items` normalizados |
| FKs `on delete cascade` en todo | `on delete restrict` de producto→categoría |

## 3. Modelo de datos

Migraciones `0001_base.sql` y `0002_menu.sql`. Detalle en
[MODELO-DATOS.md §4–5](../MODELO-DATOS.md). Tablas del módulo:

`categories` · `products` · `product_prices` · `ingredients` · `extras` ·
`option_groups` · `option_items`.

Todas con **RLS activo**:
- `<t>_select_auth` → cualquier empleado autenticado lee.
- `<t>_write_admin` → solo admin escribe (`public.is_admin()`).

### `save_product(payload jsonb) → bigint`

Función `security definer` que crea (si `id` es null) o edita un producto
completo **en una transacción**: producto + precios + ingredientes + extras +
grupos/opciones. En edición **reemplaza** los hijos (delete + reinsert).

`execute` revocado a `public/anon/authenticated`: solo se invoca vía route
handler con `service_role`.

Semilla: las 15 categorías con su `pricing_mode`/`has_options`/`is_freeform`
equivalentes al 0.1 (ver tabla en [MODELO-DATOS.md §5](../MODELO-DATOS.md)).

## 4. Reglas de negocio

1. **Los tamaños dependen de la categoría.** `tres_tamanos` → chico/mediano/
   grande; `unico` → único. Lo resuelve `sizesFor()` en `lib/menu.ts`.
2. **Al menos un precio** por producto para poder guardar.
3. **Grupos de opciones solo si** `category.has_options`. Si la categoría no es
   armable, se ignoran aunque vengan en el payload.
4. **Baja lógica** con `is_active` (botón desactivar/activar). La baja física
   (eliminar) borra en cascada precios/ingredientes/extras/grupos.
5. **Precios en el servidor.** El cliente manda montos al guardar, pero al
   tomar órdenes (módulo 4) el precio se leerá de `product_prices`, no del
   cliente.

## 5. Acceso a datos

Todo pasa por **route handlers con `service_role`** (`lib/supabase/admin.ts`):

| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/api/menu/categories` | Catálogo de categorías |
| GET | `/api/menu/products?category=&active=all\|active\|inactive` | Lista con anidados |
| POST | `/api/menu/products` | Crea/edita (llama `save_product`) |
| GET | `/api/menu/products/:id` | Un producto completo |
| PATCH | `/api/menu/products/:id` | Baja/alta lógica |
| DELETE | `/api/menu/products/:id` | Baja física |

**Por qué service_role y no RLS-cliente:** hoy el login está bypasseado
(`lib/devConfig.ts`), así que no hay `auth.uid()` y RLS bloquearía todo desde el
browser. Además, gestionar el menú es acción de admin. Cuando exista auth real,
las **lecturas** pueden moverse al cliente Supabase con RLS
(`<t>_select_auth`); las **escrituras** se quedan en el route handler.

## 6. Pantallas

`/dashboard/menu` → `components/menu/MenuManager.tsx`.

- **Título grande** "Menú" + botón "Nuevo" (DISENO.md §5.3).
- **Filtros**: segmented Activos/Inactivos/Todos + select de categoría.
- **Lista agrupada por categoría** (DISENO.md §6.1): cada grupo con punto de
  color y encabezado; celdas con nombre, rango de precio, y conteo de
  ingredientes/extras/grupos. Acciones por celda: editar, activar/desactivar,
  eliminar (área táctil 44px).
- **Estados**: skeleton al cargar, estado vacío con CTA, banda de error.
- **Editor** `components/menu/ProductEditor.tsx` en **Sheet** (DISENO.md §6.3):
  nombre, categoría, descripción, precios (dinámicos por `pricing_mode`),
  editores de ingredientes y extras, y editor de grupos de opciones **solo si la
  categoría es armable**. Toggle activo. Guarda vía `menuApi.save`.

Componentes UI nuevos, reutilizables: `components/ui/{Button,Sheet,Segmented}.tsx`.

## 7. Archivos

| Acción | Archivo |
|--------|---------|
| nuevo | `supabase/migrations/0000_drop_legacy_tables.sql` |
| nuevo | `supabase/migrations/0001_base.sql` |
| nuevo | `supabase/migrations/0002_menu.sql` |
| nuevo | `lib/database.types.ts` (generado) |
| nuevo | `lib/supabase/admin.ts` |
| nuevo | `lib/menu.ts` (tipos + cliente HTTP) |
| nuevo | `app/api/menu/categories/route.ts` |
| nuevo | `app/api/menu/products/route.ts` |
| nuevo | `app/api/menu/products/[id]/route.ts` |
| nuevo | `components/ui/{Button,Sheet,Segmented}.tsx` |
| nuevo | `components/menu/{MenuManager,ProductEditor}.tsx` |
| editar | `app/dashboard/menu/page.tsx` |
| editar | `app/dashboard/layout.tsx` (fija `--color-accent` por rol) |
| editar | `app/globals.css` (tokens de diseño + keyframes) |

## 8. Pruebas hechas

- [x] `save_product` alta 3 tamaños con ingredientes y extras.
- [x] `save_product` alta armable con 2 grupos de opciones.
- [x] `save_product` edición: reemplaza precios e hijos.
- [x] Lectura anidada correcta (precios, conteos, categoría).
- [x] `npm run build` pasa (TypeScript incluido).
- [x] RLS activo en las 7 tablas; `save_product` sin execute a anon.
- [ ] **Pendiente**: probar con roles reales (cocina/user) que las lecturas se
      permiten y las escrituras se deniegan — requiere módulo 1 (login) real.
- [ ] **Pendiente**: verificación visual en celular/tablet/PC.

## 9. Pendientes / deuda conocida

1. **Editar borra y reinserta hijos.** Cuando exista `order_items` (módulo 4)
   con FK `restrict` a ingredientes/extras/opciones, borrar un hijo referenciado
   por una orden histórica fallará. Al llegar el módulo 4: cambiar a
   conciliación (soft-delete o upsert por id) en `save_product`.
2. **Lecturas por service_role.** Mover a RLS-cliente cuando haya auth real
   (§5).
3. **Sin reordenamiento** de productos ni de opciones en la UI (existe
   `sort_order` en BD, falta drag & drop).
4. **CRUD de categorías** no incluido: se administran por SQL. Si el negocio
   necesita crear categorías desde la UI, es una pantalla aparte (usa las
   columnas `pricing_mode`/`has_options`/`is_freeform`).
5. **Validación de `product_prices`** (que `tres_tamanos` tenga sus 3 filas) es
   solo en la app, no hay constraint en BD.
