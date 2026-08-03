-- ══════════════════════════════════════════════════════
-- Edición de órdenes + registro (auditoría) + snapshots de nombres.
-- Ver docs/modulos/04-ordenes.md
-- ══════════════════════════════════════════════════════

-- Snapshots de nombres (quién tomó / quién cobró) — evita depender de RLS de users.
alter table public.orders add column created_by_name  text;
alter table public.orders add column delivered_by_name text;

-- Registro de cambios de la orden.
create table public.order_audit (
  id         bigint generated always as identity primary key,
  order_id   bigint not null references public.orders(id) on delete cascade,
  user_id    bigint references public.users(id) on delete set null,
  user_name  text,
  action     text not null,   -- crear|agregar|quitar|cantidad|datos|entregar|cancelar
  detail     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index order_audit_order_idx on public.order_audit (order_id, created_at);

alter table public.order_audit enable row level security;
create policy oaudit_select on public.order_audit for select using (
  public.is_staff() or exists (select 1 from orders o where o.id = order_id and o.created_by = public.current_user_id())
);

create or replace function public.log_order(p_order bigint, p_user bigint, p_name text, p_action text, p_detail jsonb)
returns void language sql security definer set search_path = public
as $$ insert into order_audit(order_id,user_id,user_name,action,detail) values (p_order,p_user,p_name,p_action,coalesce(p_detail,'{}'::jsonb)); $$;

-- Guard: la orden debe estar abierta (no entregada/cancelada).
create or replace function public.assert_open(p_order bigint)
returns void language plpgsql set search_path = public as $$
declare s public.order_status;
begin
  select status into s from orders where id = p_order;
  if s is null then raise exception 'Orden % no existe', p_order; end if;
  if s in ('entregado','cancelado') then raise exception 'La orden ya está cerrada'; end if;
end; $$;

create or replace function public.recompute_total(p_order bigint)
returns void language sql security definer set search_path = public
as $$ update orders set total = coalesce((select sum(line_total) from order_items where order_id=p_order),0) where id=p_order; $$;

-- create_order y deliver_order se actualizan para guardar el nombre y auditar.
-- (Cuerpo completo aplicado por MCP; ver 0003_orders.sql para la versión base.)

-- Editar: agregar línea, quitar línea, cambiar cantidad, editar datos.
-- Todas: security definer, guard assert_open, recalculan total y auditan.
-- add_order_item(p_order_id, p_item jsonb, p_user, p_user_name) returns bigint
-- remove_order_item(p_item_id, p_user, p_user_name)
-- update_order_item_qty(p_item_id, p_qty, p_user, p_user_name)
-- update_order_data(p_order_id, p_service, p_table, p_customer, p_notes, p_user, p_user_name)

revoke all on function public.add_order_item(bigint,jsonb,bigint,text) from public, anon, authenticated;
revoke all on function public.remove_order_item(bigint,bigint,text) from public, anon, authenticated;
revoke all on function public.update_order_item_qty(bigint,int,bigint,text) from public, anon, authenticated;
revoke all on function public.update_order_data(bigint,public.service_type,int,text,text,bigint,text) from public, anon, authenticated;
grant execute on function public.add_order_item(bigint,jsonb,bigint,text) to service_role;
grant execute on function public.remove_order_item(bigint,bigint,text) to service_role;
grant execute on function public.update_order_item_qty(bigint,int,bigint,text) to service_role;
grant execute on function public.update_order_data(bigint,public.service_type,int,text,text,bigint,text) to service_role;

-- Nota: los cuerpos completos de create_order/deliver_order/add_order_item/etc.
-- se aplicaron vía MCP en la migración 0007_order_edit_audit. Este archivo
-- documenta el esquema; la fuente de verdad es la BD.
