-- Los gastos también llevan método de pago (de dónde salió el dinero).
alter table public.expenses add column payment public.payment_method not null default 'efectivo';

-- get_report gana 'expenses_by_payment' (gastos agrupados por método de pago).
-- La CTE 'exp' ahora también selecciona e.payment. El resto igual que en 0013.
-- Fuente de verdad: la BD (aplicado vía MCP). Fragmento agregado:
--
--   'expenses_by_payment', coalesce((select jsonb_agg(row_to_json(t)) from (
--      select coalesce(payment::text,'sin_registrar') as method,
--             sum(amount) as amount, count(*) as ordenes
--      from exp group by payment order by sum(amount) desc) t), '[]'::jsonb)
