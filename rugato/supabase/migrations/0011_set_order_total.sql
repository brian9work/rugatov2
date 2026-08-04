-- Corrección manual del total de una orden (incluso ya entregada), auditada.
create or replace function public.set_order_total(p_order bigint, p_total numeric, p_user bigint, p_user_name text)
returns void language plpgsql security definer set search_path = public
as $$
declare v_old numeric;
begin
  if p_total < 0 then raise exception 'Total inválido'; end if;
  select total into v_old from orders where id = p_order;
  if v_old is null then raise exception 'Orden % no existe', p_order; end if;
  update orders set total = p_total where id = p_order;
  perform public.log_order(p_order, p_user, p_user_name, 'precio', jsonb_build_object('de', v_old, 'a', p_total));
end;
$$;

revoke all on function public.set_order_total(bigint, numeric, bigint, text) from public, anon, authenticated;
grant execute on function public.set_order_total(bigint, numeric, bigint, text) to service_role;
