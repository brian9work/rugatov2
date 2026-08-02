# Arquitectura — Rugato v2

> Migración del sistema viejo (Spring Boot + MySQL + Next.js Pages Router)
> a **Next.js 16 App Router + Supabase**. Documento vivo, dirigido por el arquitecto.

## 0. Mapa de documentos

| Documento | Para qué |
|-----------|----------|
| **ARQUITECTURA.md** (este) | Decisiones transversales, stack, convenciones |
| [SISTEMA-0.1.md](SISTEMA-0.1.md) | Cómo funcionaba el sistema viejo: backend, frontend, reglas de negocio |
| [MODELO-DATOS.md](MODELO-DATOS.md) | Esquema objetivo en Supabase, SQL y RLS |
| [DISENO.md](DISENO.md) | Sistema de diseño: interfaz tipo iPhone, tema oscuro |
| [modulos/00-INDICE.md](modulos/00-INDICE.md) | Orden de construcción y plantilla por módulo |

## 1. Principios

- **Empezar desde 0.** No se migran datos ni usuarios viejos. El esquema se
  construye **módulo por módulo**: solo se crean tablas/columnas que el módulo
  en curso necesita.
- **Supabase nativo.** Postgres + Auth + RLS. Sin backend Java.
- **Híbrido seguro:**
  - Lecturas / operaciones del propio usuario → cliente Supabase + **RLS**.
  - Operaciones privilegiadas (crear usuarios, acciones admin) → **route
    handlers** de Next con `service_role` (nunca expuesto al browser).
- **Sesión por cookies** vía `@supabase/ssr`. Protección de rutas en el
  servidor con `middleware.ts`.
- **Idioma:** dominio y UI en español; identificadores de código en inglés
  donde ya está establecido (`users`, `type`, `is_active`).

## 2. Stack

| Capa        | Tecnología                                  |
|-------------|---------------------------------------------|
| Framework   | Next.js 16 (App Router, RSC)                |
| Lenguaje    | TypeScript                                  |
| Estilos     | Tailwind v4                                  |
| Iconos      | lucide-react                                 |
| Backend     | Supabase (Postgres, Auth, RLS, Storage)     |
| Auth/sesión | `@supabase/ssr` (cookies) + middleware      |

## 3. Estructura de carpetas (objetivo)

```
rugato/
├─ app/
│  ├─ layout.tsx                # Root layout + providers
│  ├─ page.tsx                  # Login (público)
│  ├─ (app)/                    # Shell protegido
│  │  ├─ layout.tsx             # Tab bar / riel + --color-accent del rol
│  │  └─ <pestaña>/page.tsx     # Una carpeta por pestaña
│  └─ api/                      # Route handlers (service_role)
│     └─ <recurso>/route.ts
├─ components/
│  ├─ ui/                       # Primitivas iOS: List, Cell, Sheet, Button…
│  └─ <dominio>/                # Componentes de negocio
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts              # Cliente browser (componentes 'use client')
│  │  ├─ server.ts              # Cliente server (RSC / route handlers, cookies)
│  │  └─ admin.ts               # Cliente service_role (solo en api/, nunca client)
│  ├─ roles.ts                  # Enum de roles + estatus + helpers de estilo
│  └─ UserContext.tsx           # Estado de usuario en cliente
├─ middleware.ts                # Refresh de sesión + guard de /dashboard
├─ supabase/
│  └─ migrations/               # SQL versionado (creado por módulo)
└─ docs/ARQUITECTURA.md
```

> Nota: hoy existe `lib/supabase.ts` (cliente único). Se reemplaza por
> `lib/supabase/{client,server,admin}.ts` al implementar el módulo de login.

## 4. Convenciones

- **Tres clientes Supabase, un propósito cada uno:**
  - `client.ts` → componentes cliente. Anon key. Sujeto a RLS.
  - `server.ts` → RSC y route handlers que actúan **como el usuario**. Lee
    cookies. Sujeto a RLS.
  - `admin.ts` → solo dentro de `app/api/**`. `service_role`. **Bypassa RLS.**
    Jamás importar desde un componente cliente.
- **RLS siempre activo** en toda tabla de `public`. Sin políticas abiertas.
- **Enlace auth ↔ dominio:** `public.users.auth_id uuid` → `auth.users.id`.
  Las políticas RLS mapean con `auth.uid()`. El `id bigint` de la app se usa
  para FKs entre tablas del dominio.
- **Migraciones** numeradas e incrementales: `000N_<modulo>.sql`. Cada módulo
  agrega su(s) tabla(s); no se reescriben las anteriores.
- **Tipos** generados desde el esquema cuando se estabilice
  (`supabase gen types typescript`).

## 5. Modelo de datos — enfoque incremental

El dominio viejo tenía 16 tablas. **No** se crean todas de golpe. Cada módulo
introduce solo lo suyo. Mapa de referencia (viejo → se aborda en módulo):

| Dominio viejo (MySQL)              | Módulo destino        |
|------------------------------------|-----------------------|
| `user`                             | **1. Login** + Empleados |
| `menu`, `cat_category`             | Menú                  |
| `ingredients`, `cat_ingredients`   | Menú                  |
| `extras`, `builds`, `build_ingredients` | Menú             |
| `orders`, `cat_status`, `cat_customer` | Órdenes           |
| `expense`, `cat_expense`, `financial_expense` | Gastos     |
| `cash_box`, `revenues`             | Reportes / Caja       |

Cambios de modelo vs viejo:
- `user.user`+`password`+`acronym` → **fuera**. Auth lo maneja Supabase. Login
  por **email**.
- `type` numérico (`1`=admin,`2`=user,`3`=cocina) → **enum texto**
  `admin | cocina | user`.
- `is_active bigint` → `boolean`.

## 6. Roadmap de módulos

Orden, estado y plantilla de trabajo: [modulos/00-INDICE.md](modulos/00-INDICE.md).

Resumen: **1** Login → **2** Empleados → **3** Menú → **4** Órdenes →
**5** Cocina → **6** Gastos y caja → **7** Reportes → **8** Configuración.

Cada módulo: migración SQL → RLS → tipos → route handlers (si aplica) → UI →
prueba.

## 7. Módulo 1 — Inicio de sesión (spec)

### 7.1 Tabla `public.users`

```
id          bigint  identity      PK        -- id de dominio (FKs futuras)
auth_id     uuid    unique        FK → auth.users(id) ON DELETE CASCADE
email       text    unique not null
name        text
lastname    text
phone       text
type        user_role  not null  default 'user'   -- enum
is_active   boolean    not null  default true
created_at  timestamptz not null default now()
last_updated timestamptz not null default now()   -- trigger on update
```
`user_role` = enum `('admin','cocina','user')`.

### 7.2 RLS (tabla `users`)

- `select_own`: un usuario lee su propia fila (`auth_id = auth.uid()`).
- `select_admin`: un admin lee todas.
- `write_admin`: solo admin inserta/actualiza (los inserts reales van por
  route handler con service_role → bypass).
- Sin política → denegado por defecto.

### 7.3 Auth y sesión

- `@supabase/ssr`: `client.ts`, `server.ts`, `middleware.ts`.
- `middleware.ts`: refresca sesión en cada request y **protege `/dashboard/**`**
  (sin sesión → redirige a `/`). Login (`/`) con sesión → redirige a
  `/dashboard`.
- Login: `signInWithPassword(email, password)` → valida `is_active` → redirige
  a `/dashboard`.
- `UserContext`: carga la fila de `users` por `auth_id` (no por email).
- Logout: `signOut()` → `/`.

### 7.4 Archivos

| Acción   | Archivo                                   |
|----------|-------------------------------------------|
| nuevo    | `supabase/migrations/0001_auth_users.sql` |
| nuevo    | `lib/supabase/client.ts`                  |
| nuevo    | `lib/supabase/server.ts`                  |
| nuevo    | `lib/supabase/admin.ts`                   |
| nuevo    | `middleware.ts`                           |
| editar   | `lib/supabase.ts` → eliminar / re-exportar |
| editar   | `lib/UserContext.tsx` (cargar por `auth_id`) |
| editar   | `app/page.tsx` (cliente nuevo)            |
| editar   | `app/dashboard/layout.tsx` (guard server) |
| nuevo    | dep: `@supabase/ssr`                      |

### 7.5 Acceso inicial (seed)

Admin sembrado por **email**, definido al implementar. Flujo:
1. Crear usuario en Supabase Auth (panel o route handler) con email + clave.
2. Insertar fila en `public.users` con `auth_id`, `type='admin'`,
   `is_active=true`.
Se entregará script SQL/instrucción al construir el módulo.

## 8. Decisiones tomadas

| Tema | Decisión |
|------|----------|
| Documentación | Por tema **y** por módulo: docs generales + `docs/modulos/` |
| Esquema | **Rediseñar y corregir**, no portar el MySQL 1:1. Detalle en [MODELO-DATOS.md](MODELO-DATOS.md) |
| Interfaz | Tipo iPhone: **tab bar inferior** + navegación en profundidad + sheets |
| Tema | **Oscuro**, con la paleta del 0.1 (`#111827` + verde/amarillo/azul) |
| Dispositivos | Celular, tablet y PC. Mobile-first; en pantallas grandes la tab bar pasa a riel lateral |
| Nombre de tabla | Se mantiene `users` (no `profiles`) |
| Estatus | Enum de texto; "completado" pasa a llamarse **listo** |

## 9. Decisiones pendientes

- Email del admin inicial y entorno donde se aplica la migración (proyecto
  Supabase destino).
- Generación de tipos TS automatizada (script en `package.json`).
- Las cinco pendientes de negocio en [MODELO-DATOS.md §9](MODELO-DATOS.md#9-decisiones-pendientes):
  gastos por mesero, reinicio de folio, turnos, formas de pago, tamaños por
  producto.
