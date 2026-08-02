-- Reporte agregado en un rango [p_start, p_end). Ventas = órdenes entregadas.
-- SECURITY INVOKER: respeta RLS; además exige admin explícitamente.
-- Ver docs/modulos/07-reportes.md
create or replace function public.get_report(p_start timestamptz, p_end timestamptz)
returns jsonb
language plpgsql stable security invoker set search_path = public
as $$
declare result jsonb;
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  with sales as (
    select o.id, o.total, o.delivered_at
    from orders o
    where o.status = 'entregado' and o.delivered_at >= p_start and o.delivered_at < p_end
  ),
  items as (
    select oi.product_name, oi.quantity, oi.line_total, c.name as cat_name, c.color as cat_color
    from order_items oi
    join sales s on s.id = oi.order_id
    join products p on p.id = oi.product_id
    join categories c on c.id = p.category_id
  ),
  exp as (
    select e.amount, e.created_at, ec.name as cat_name
    from expenses e join expense_categories ec on ec.id = e.category_id
    where e.created_at >= p_start and e.created_at < p_end
  ),
  ventas_dia as (
    select (delivered_at at time zone 'America/Mexico_City')::date as dia,
           sum(total) as ventas, count(*) as ordenes
    from sales group by 1
  ),
  gastos_dia as (
    select (created_at at time zone 'America/Mexico_City')::date as dia, sum(amount) as gastos
    from exp group by 1
  )
  select jsonb_build_object(
    'totals', jsonb_build_object(
      'ventas',  coalesce((select sum(total) from sales), 0),
      'ordenes', (select count(*) from sales),
      'ticket_promedio', case when (select count(*) from sales) > 0
        then round(coalesce((select sum(total) from sales),0) / (select count(*) from sales), 2) else 0 end,
      'gastos',  coalesce((select sum(amount) from exp), 0),
      'balance', coalesce((select sum(total) from sales),0) - coalesce((select sum(amount) from exp),0)
    ),
    'by_day', coalesce((
      select jsonb_agg(row_to_json(t) order by t.dia) from (
        select coalesce(v.dia, g.dia) as dia, coalesce(v.ventas,0) as ventas,
               coalesce(v.ordenes,0) as ordenes, coalesce(g.gastos,0) as gastos
        from ventas_dia v full join gastos_dia g on g.dia = v.dia
      ) t), '[]'::jsonb),
    'top_products', coalesce((
      select jsonb_agg(row_to_json(t)) from (
        select product_name as name, sum(quantity) as qty, sum(line_total) as revenue
        from items group by product_name order by revenue desc limit 10
      ) t), '[]'::jsonb),
    'sales_by_category', coalesce((
      select jsonb_agg(row_to_json(t)) from (
        select cat_name as name, cat_color as color, sum(quantity) as qty, sum(line_total) as revenue
        from items group by cat_name, cat_color order by revenue desc
      ) t), '[]'::jsonb),
    'expenses_by_category', coalesce((
      select jsonb_agg(row_to_json(t)) from (
        select cat_name as name, sum(amount) as amount from exp group by cat_name order by amount desc
      ) t), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

grant execute on function public.get_report(timestamptz, timestamptz) to authenticated;
