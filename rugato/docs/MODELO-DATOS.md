# Modelo de datos — Supabase (Postgres)

> Esquema **objetivo** de la v2. No se crea de golpe: cada módulo aplica su
> migración. Este documento es el destino; los módulos son el camino.
>
> Decisión tomada: **rediseñar y corregir**, no portar el MySQL 1:1. No se
> migran datos del sistema viejo, así que no hay compatibilidad que respetar.
> Origen y equivalencias: [SISTEMA-0.1.md](SISTEMA-0.1.md).

## 1. Reglas del esquema

Aplican a **toda** tabla nueva. Sin excepciones.

1. **Todo en `public`, todo con RLS activo.** `alter table X enable row level
   security;` en la misma migración que crea la tabla. Sin políticas → acceso
   denegado. Nunca una política `using (true)`.
2. **Identificadores en inglés, contenido en español.** Ya está establecido así
   (`users`, `is_active`, `type`).
3. **Llaves primarias** `bigint generated always as identity`. La excepción es
   `users.auth_id uuid`, que enlaza con `auth.users`.
4. **Dinero** siempre `numeric(10,2)`. Nunca `varchar`, nunca `float`.
5. **Fechas** siempre `timestamptz`. `created_at` con `default now()`;
   `updated_at` mantenido por trigger.
6. **Banderas** `boolean`, no `int` ni `bigint`.
7. **Enums de Postgres** para conjuntos cerrados y estables (rol, estatus).
   Tabla de catálogo cuando el usuario administra los valores (categorías,
   categorías de gasto).
8. **Baja lógica** con `is_active boolean`. Nada que esté referenciado por
   órdenes históricas se borra físicamente.
9. **Nombres corregidos.** `coustumer` → `table_number`. `builds` →
   `option_groups`. `menu` → `products`.
10. **Cada tabla se crea en la migración de su módulo**, numerada
    `supabase/migrations/000N_<modulo>.sql`. No se reescriben migraciones ya
    aplicadas.

## 2. Convenciones auxiliares (migración `0001`)

Se crean una sola vez y las usa todo el esquema.

### 2.1 Trigger de `updated_at`

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Se engancha en cada tabla con `updated_at`:

```sql
create trigger set_updated_at
  before update on public.<tabla>
  for each row execute function public.set_updated_at();
```

### 2.2 Helpers de RLS

Evitan repetir subconsultas en cada política. `security definer` para que
puedan leer `users` sin caer en recursión de RLS.

```sql
-- Id de dominio del usuario autenticado
create or replace function public.current_user_id()
returns bigint
language sql stable security definer set search_path = public
as $$ select id from public.users where auth_id = auth.uid() $$;

-- Rol del usuario autenticado
create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select type from public.users where auth_id = auth.uid() and is_active $$;

create or replace function public.is_admin()
returns boolean
language sql stable
as $$ select public.current_user_role() = 'admin' $$;
```

> **Nota de seguridad:** `current_user_role()` filtra por `is_active`. Un
> usuario desactivado no obtiene rol y por lo tanto no pasa ninguna política.

## 3. Enums

```sql
create type public.user_role     as enum ('admin', 'cocina', 'user');
create type public.order_status  as enum ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado');
create type public.service_type  as enum ('llevar', 'aqui');
create type public.payment_method as enum ('efectivo', 'tarjeta', 'transferencia');
create type public.product_size  as enum ('unico', 'chico', 'mediano', 'grande');
create type public.pricing_mode  as enum ('unico', 'tres_tamanos');
create type public.cash_direction as enum ('entrada', 'salida');
```

Equivalencias con el sistema viejo:

| Viejo | Nuevo |
|-------|-------|
| `type` `"1"` / `"2"` / `"3"` | `admin` / `user` / `cocina` |
| `status_id` 1,2,4,5,3 | `pendiente`, `preparando`, `listo`, `entregado`, `cancelado` |
| `service` `"Para llevar"` / `"Para comer aquí"` | `llevar` / `aqui` |
| `price` / `price_ch` / `price_med` / `price_gde` | filas en `product_prices` |

## 4. Módulo 1 — Usuarios

### `users`

Reemplaza a `user`. Sin `password` ni `user`: eso lo maneja Supabase Auth.
Sin `acronym`: se deriva de las iniciales de `name` + `lastname`.

```sql
create table public.users (
  id           bigint generated always as identity primary key,
  auth_id      uuid unique not null references auth.users(id) on delete cascade,
  email        text unique not null,
  name         text not null,
  lastname     text,
  phone        text,
  type         public.user_role not null default 'user',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
```

**RLS:**

| Política | Operación | Regla |
|----------|-----------|-------|
| `users_select_own` | select | `auth_id = auth.uid()` |
| `users_select_admin` | select | `public.is_admin()` |
| `users_update_admin` | update | `public.is_admin()` |

Insert y delete **no tienen política**: van por route handler con
`service_role`, porque crear un usuario implica crear también su cuenta en
`auth.users`.

## 5. Módulo 2 — Menú

### `categories`

Reemplaza `cat_category` y **absorbe** el arreglo hardcodeado del frontend.
Aquí está la corrección más importante del rediseño: el comportamiento del
formulario deja de estar en el código y pasa a ser un dato de la categoría.

```sql
create table public.categories (
  id             bigint generated always as identity primary key,
  name           text not null unique,
  short_name     text,                        -- "Lic. Com."
  color          text not null default '#607D8B',
  pricing_mode   public.pricing_mode not null default 'unico',
  has_options    boolean not null default false,  -- producto armable (builds)
  is_freeform    boolean not null default false,  -- captura libre ("Al gusto")
  sort_order     int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
```

Semilla equivalente al sistema viejo (§7.2 y §7.3 de SISTEMA-0.1):

| Categoría | `pricing_mode` | `has_options` | `is_freeform` |
|-----------|----------------|---------------|---------------|
| Licuados combinados, Licuados sencillos, Esquimos, Jugos sencillos, Jugos combinados, Aguas sencillas, Aguas combinadas | `tres_tamanos` | no | no |
| Bebidas calientes | `unico` | no | no |
| Baguette especial, Ensaladas al gusto | `unico` | **sí** | no |
| Al gusto | `unico` | no | **sí** |
| Bocadillos, Cocteles, Ensaladas, Sandwiches especiales | `unico` | no | no |

> Agregar una categoría nueva ya **no** requiere tocar código.

### `products`

Reemplaza `menu`. Sin las cuatro columnas de precio.

```sql
create table public.products (
  id           bigint generated always as identity primary key,
  category_id  bigint not null references public.categories(id) on delete restrict,
  name         text not null,
  description  text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on public.products (category_id) where is_active;
```

> `on delete restrict`, no `cascade`: borrar una categoría **no** debe llevarse
> los productos ni, en cadena, el histórico de órdenes. En el sistema viejo
> todo era `cascade`.

### `product_prices`

Sustituye `price` / `price_ch` / `price_med` / `price_gde`.

```sql
create table public.product_prices (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  size        public.product_size not null,
  price       numeric(10,2) not null check (price >= 0),
  unique (product_id, size)
);
```

Regla: si la categoría es `unico`, existe una fila con `size = 'unico'`; si es
`tres_tamanos`, existen tres filas (`chico`, `mediano`, `grande`). Se valida en
la capa de aplicación, no con constraint.

### `ingredients`

Ingredientes que el cliente puede **quitar**. Reemplaza `ingredients`.
`cat_ingredients` (catálogo global) desaparece: nunca se usó de verdad.

```sql
create table public.ingredients (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  name        text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
```

### `extras`

Agregados de pago.

```sql
create table public.extras (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  name        text not null,
  price       numeric(10,2) not null default 0 check (price >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
```

### `option_groups` y `option_items`

Reemplazan `builds` + `build_ingredients` + `builds.ingredients_list`. El texto
serializado se normaliza.

```sql
create table public.option_groups (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  name        text not null,               -- "Proteína", "Verduras"
  max_choices int not null default 1 check (max_choices > 0),
  min_choices int not null default 0 check (min_choices >= 0),
  sort_order  int not null default 0,
  constraint  min_le_max check (min_choices <= max_choices)
);

create table public.option_items (
  id          bigint generated always as identity primary key,
  group_id    bigint not null references public.option_groups(id) on delete cascade,
  name        text not null,
  extra_price numeric(10,2) not null default 0 check (extra_price >= 0),
  is_active   boolean not null default true,
  sort_order  int not null default 0
);
```

**RLS del módulo menú** (las cinco tablas, mismo patrón):

| Política | Operación | Regla |
|----------|-----------|-------|
| `<t>_select_auth` | select | `auth.uid() is not null` — todo empleado lee el menú |
| `<t>_write_admin` | all | `public.is_admin()` |

## 6. Módulo 3 — Órdenes

Aquí está el segundo cambio estructural: **el ticket existe**.

### `orders` — el ticket

```sql
create table public.orders (
  id            bigint generated always as identity primary key,
  folio         int generated always as identity,   -- número visible al cliente
  created_by    bigint not null references public.users(id) on delete restrict,
  status        public.order_status not null default 'pendiente',
  service       public.service_type not null default 'llevar',
  table_number  int,                                 -- antes `coustumer`
  customer_name text,
  notes         text,
  total         numeric(10,2) not null default 0,
  delivered_by  bigint references public.users(id) on delete set null,
  payment       public.payment_method,
  delivered_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on public.orders (created_at desc);
create index on public.orders (status) where status <> 'entregado';
```

> `total` es **denormalizado a propósito**: se recalcula al guardar las líneas y
> se congela. Los precios del menú cambian; el histórico no debe cambiar con
> ellos.

### `order_items` — las líneas

```sql
create table public.order_items (
  id           bigint generated always as identity primary key,
  order_id     bigint not null references public.orders(id) on delete cascade,
  product_id   bigint not null references public.products(id) on delete restrict,
  product_name text not null,        -- snapshot: el producto puede renombrarse
  size         public.product_size not null default 'unico',
  quantity     int not null default 1 check (quantity > 0),
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  extra_charge numeric(10,2) not null default 0,   -- "Costo Extra" manual
  line_total   numeric(10,2) not null,
  notes        text,
  details      jsonb not null default '{}'::jsonb, -- snapshot para imprimir
  created_at   timestamptz not null default now()
);
create index on public.order_items (order_id);
```

> **Cantidad real.** En el sistema viejo pedir 3 licuados creaba 3 filas
> (§7.5 de SISTEMA-0.1). Aquí es una línea con `quantity = 3`.

### Selecciones normalizadas

Lo que en el sistema viejo era texto dentro de `details` (§7.4). Se guardan
**además** del snapshot, para poder reportar.

```sql
create table public.order_item_removed_ingredients (
  order_item_id bigint not null references public.order_items(id) on delete cascade,
  ingredient_id bigint not null references public.ingredients(id) on delete restrict,
  name          text not null,
  primary key (order_item_id, ingredient_id)
);

create table public.order_item_extras (
  order_item_id bigint not null references public.order_items(id) on delete cascade,
  extra_id      bigint not null references public.extras(id) on delete restrict,
  name          text not null,
  price         numeric(10,2) not null,
  primary key (order_item_id, extra_id)
);

create table public.order_item_options (
  order_item_id bigint not null references public.order_items(id) on delete cascade,
  option_id     bigint not null references public.option_items(id) on delete restrict,
  group_name    text not null,
  name          text not null,
  extra_price   numeric(10,2) not null default 0,
  primary key (order_item_id, option_id)
);
```

Con esto sí se puede responder "cuántas veces se pidió queso extra este mes",
cosa imposible en el 0.1.

### Creación atómica

Una orden se crea con **una** función, no con un POST por producto:

```sql
create or replace function public.create_order(payload jsonb)
returns bigint
language plpgsql security definer set search_path = public
as $$ /* inserta orders + order_items + selecciones, calcula totales */ $$;
```

Se detalla al construir el módulo. Requisito: **todo o nada**, y los precios se
leen de `product_prices` **en el servidor**, nunca del cliente.

**RLS:**

| Política | Operación | Regla |
|----------|-----------|-------|
| `orders_select_own` | select | `created_by = public.current_user_id()` |
| `orders_select_staff` | select | rol `admin` o `cocina` ven todas |
| `orders_insert_staff` | insert | `auth.uid() is not null` |
| `orders_update_status` | update | `cocina` y `admin` siempre; `user` solo su propia orden |

### Realtime

`orders` y `order_items` se publican para Supabase Realtime. La pantalla de
cocina se suscribe en vez de hacer polling, y toca la campana (§7.6 de
SISTEMA-0.1) al llegar un `INSERT`.

## 7. Módulo 4 — Finanzas

`expense` y `financial_expense` se fusionan en **una** tabla.

```sql
create table public.expense_categories (
  id        bigint generated always as identity primary key,
  name      text not null unique,
  is_active boolean not null default true
);

create table public.expenses (
  id          bigint generated always as identity primary key,
  user_id     bigint not null references public.users(id) on delete restrict,
  category_id bigint not null references public.expense_categories(id) on delete restrict,
  amount      numeric(10,2) not null check (amount > 0),
  reason      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.revenues (
  id         bigint generated always as identity primary key,
  user_id    bigint not null references public.users(id) on delete restrict,
  amount     numeric(10,2) not null check (amount > 0),
  reason     text,
  created_at timestamptz not null default now()
);

create table public.cash_movements (
  id         bigint generated always as identity primary key,
  user_id    bigint not null references public.users(id) on delete restrict,
  direction  public.cash_direction not null,
  amount     numeric(10,2) not null check (amount > 0),
  reason     text not null,
  created_at timestamptz not null default now()
);
```

> `cash_box` tenía `amount` con signo y sin usuario. Ahora el signo es explícito
> (`direction`) y todo movimiento tiene responsable.

**RLS:** lectura para `admin`; escritura para `admin`. El mesero solo registra
gastos si el negocio lo permite — decisión pendiente (§9).

## 8. Módulo 5 — Reportes

Sin tablas nuevas. Vistas y funciones sobre lo anterior:

- `daily_sales` — ventas del día por producto y por categoría.
- `daily_summary` — el corte: ventas, gastos, ingresos, saldo en caja.
  Equivale a `GET /financials/today`.

Se definen al construir el módulo. Se implementan como **vistas** con
`security_invoker = true` para que respeten la RLS de las tablas base.

## 9. Decisiones pendientes

1. **¿El mesero registra gastos?** En el 0.1 el endpoint no validaba rol.
2. **¿El folio se reinicia cada día?** Hoy es una secuencia continua. Si debe
   reiniciarse, requiere una tabla de turnos.
3. **¿Existe el concepto de "turno" / corte de caja formal?** Hoy el corte es
   "lo que pasó hoy", calculado al vuelo. Un turno explícito resolvería también
   la expiración de sesión (§4 de SISTEMA-0.1).
4. **Formas de pago reales** del negocio, para cerrar el enum `payment_method`.
5. **`sizes` por producto y no por categoría:** ¿hay productos que rompan la
   regla de su categoría?

## 10. Orden de las migraciones

| Archivo | Contenido |
|---------|-----------|
| `0001_base.sql` | Enums, `set_updated_at()`, helpers de RLS, `users` |
| `0002_menu.sql` | `categories`, `products`, `product_prices`, `ingredients`, `extras`, `option_groups`, `option_items` + semilla de categorías |
| `0003_orders.sql` | `orders`, `order_items`, tablas de selección, `create_order()`, Realtime |
| `0004_finances.sql` | `expense_categories`, `expenses`, `revenues`, `cash_movements` |
| `0005_reports.sql` | Vistas de reporte |

Cada migración incluye, en el mismo archivo: tablas + índices +
`enable row level security` + políticas + triggers. Nunca se aplica una
migración que deje una tabla sin RLS.
