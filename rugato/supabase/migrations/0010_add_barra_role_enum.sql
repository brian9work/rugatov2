-- Barra es su propio rol (separado de Cocina). El valor del enum se agrega
-- en su propia migración: Postgres no permite usarlo en la misma transacción.
alter type public.user_role add value if not exists 'barra';
