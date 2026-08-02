-- ── categories ─────────────────────────────────────────
create table public.categories (
  id           bigint generated always as identity primary key,
  name         text not null unique,
  short_name   text,
  color        text not null default '#607D8B',
  pricing_mode public.pricing_mode not null default 'unico',
  has_options  boolean not null default false,
  is_freeform  boolean not null default false,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

-- ── products ───────────────────────────────────────────
create table public.products (
  id          bigint generated always as identity primary key,
  category_id bigint not null references public.categories(id) on delete restrict,
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index products_category_active_idx on public.products (category_id) where is_active;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ── product_prices ─────────────────────────────────────
create table public.product_prices (
  id         bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  size       public.product_size not null,
  price      numeric(10,2) not null check (price >= 0),
  unique (product_id, size)
);

-- ── ingredients (quitables) ────────────────────────────
create table public.ingredients (
  id         bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  name       text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
create index ingredients_product_idx on public.ingredients (product_id);

-- ── extras (de pago) ───────────────────────────────────
create table public.extras (
  id         bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  name       text not null,
  price      numeric(10,2) not null default 0 check (price >= 0),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
create index extras_product_idx on public.extras (product_id);

-- ── option_groups / option_items (productos armables) ──
create table public.option_groups (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  name        text not null,
  max_choices int not null default 1 check (max_choices > 0),
  min_choices int not null default 0 check (min_choices >= 0),
  sort_order  int not null default 0,
  constraint min_le_max check (min_choices <= max_choices)
);
create index option_groups_product_idx on public.option_groups (product_id);

create table public.option_items (
  id          bigint generated always as identity primary key,
  group_id    bigint not null references public.option_groups(id) on delete cascade,
  name        text not null,
  extra_price numeric(10,2) not null default 0 check (extra_price >= 0),
  is_active   boolean not null default true,
  sort_order  int not null default 0
);
create index option_items_group_idx on public.option_items (group_id);

-- ── RLS: lectura para autenticados, escritura para admin ──
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_prices enable row level security;
alter table public.ingredients    enable row level security;
alter table public.extras         enable row level security;
alter table public.option_groups  enable row level security;
alter table public.option_items   enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'categories','products','product_prices','ingredients',
    'extras','option_groups','option_items'
  ]
  loop
    execute format(
      'create policy %I_select_auth on public.%I for select using (auth.uid() is not null)', t, t);
    execute format(
      'create policy %I_write_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ── Función atómica: crea/edita un producto completo ───
create or replace function public.save_product(payload jsonb)
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  v_product_id bigint := (payload->>'id')::bigint;
  v_group jsonb;
  v_group_id bigint;
begin
  if v_product_id is null then
    insert into products (category_id, name, description, is_active)
    values (
      (payload->>'category_id')::bigint, payload->>'name', payload->>'description',
      coalesce((payload->>'is_active')::boolean, true))
    returning id into v_product_id;
  else
    update products set
      category_id = (payload->>'category_id')::bigint,
      name = payload->>'name', description = payload->>'description',
      is_active = coalesce((payload->>'is_active')::boolean, is_active)
    where id = v_product_id;
    if not found then raise exception 'Producto % no existe', v_product_id; end if;
    delete from product_prices where product_id = v_product_id;
    delete from ingredients    where product_id = v_product_id;
    delete from extras         where product_id = v_product_id;
    delete from option_groups  where product_id = v_product_id; -- cascade a items
  end if;

  insert into product_prices (product_id, size, price)
  select v_product_id, (p->>'size')::public.product_size, (p->>'price')::numeric
  from jsonb_array_elements(coalesce(payload->'prices', '[]'::jsonb)) p;

  insert into ingredients (product_id, name)
  select v_product_id, i->>'name'
  from jsonb_array_elements(coalesce(payload->'ingredients', '[]'::jsonb)) i;

  insert into extras (product_id, name, price)
  select v_product_id, e->>'name', coalesce((e->>'price')::numeric, 0)
  from jsonb_array_elements(coalesce(payload->'extras', '[]'::jsonb)) e;

  for v_group in select * from jsonb_array_elements(coalesce(payload->'option_groups', '[]'::jsonb))
  loop
    insert into option_groups (product_id, name, min_choices, max_choices, sort_order)
    values (v_product_id, v_group->>'name',
      coalesce((v_group->>'min_choices')::int, 0),
      coalesce((v_group->>'max_choices')::int, 1),
      coalesce((v_group->>'sort_order')::int, 0))
    returning id into v_group_id;

    insert into option_items (group_id, name, extra_price, sort_order)
    select v_group_id, it->>'name',
      coalesce((it->>'extra_price')::numeric, 0), coalesce((it->>'sort_order')::int, 0)
    from jsonb_array_elements(coalesce(v_group->'items', '[]'::jsonb)) it;
  end loop;

  return v_product_id;
end;
$$;

revoke all on function public.save_product(jsonb) from public, anon, authenticated;

-- ── Semilla de categorías (equivale al 0.1) ────────────
insert into public.categories (name, short_name, color, pricing_mode, has_options, is_freeform, sort_order) values
  ('Licuados combinados',   'Lic. Com.',  '#4CAF50', 'tres_tamanos', false, false, 1),
  ('Licuados sencillos',    'Lic. Sen.',  '#FF9800', 'tres_tamanos', false, false, 2),
  ('Esquimos',              'Esq.',       '#03A9F4', 'tres_tamanos', false, false, 3),
  ('Bebidas calientes',     'Beb. Cal.',  '#795548', 'unico',        false, false, 4),
  ('Bocadillos',            'Boc.',       '#9C27B0', 'unico',        false, false, 5),
  ('Cocteles',              'Coct.',      '#F44336', 'unico',        false, false, 6),
  ('Jugos sencillos',       'Jug. Sen.',  '#009688', 'tres_tamanos', false, false, 7),
  ('Jugos combinados',      'Jug. Com.',  '#CDDC39', 'tres_tamanos', false, false, 8),
  ('Baguette especial',     'Bag. Esp.',  '#607D8B', 'unico',        true,  false, 9),
  ('Ensaladas',             'Ens.',       '#E91E63', 'unico',        false, false, 10),
  ('Ensaladas al gusto',    'Ens. Gusto', '#3F51B5', 'unico',        true,  false, 11),
  ('Aguas sencillas',       'Aguas Sen.', '#00BCD4', 'tres_tamanos', false, false, 12),
  ('Aguas combinadas',      'Aguas Com.', '#8BC34A', 'tres_tamanos', false, false, 13),
  ('Sandwiches especiales', 'Sand. Esp.', '#FF5722', 'unico',        false, false, 14),
  ('Al gusto',              'Al Gusto',   '#111111', 'unico',        false, true,  15);
