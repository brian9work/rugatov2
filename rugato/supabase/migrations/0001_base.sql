-- ── Enums ──────────────────────────────────────────────
create type public.user_role      as enum ('admin', 'cocina', 'user');
create type public.order_status   as enum ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado');
create type public.service_type   as enum ('llevar', 'aqui');
create type public.payment_method as enum ('efectivo', 'tarjeta', 'transferencia');
create type public.product_size   as enum ('unico', 'chico', 'mediano', 'grande');
create type public.pricing_mode   as enum ('unico', 'tres_tamanos');
create type public.cash_direction as enum ('entrada', 'salida');

-- ── Trigger updated_at ─────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Tabla users ────────────────────────────────────────
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

create trigger set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ── Helpers de RLS (security definer para leer users sin recursión) ──
create or replace function public.current_user_id()
returns bigint
language sql stable security definer set search_path = public
as $$ select id from public.users where auth_id = auth.uid() $$;

create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select type from public.users where auth_id = auth.uid() and is_active $$;

create or replace function public.is_admin()
returns boolean
language sql stable set search_path = public
as $$ select public.current_user_role() = 'admin' $$;

-- ── RLS de users ───────────────────────────────────────
alter table public.users enable row level security;

create policy users_select_own on public.users
  for select using (auth_id = auth.uid());

create policy users_select_admin on public.users
  for select using (public.is_admin());

create policy users_update_admin on public.users
  for update using (public.is_admin()) with check (public.is_admin());
-- insert/delete van por route handler con service_role (crean auth.users también)
