-- Corregir el método de pago de una orden ya cobrada (si se equivocaron), auditado.
create or replace function public.set_order_payment(p_order bigint, p_payment public.payment_method, p_user bigint, p_user_name text)
returns void language plpgsql security definer set search_path = public
as $$
declare v_old public.payment_method;
begin
  select payment into v_old from orders where id = p_order;
  if not found then raise exception 'Orden % no existe', p_order; end if;
  update orders set payment = p_payment where id = p_order;
  perform public.log_order(p_order, p_user, p_user_name, 'pago', jsonb_build_object('de', v_old, 'a', p_payment));
end;
$$;

revoke all on function public.set_order_payment(bigint, public.payment_method, bigint, text) from public, anon, authenticated;
grant execute on function public.set_order_payment(bigint, public.payment_method, bigint, text) to service_role;
