# Credenciales de acceso (desarrollo)

> ⚠️ **Solo desarrollo.** Usuarios de prueba con contraseña débil. No usar en
> producción: allí van contraseñas fuertes y "Leaked password protection"
> activo en Supabase Auth.

El login es **por email**.

| Rol | Email | Contraseña | Ve en el dashboard |
|-----|-------|------------|--------------------|
| Administrador | `admin@rugato.com` | `1234` | Todo: panel, gastos, empleados, menú, órdenes, reportes, configuración |
| Cocina | `cocina@rugato.com` | `1234` | Panel, órdenes |
| Usuario (mesero) | `usuario@rugato.com` | `1234` | Panel, órdenes |

## Notas

- Sembrados directo en Supabase (`auth.users` + `auth.identities` +
  `public.users`) con hash bcrypt, porque `1234` (4 caracteres) no pasa el
  mínimo de 6 de la API de registro.
- El rol sale de `public.users.type` y define la navegación y el color de acento.
- Auth activo: `DEV_BYPASS_AUTH = false` en `lib/devConfig.ts`. Para volver a
  saltarse el login en desarrollo, poner `true`.

## Proyecto Supabase

- Proyecto: **rugato** (`zbofxivfdngnrcflmfzw`), región `us-east-1`.
- URL y llaves: `rugato/.env.local` (no commitear).
