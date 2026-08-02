-- ══════════════════════════════════════════════════════
-- Módulo 6 — Gastos. expense_categories + expenses.
-- Ver docs/modulos/06-gastos.md
-- ══════════════════════════════════════════════════════

create table public.expense_categories (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  is_active  boolean not null default true,
  sort_order int not null default 0
);
insert into public.expense_categories (name, sort_order) values
  ('Insumos', 1), ('Servicios', 2), ('Nómina', 3), ('Renta', 4), ('Mantenimiento', 5), ('Otros', 6);

create table public.expenses (
  id          bigint generated always as identity primary key,
  user_id     bigint references public.users(id) on delete set null,
  category_id bigint not null references public.expense_categories(id) on delete restrict,
  amount      numeric(10,2) not null check (amount > 0),
  reason      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index expenses_created_idx on public.expenses (created_at desc);
create trigger set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

-- si no viene user_id, se toma el del usuario autenticado
create or replace function public.set_expense_user()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.user_id is null then new.user_id := public.current_user_id(); end if;
  return new;
end; $$;
create trigger set_expense_user before insert on public.expenses
  for each row execute function public.set_expense_user();

-- ── RLS: admin gestiona; categorías legibles por autenticados ──
alter table public.expense_categories enable row level security;
alter table public.expenses           enable row level security;

create policy expcat_select_auth on public.expense_categories for select using (auth.uid() is not null);
create policy expcat_write_admin on public.expense_categories for all using (public.is_admin()) with check (public.is_admin());

create policy expenses_select_admin on public.expenses for select using (public.is_admin());
create policy expenses_insert_admin on public.expenses for insert with check (public.is_admin());
create policy expenses_update_admin on public.expenses for update using (public.is_admin()) with check (public.is_admin());
create policy expenses_delete_admin on public.expenses for delete using (public.is_admin());
