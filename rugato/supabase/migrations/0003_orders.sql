-- ══════════════════════════════════════════════════════
-- Módulo 4 — Órdenes. Ticket + líneas, con enrutamiento por estación
-- y estado por línea. Ver docs/modulos/04-ordenes.md
-- ══════════════════════════════════════════════════════

-- ── stations: a dónde se enruta cada producto (cocina, barra, …) ──
create table public.stations (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  role_hint  public.user_role,
  sort_order int not null default 0,
  is_active  boolean not null default true
);
insert into public.stations (name, role_hint, sort_order) values
  ('Cocina', 'cocina', 1),
  ('Barra',  'user',   2);

-- Enrutamiento configurable: override en producto, si no en categoría.
alter table public.categories add column station_id bigint references public.stations(id) on delete set null;
alter table public.products   add column station_id bigint references public.stations(id) on delete set null;

create or replace function public.resolve_station(p_product_id bigint)
returns bigint language sql stable set search_path = public
as $$
  select coalesce(
    (select station_id from products where id = p_product_id),
    (select c.station_id from products p join categories c on c.id = p.category_id where p.id = p_product_id),
    1  -- default: Cocina
  );
$$;

-- ── orders / order_items ───────────────────────────────
create table public.orders (
  id            bigint generated always as identity primary key,
  folio         int generated always as identity,
  created_by    bigint references public.users(id) on delete restrict, -- nullable en dev
  status        public.order_status not null default 'pendiente',
  service       public.service_type not null default 'llevar',
  table_number  int,
  customer_name text,
  notes         text,
  total         numeric(10,2) not null default 0,
  delivered_by  bigint references public.users(id) on delete set null,
  payment       public.payment_method,
  delivered_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index orders_created_idx on public.orders (created_at desc);
create index orders_status_idx  on public.orders (status) where status <> 'entregado';
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id           bigint generated always as identity primary key,
  order_id     bigint not null references public.orders(id) on delete cascade,
  product_id   bigint not null references public.products(id) on delete restrict,
  product_name text not null,
  size         public.product_size not null default 'unico',
  quantity     int not null default 1 check (quantity > 0),
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  extra_charge numeric(10,2) not null default 0,
  line_total   numeric(10,2) not null,
  station_id   bigint references public.stations(id) on delete set null,
  station_name text,
  status       public.order_status not null default 'pendiente',
  notes        text,
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index order_items_order_idx   on public.order_items (order_id);
create index order_items_station_idx on public.order_items (station_id, status);

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

-- ── Estado del ticket derivado de las líneas ───────────
create or replace function public.recompute_order_status(p_order_id bigint)
returns void language plpgsql set search_path = public
as $$
declare v_status public.order_status;
begin
  select case
    when count(*) filter (where status <> 'cancelado') = 0 then 'cancelado'::public.order_status
    else (
      select status from order_items
      where order_id = p_order_id and status <> 'cancelado'
      order by array_position(array['pendiente','preparando','listo','entregado']::public.order_status[], status)
      limit 1)
  end into v_status
  from order_items where order_id = p_order_id;
  update orders set status = coalesce(v_status, status) where id = p_order_id;
end;
$$;

create or replace function public.trg_recompute_order_status()
returns trigger language plpgsql set search_path = public as $$
begin
  perform public.recompute_order_status(coalesce(new.order_id, old.order_id));
  return null;
end;
$$;
create trigger order_items_status_sync
  after insert or update of status or delete on public.order_items
  for each row execute function public.trg_recompute_order_status();

-- ── create_order: atómica, precios y estación en el servidor ──
create or replace function public.create_order(payload jsonb)
returns bigint language plpgsql security definer set search_path = public
as $$
declare
  v_order_id bigint; v_item jsonb; v_item_id bigint; v_product products%rowtype;
  v_size public.product_size; v_qty int; v_unit numeric(10,2);
  v_extra_charge numeric(10,2); v_addons numeric(10,2); v_line numeric(10,2);
  v_station bigint; v_details jsonb;
begin
  insert into orders (created_by, service, table_number, customer_name, notes, status, total)
  values (
    coalesce((payload->>'created_by')::bigint, public.current_user_id()),
    coalesce((payload->>'service')::public.service_type, 'llevar'),
    (payload->>'table_number')::int, payload->>'customer_name', payload->>'notes',
    'pendiente', 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(coalesce(payload->'items','[]'::jsonb))
  loop
    select * into v_product from products where id = (v_item->>'product_id')::bigint;
    if not found then raise exception 'Producto % no existe', v_item->>'product_id'; end if;

    v_size := coalesce((v_item->>'size')::public.product_size, 'unico');
    v_qty  := coalesce((v_item->>'quantity')::int, 1);
    v_extra_charge := coalesce((v_item->>'extra_charge')::numeric, 0);

    select price into v_unit from product_prices where product_id = v_product.id and size = v_size;
    if v_unit is null then raise exception 'Sin precio para % tamaño %', v_product.name, v_size; end if;

    v_addons := 0;
    select coalesce(sum(price),0) into v_addons from extras
      where id in (select (e)::bigint from jsonb_array_elements_text(coalesce(v_item->'extras','[]'::jsonb)) e);
    v_addons := v_addons + coalesce((select sum(extra_price) from option_items
      where id in (select (o)::bigint from jsonb_array_elements_text(coalesce(v_item->'options','[]'::jsonb)) o)), 0);

    v_line := v_qty * (v_unit + v_addons) + v_extra_charge;
    v_station := public.resolve_station(v_product.id);

    v_details := jsonb_build_object(
      'removed', coalesce((select jsonb_agg(name) from ingredients
        where id in (select (r)::bigint from jsonb_array_elements_text(coalesce(v_item->'removed_ingredients','[]'::jsonb)) r)), '[]'::jsonb),
      'extras', coalesce((select jsonb_agg(jsonb_build_object('name',name,'price',price)) from extras
        where id in (select (e)::bigint from jsonb_array_elements_text(coalesce(v_item->'extras','[]'::jsonb)) e)), '[]'::jsonb),
      'options', coalesce((select jsonb_agg(jsonb_build_object('name',name,'extra_price',extra_price)) from option_items
        where id in (select (o)::bigint from jsonb_array_elements_text(coalesce(v_item->'options','[]'::jsonb)) o)), '[]'::jsonb));

    insert into order_items (order_id, product_id, product_name, size, quantity, unit_price,
      extra_charge, line_total, station_id, station_name, status, notes, details)
    values (v_order_id, v_product.id, v_product.name, v_size, v_qty, v_unit,
      v_extra_charge, v_line, v_station, (select name from stations where id = v_station),
      'pendiente', v_item->>'notes', v_details)
    returning id into v_item_id;

    insert into order_item_removed_ingredients (order_item_id, ingredient_id, name)
    select v_item_id, i.id, i.name from ingredients i
      where i.id in (select (r)::bigint from jsonb_array_elements_text(coalesce(v_item->'removed_ingredients','[]'::jsonb)) r);
    insert into order_item_extras (order_item_id, extra_id, name, price)
    select v_item_id, e.id, e.name, e.price from extras e
      where e.id in (select (x)::bigint from jsonb_array_elements_text(coalesce(v_item->'extras','[]'::jsonb)) x);
    insert into order_item_options (order_item_id, option_id, group_name, name, extra_price)
    select v_item_id, oi.id, g.name, oi.name, oi.extra_price
      from option_items oi join option_groups g on g.id = oi.group_id
      where oi.id in (select (o)::bigint from jsonb_array_elements_text(coalesce(v_item->'options','[]'::jsonb)) o);
  end loop;

  update orders set total = coalesce((select sum(line_total) from order_items where order_id = v_order_id),0)
    where id = v_order_id;
  return v_order_id;
end;
$$;

create or replace function public.set_item_status(p_item_id bigint, p_status public.order_status)
returns void language sql security definer set search_path = public
as $$ update order_items set status = p_status where id = p_item_id; $$;

create or replace function public.deliver_order(p_order_id bigint, p_delivered_by bigint, p_payment public.payment_method)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update order_items set status = 'entregado' where order_id = p_order_id and status <> 'cancelado';
  update orders set delivered_by = p_delivered_by, payment = p_payment, delivered_at = now() where id = p_order_id;
end;
$$;

revoke all on function public.create_order(jsonb) from public, anon, authenticated;
revoke all on function public.set_item_status(bigint, public.order_status) from public, anon, authenticated;
revoke all on function public.deliver_order(bigint, bigint, public.payment_method) from public, anon, authenticated;

-- ── RLS ────────────────────────────────────────────────
create or replace function public.is_staff()
returns boolean language sql stable set search_path = public
as $$ select public.current_user_role() in ('admin','cocina') $$;

alter table public.stations    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_removed_ingredients enable row level security;
alter table public.order_item_extras  enable row level security;
alter table public.order_item_options enable row level security;

create policy stations_select_auth on public.stations for select using (auth.uid() is not null);
create policy stations_write_admin on public.stations for all using (public.is_admin()) with check (public.is_admin());

create policy orders_select_staff on public.orders for select using (public.is_staff());
create policy orders_select_own   on public.orders for select using (created_by = public.current_user_id());
create policy orders_insert_auth  on public.orders for insert with check (auth.uid() is not null);
create policy orders_update_staff on public.orders for update using (public.is_staff()) with check (public.is_staff());
create policy orders_update_own   on public.orders for update using (created_by = public.current_user_id()) with check (created_by = public.current_user_id());

create policy oi_select on public.order_items for select using (
  public.is_staff() or exists (select 1 from orders o where o.id = order_id and o.created_by = public.current_user_id()));
create policy oi_insert on public.order_items for insert with check (auth.uid() is not null);
create policy oi_update on public.order_items for update using (public.is_staff()) with check (public.is_staff());

do $$
declare t text;
begin
  foreach t in array array['order_item_removed_ingredients','order_item_extras','order_item_options']
  loop
    execute format($f$create policy %I_select on public.%I for select using (
      exists (select 1 from order_items oi where oi.id = order_item_id and (
        public.is_staff() or exists (select 1 from orders o where o.id = oi.order_id and o.created_by = public.current_user_id()))))$f$, t, t);
    execute format($f$create policy %I_write on public.%I for all using (auth.uid() is not null) with check (auth.uid() is not null)$f$, t, t);
  end loop;
end $$;

-- ── Realtime ───────────────────────────────────────────
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
