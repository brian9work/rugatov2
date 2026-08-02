-- Limpieza: se eliminan las 16 tablas del port 1:1 del MySQL viejo.
-- Estaban vacías (0 filas) y las reemplaza el esquema rediseñado. Ver docs/MODELO-DATOS.md.
drop table if exists
  public.build_ingredients, public.builds, public.extras, public.ingredients,
  public.menu, public.orders, public.revenues, public.expense,
  public.financial_expense, public.cash_box, public.cat_category, public.cat_status,
  public.cat_customer, public.cat_expense, public.cat_ingredients, public.users
cascade;
