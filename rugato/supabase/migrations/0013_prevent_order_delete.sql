-- Las órdenes son registro contable: no se eliminan (se cancelan).
create or replace function public.block_order_delete()
returns trigger language plpgsql set search_path = public
as $$
begin
  raise exception 'Las órdenes no se pueden eliminar; usa cancelar.';
end;
$$;

create trigger no_delete_orders
  before delete on public.orders
  for each row execute function public.block_order_delete();
