-- Ajustes globales del negocio (fila única). Ver módulo de Configuración.
create table public.app_settings (
  id               int primary key default 1 check (id = 1),
  business_name    text,
  business_address text,
  business_phone   text,
  payments         text[] not null default array['efectivo','tarjeta','transferencia'],
  bell_enabled     boolean not null default true,
  updated_at       timestamptz not null default now()
);
insert into public.app_settings (id, business_name) values (1, 'Jugos y Licuados Rugato');

create trigger set_updated_at before update on public.app_settings
  for each row execute function public.set_updated_at();

alter table public.app_settings enable row level security;
create policy settings_select_auth on public.app_settings for select using (auth.uid() is not null);
create policy settings_update_admin on public.app_settings for update using (public.is_admin()) with check (public.is_admin());
