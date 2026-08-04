-- Las líneas de orden guardan snapshot (name/price/group_name), así que no
-- necesitan bloquear el borrado del catálogo. Se pasa de RESTRICT a SET NULL
-- para que editar un producto (save_product borra+reinserta sus hijos) no falle
-- cuando un extra/ingrediente/opción ya fue usado por una orden histórica.

-- ── order_item_extras ──
alter table public.order_item_extras drop constraint order_item_extras_pkey;
alter table public.order_item_extras add column id bigint generated always as identity primary key;
alter table public.order_item_extras alter column extra_id drop not null;
alter table public.order_item_extras drop constraint order_item_extras_extra_id_fkey;
alter table public.order_item_extras
  add constraint order_item_extras_extra_id_fkey
  foreign key (extra_id) references public.extras(id) on delete set null;

-- ── order_item_options ──
alter table public.order_item_options drop constraint order_item_options_pkey;
alter table public.order_item_options add column id bigint generated always as identity primary key;
alter table public.order_item_options alter column option_id drop not null;
alter table public.order_item_options drop constraint order_item_options_option_id_fkey;
alter table public.order_item_options
  add constraint order_item_options_option_id_fkey
  foreign key (option_id) references public.option_items(id) on delete set null;

-- ── order_item_removed_ingredients ──
alter table public.order_item_removed_ingredients drop constraint order_item_removed_ingredients_pkey;
alter table public.order_item_removed_ingredients add column id bigint generated always as identity primary key;
alter table public.order_item_removed_ingredients alter column ingredient_id drop not null;
alter table public.order_item_removed_ingredients drop constraint order_item_removed_ingredients_ingredient_id_fkey;
alter table public.order_item_removed_ingredients
  add constraint order_item_removed_ingredients_ingredient_id_fkey
  foreign key (ingredient_id) references public.ingredients(id) on delete set null;
