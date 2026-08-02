# Sistema 0.1 — cómo funcionaba

> Documento de **referencia histórica**. Describe el sistema anterior tal como
> está en `0.1/`, no lo que se va a construir. Sirve para no perder reglas de
> negocio al reescribir. Cada sección marca qué se conserva y qué se descarta.

## 1. Contexto

**Rugato** = punto de venta de "Jugos y Licuados Rugato". Los meseros levantan
órdenes, cocina las prepara, el administrador gestiona menú, empleados, gastos
y reportes.

El código vive en `0.1/` en dos carpetas que son **dos ramas del mismo repo**:

| Carpeta                    | Qué contiene                                      | Cuál usar como referencia |
|----------------------------|---------------------------------------------------|---------------------------|
| `rugato-main`              | Frontend completo (~8000 líneas), BD, backend viejo | **Frontend** y **BD**     |
| `rugato-feature-BackEnd`   | Backend completo (auth, financials), frontend recortado | **Backend**          |

Al buscar algo: el frontend real está en `rugato-main/frontend/rugato-web-ui/`,
el backend real está en `rugato-feature-BackEnd/backend/rugato/`.

## 2. Stack anterior

| Capa       | Tecnología                                          |
|------------|-----------------------------------------------------|
| Backend    | Spring Boot (Java), Gradle, puerto `8082`           |
| BD         | MySQL 8 en AWS RDS (`us-east-2`)                    |
| Frontend   | Next.js **Pages Router**, TypeScript                |
| UI         | Chakra UI v2 + `react-icons` + Formik               |
| Deploy     | Docker (`service/DockerFile` + `rugato.jar`)        |
| API pública| `https://badai.xihmai.com`                          |

Nada de este stack se conserva. La v2 es Next.js 16 App Router + Supabase.

## 3. Roles y control de acceso

`user.type` es un **string numérico**:

| `type` | Rol      | Rutas                                        |
|--------|----------|----------------------------------------------|
| `"1"`  | admin    | `/admin`, `/admin/{expenses,employees,menu,history,reports,settings}` |
| `"2"`  | user (mesero) | `/user`, `/user/menu`, `/user/orders`   |
| `"3"`  | kitchen (cocina) | `/kitchen`, `/kitchen/orders`        |

Cada rol tiene su componente envoltorio (`components/slider/{Admin,User,Kitchen}.tsx`)
que arma el menú lateral y aplica el guard.

Cada rol tiene además un **color propio** que tiñe el sidebar y los botones:

- admin → verde `#25f575`
- cocina → amarillo `#c58d00`
- mesero → azul `#3b82f6`

> **Se conserva:** los tres roles, sus colores y qué puede ver cada uno.
> **Se descarta:** el `type` numérico → pasa a enum `admin | cocina | user`.

## 4. Autenticación (y por qué se rehace)

`POST /auth/login` con `{username, password}`. En `AuthService`:

1. Busca el usuario por `user`.
2. Compara la contraseña con `equals()` — **en texto plano**.
3. Verifica `is_active != 0`.
4. Devuelve `{id, username, name, type}`. **No hay token.**

El frontend guarda `idUser`, `name`, `type`, `username` y `date` en
`localStorage` (`context/Context.tsx`). El guard de cada rol es un `useEffect`
que compara `type` y verifica que `date` sea hoy (`isToday`); si no, redirige a
`/login`.

> **Problemas graves, ninguno se replica:**
> - Contraseñas en texto plano en la BD.
> - Credenciales de RDS commiteadas en `application.properties`.
> - Sin token ni sesión de servidor: editar `localStorage.type = "1"` da acceso
>   de administrador.
> - `@CrossOrigin(origins = "*")` en cada endpoint, sin autenticación.
>
> **Se conserva:** la idea de "la sesión expira al terminar el día" (`isToday`).
> Es útil en un negocio por turnos y vale la pena replicarla explícitamente.

## 5. Modelo de datos (16 tablas MySQL)

Definiciones en `0.1/rugato-main/database/`:
`full_structure.sql` (todo) y `structure/rugato_*.sql` (una por tabla).

### Usuarios y catálogos

- **`user`** — `name`, `lastname`, `phone`, `user` (único), `password`,
  `acronym` (3 letras, iniciales del empleado), `type`, `is_active` (bigint).
- **`cat_status`** — estatus de órdenes.
- **`cat_category`** — categorías del menú.
- **`cat_ingredients`** — catálogo global de ingredientes.
- **`cat_expense`** — categorías de gasto.
- **`cat_customer`** — catálogo de clientes (**nunca se usó** en la app).

### Menú

- **`menu`** — producto. Tiene **cuatro precios**: `price` (precio único) y
  `price_ch` / `price_med` / `price_gde` (chico / mediano / grande). Cuáles
  aplican depende de la categoría (ver §7). Todos son `varchar`.
- **`ingredients`** — ingredientes **de un producto** (`menu_id`), los que el
  cliente puede quitar ("sin cebolla").
- **`extras`** — extras de pago de un producto (`menu_id`, `name`, `price`).
- **`builds`** — grupos de opciones para productos armables (baguettes,
  ensaladas al gusto). `name` = nombre del grupo, `ingredients_list` = lista
  serializada en texto, `maximo` = cuántas opciones puede elegir el cliente.
- **`build_ingredients`** — tabla puente `build_id` × `ingredient_id`. Tabla
  `MyISAM` sin llaves foráneas.

### Órdenes

- **`orders`** — **una fila por producto**, no por ticket. Campos:
  `user_id` (quien la levantó), `menu_id`, `status_id`, `total`,
  `notes` (texto libre del cliente), `details` (JSON serializado con
  ingredientes quitados / extras / builds), `service` ("Para llevar" / etc.),
  `user` (varchar: **quién la entregó**, distinto de `user_id`),
  `payment` (forma de pago, se captura al entregar),
  `coustumer` (typo de *customer*: en la práctica guarda el **número de mesa**).

### Finanzas

- **`expense`** — gastos con `user_id`, `category_id`, `quantity`, `reason`.
- **`financial_expense`** — segunda tabla de gastos, casi idéntica, creada en la
  rama `feature-BackEnd`. **Duplicación**; en la v2 queda una sola.
- **`revenues`** — ingresos manuales.
- **`cash_box`** — movimientos de caja: `amount`, `reason`, `transaction_date`.

### Deuda técnica del esquema

| Problema | Detalle |
|----------|---------|
| Tipos flojos | Precios y cantidades en `varchar`; `cat_category.created_at` y `cat_customer.created_at` en `varchar` |
| JSON en texto | `orders.details` y `builds.ingredients_list` son `longtext` con contenido estructurado |
| Sin normalizar | `orders` no tiene ticket padre; no se puede agrupar una comanda |
| Motores mezclados | `build_ingredients` es MyISAM (sin FKs), el resto InnoDB |
| Tablas duplicadas | `expense` vs `financial_expense` |
| Tablas muertas | `cat_customer` nunca se consultó |
| Typos | `coustumer` |
| Charsets mezclados | `utf8mb3` y `utf8mb4` conviviendo |

Todo esto se corrige en [MODELO-DATOS.md](MODELO-DATOS.md).

## 6. API REST del backend

Base: `https://badai.xihmai.com`. Rutas en `service/service.tsx` del frontend.

### `/auth`
| Método | Ruta | Qué hace |
|--------|------|----------|
| POST | `/auth/login` | Login por usuario + contraseña |

### `/user`
| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/user/get/all?active=` | `1`=activos (default), `0`=inactivos, `2`=todos |
| GET | `/user/get/type/{type}` | Por rol |
| GET | `/user/get/{id}` | Por id |
| POST | `/user/add` | Alta |
| PUT | `/user/update/{id}` | Edición |
| PUT | `/user/desactivate/{id}` · `/user/activate/{id}` | Baja lógica |
| DELETE | `/user/delete/{id}` | Baja física |

### `/menu`
| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/menu/get/all` | Menú completo con ingredientes, extras y builds |
| GET | `/menu/get/active` | Solo `is_active = 1`, completo |
| GET | `/menu/get/menu` · `/menu/get/menu/active` | Solo productos, sin anidados |
| GET | `/menu/get/category?category=` | Filtrado por categoría (+ variante `/active`) |
| GET | `/menu/get/{id}` | Un producto completo |
| POST | `/menu/add/{menu,ingredients,extras,builds}` | Alta por pieza |
| PUT | `/menu/update/{menu,build,ingredients,extras}/{id}` | Edición por pieza |
| PUT | `/menu/deactivate/{menu,extra,ingredient}/{id}` | Baja lógica |
| DELETE | `/menu/delete/{menu,build,extra,ingredient}/{id}` | Baja física |

> El producto se guarda **en cuatro llamadas separadas** (producto, luego
> ingredientes, luego extras, luego builds). Sin transacción: si una falla, el
> producto queda a medias. En la v2 esto es **una sola operación atómica**.

### `/orders`
| Método | Ruta | Qué hace |
|--------|------|----------|
| POST | `/orders/add` | Crea la orden forzando `status_id = 1` |
| GET | `/orders/today` | Órdenes de hoy con estatus 1–4 |
| GET | `/orders/today/user/{userId}` | Las de hoy de un mesero |
| GET | `/orders/allOrders` | Igual que `/today` (endpoint redundante) |
| GET | `/orders/history?startDate=&endDate=` | Histórico paginado |
| GET | `/orders/report?startDate=&endDate=&page=&size=` | Reporte de ventas |
| PUT | `/orders/status/in-preparation/{id}` | → estatus 2 |
| PUT | `/orders/status/canceled/{id}` | → estatus 3 |
| PUT | `/orders/status/completed/{id}` | → estatus 4 |
| PUT | `/orders/status/delivered/{id}` | → estatus 5, body `{user, payment}` |
| PUT | `/orders/status/revert/{id}` | → estatus 1 |

### `/financials`
| Método | Ruta | Qué hace |
|--------|------|----------|
| POST | `/financials/expense` · `/revenue` · `/cashbox` | Registrar movimiento |
| GET | `/financials/cashbox` | Efectivo en caja |
| GET | `/financials/today` | Corte del día (ingresos + gastos) |
| GET | `/financials/history/{cashbox,expenses,revenues}?startDate=&endDate=` | Histórico paginado |

## 7. Reglas de negocio a conservar

Estas son las reglas que hay que **no perder**. Están dispersas en el frontend,
no en la BD.

### 7.1 Estatus de orden

| id | Nombre | Color |
|----|--------|-------|
| 1 | Pendiente | `#fbbf24` amarillo |
| 2 | En preparación | `#3b82f6` azul |
| 3 | Cancelado | `#fb2424` rojo |
| 4 | Completado | `#25f575` verde |
| 5 | Entregado | `#25f575` verde |

Flujo: toda orden nace en **1**. Cocina la pasa a **2** y luego a **4**. El
mesero la marca **5** y en ese momento captura **quién entrega** y **forma de
pago**. Desde cualquier punto se puede **cancelar (3)** o **revertir a 1**.

Las vistas del día muestran estatus **1–4**; el 5 sale de la lista activa.

> En la v2 el estatus es un enum de texto: `pendiente | preparando | listo |
> entregado | cancelado`. "Completado" pasa a llamarse **listo**.

### 7.2 Categorías del menú

Están **hardcodeadas en el frontend** (`components/data/CategoriesData.ts`),
duplicando la tabla `cat_category`, cada una con su color:

| id | Categoría | Color |
|----|-----------|-------|
| 1 | Licuados combinados | `#4CAF50` |
| 2 | Licuados sencillos | `#FF9800` |
| 3 | Esquimos | `#03A9F4` |
| 4 | Bebidas calientes | `#795548` |
| 5 | Bocadillos | `#9C27B0` |
| 6 | Cocteles | `#F44336` |
| 7 | Jugos sencillos | `#009688` |
| 8 | Jugos combinados | `#CDDC39` |
| 9 | Baguette especial | `#607D8B` |
| 10 | Ensaladas | `#E91E63` |
| 11 | Ensaladas al gusto | `#3F51B5` |
| 12 | Aguas sencillas | `#00BCD4` |
| 13 | Aguas combinadas | `#8BC34A` |
| 14 | Sandwiches especiales | `#FF5722` |
| 15 | Al gusto | `#111111` |

> En la v2 las categorías viven **solo en la BD**, con su color como columna.

### 7.3 Cómo se arma un producto (regla crítica)

En `components/global/menu/SelectedProduct.tsx` el formulario **cambia según la
categoría**, con los ids hardcodeados:

| Categorías | Comportamiento |
|------------|----------------|
| 1, 2, 3, 7, 8, 12, 13 | **Tres tamaños**: usa `price_ch` / `price_med` / `price_gde` |
| 4 | **Precio único**: usa `price` |
| 9, 11 | **Producto armable**: muestra los grupos `builds`, cada uno con un máximo de opciones |
| 15 | **Al gusto**: captura totalmente libre |
| cualquiera | Si el producto tiene `ingredients`, se pueden **quitar** ("Sin: cebolla, jitomate") |
| cualquiera | Si el producto tiene `extras`, se pueden **agregar** con costo ("Con: queso $10") |

Además, siempre: **notas** libres, **cantidad**, **costo extra** manual,
**mesa** y **tipo de servicio** ("Para llevar" / "Para comer aquí").

> **Este acoplamiento categoría→formulario es la deuda más importante.** Agregar
> una categoría nueva obliga a editar código. En la v2 el comportamiento se
> declara **en la categoría misma**, como datos (ver [MODELO-DATOS.md](MODELO-DATOS.md)).

### 7.4 Cómo se guarda el detalle

`orders.details` es un JSON serializado con esta forma:

```json
{
  "ingredients": "Sin: cebolla, jitomate",
  "extras": "Con: queso $10, aguacate $15",
  "build": "{\"Proteína\":[...],\"Verduras\":[...]}"
}
```

Los ingredientes y extras se guardan **como texto ya formateado**, no como ids.
Consecuencia: no se puede reportar "cuántas veces se pidió queso extra". En la
v2 el detalle es `jsonb` con ids.

### 7.5 Carrito

El carrito vive **solo en memoria de React**. Al confirmar, se hace **un POST
por producto** dentro de un `forEach` (`Cart.tsx`). Si uno falla, los demás ya
se guardaron. Además, elegir cantidad = 3 crea **tres filas separadas**, no una
con cantidad.

> En la v2: un solo envío atómico, ticket con líneas y cantidad real.

### 7.6 Cocina

La pantalla de órdenes de cocina hace **polling** y toca una **campana
sintetizada con Web Audio API** (dos osciladores, 830 Hz + 1245 Hz, 1.2 s)
cuando entra una orden nueva.

> **Se conserva la campana.** En la v2 se cambia polling por **Supabase
> Realtime**.

### 7.7 Panel de administrador

Cuatro indicadores del día: ventas totales, gastos totales, órdenes pendientes,
efectivo en caja. Más accesos rápidos a cada módulo.

## 8. Resumen de qué se hereda

**Se conserva:** los tres roles y sus colores · los cinco estatus y su flujo ·
las 15 categorías · las reglas de armado por categoría (pero como datos) ·
extras, ingredientes quitables y builds · gastos, ingresos y caja · el corte del
día · la campana de cocina · la expiración de sesión por día.

**Se descarta:** Spring Boot · MySQL · Chakra UI · Pages Router · el `type`
numérico · contraseñas en texto plano · el guard en `localStorage` · una fila de
orden por producto · el JSON en texto plano · las categorías hardcodeadas ·
`cat_customer` · `financial_expense` · el guardado en cuatro llamadas.

**No se migran datos.** La v2 arranca con la base vacía.
