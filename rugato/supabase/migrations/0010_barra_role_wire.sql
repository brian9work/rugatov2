-- La estación Barra la atiende el rol 'barra'; barra es staff.
update public.stations set role_hint = 'barra' where name = 'Barra';

create or replace function public.is_staff()
returns boolean language sql stable set search_path = public
as $$ select public.current_user_role() in ('admin','cocina','barra') $$;
