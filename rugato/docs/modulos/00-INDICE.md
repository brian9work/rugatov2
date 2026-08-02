# Módulos — índice y método de trabajo

> Se construye **un módulo a la vez**. Un módulo no empieza hasta que el
> anterior está terminado y probado. Cada módulo tiene su documento en esta
> carpeta, escrito **antes** de programar.

## Estado

| # | Módulo | Doc | Migración | Estado |
|---|--------|-----|-----------|--------|
| 1 | Inicio de sesión | `01-login.md` | `0001_base.sql` ✅ aplicada | Login bypasseado en dev (`lib/devConfig.ts`); UI real pendiente |
| 2 | Empleados | `02-empleados.md` | — (usa `0001`) | Pendiente |
| 3 | Menú | `03-menu.md` | `0002_menu.sql` ✅ aplicada | **Implementado** (CRUD admin) |
| 4 | Órdenes | `04-ordenes.md` | `0003_orders.sql` ✅ aplicada | **Implementado**: alta de orden + tablero pendientes en `/dashboard/ordenes` (Realtime + campana) |
| 5 | Cocina | `05-cocina.md` | — (usa `0003`) | Parcial: estado por línea ya en el tablero; falta vista dedicada por estación |
| 6 | Gastos y caja | `06-gastos.md` | `0005_finances_expenses.sql` ✅ aplicada | **Gastos implementado** en `/dashboard/gastos` (admin); caja/ingresos pendientes |
| 7 | Reportes + Panel | `07-reportes.md` | `0006_report_function.sql` ✅ aplicada | **Implementado**: `/dashboard/reportes` + panel general en `/dashboard` |
| 8 | Configuración | `08-configuracion.md` | — | Pendiente |

El orden importa: Órdenes necesita Menú, que necesita Empleados, que necesita
Login. Reportes va al final porque lee de todo lo demás.

## Qué lleva el documento de cada módulo

Se escribe con esta plantilla, siempre completa antes de tocar código:

1. **Objetivo** — qué resuelve, en una frase.
2. **Qué hacía el 0.1** — referencia a [SISTEMA-0.1.md](../SISTEMA-0.1.md), con
   las reglas de negocio que se conservan y las que se descartan, y por qué.
3. **Modelo de datos** — SQL exacto de la migración: tablas, índices, RLS,
   triggers, semillas. Salido de [MODELO-DATOS.md](../MODELO-DATOS.md).
4. **Reglas de negocio** — validaciones y transiciones de estado, numeradas
   para poder referenciarlas después.
5. **Acceso a datos** — qué va por cliente Supabase con RLS y qué va por route
   handler con `service_role`, y la razón de cada uno.
6. **Pantallas** — una por una: navegación, componentes de
   [DISENO.md](../DISENO.md) que usa, estados vacío / carga / error.
7. **Archivos** — tabla de qué se crea y qué se modifica.
8. **Pruebas** — lista verificable, incluyendo **pruebas de RLS**: intentar
   leer y escribir como cada rol y confirmar que se deniega lo que debe.
9. **Pendientes** — lo que quedó por decidir.

## Definición de terminado

Un módulo está terminado cuando:

- [ ] La migración está aplicada y **toda tabla nueva tiene RLS activo con sus
      políticas**.
- [ ] Se probó con los tres roles: cada uno ve y hace **solo** lo suyo.
- [ ] Se probó el acceso denegado, no solo el permitido.
- [ ] Funciona en celular, tablet y PC según [DISENO.md](../DISENO.md).
- [ ] Los estados vacío, de carga y de error existen y se ven bien.
- [ ] No hay hex, radios ni duraciones escritos a mano en los componentes.
- [ ] Los tipos de TypeScript están regenerados desde el esquema.
- [ ] El documento del módulo refleja lo que realmente se construyó.

## Reglas que cruzan todos los módulos

1. **`service_role` jamás llega al navegador.** Solo dentro de
   `app/api/**`. Un `import` de `admin.ts` en un componente cliente es un bug de
   seguridad, no un detalle.
2. **Los precios y los totales se calculan en el servidor.** El cliente nunca
   manda un total.
3. **Toda tabla nace con RLS.** Sin política `using (true)`.
4. **Nada se borra si el histórico lo referencia.** Baja lógica con
   `is_active`.
5. **El color de acento sale del rol**, vía `--color-accent`.
6. **Un módulo no toca las migraciones de otro.** Si hace falta cambiar algo
   previo, es una migración nueva.
