# Diseño — Rugato v2

> Sistema de diseño de la v2: **interfaz tipo iPhone, tema oscuro, con los
> colores de marca que ya existían.** Documento normativo: si un componente
> nuevo no cabe aquí, primero se agrega aquí y luego se construye.

## 1. Decisiones fijadas

| Decisión | Valor |
|----------|-------|
| Lenguaje visual | iOS (Human Interface Guidelines), adaptado a web |
| Navegación | **Tab bar inferior**, con navegación en profundidad |
| Tema | **Oscuro únicamente**, con la paleta del sistema 0.1 |
| Dispositivos | **Celular, tablet y PC** — mismo diseño, tres densidades |
| Base de diseño | 390 × 844 (iPhone), se expande hacia arriba |
| Técnica | Tailwind v4 (`@theme`), `lucide-react`, sin librería de UI |

No se usa Chakra UI ni ninguna librería de componentes. Los componentes se
construyen a mano sobre Tailwind, porque el objetivo es una estética específica
que las librerías genéricas no dan.

## 2. Color

### 2.1 Paleta base — heredada, no se cambia

```
--color-bg          #111827   fondo de la app
--color-surface     #1f2937   tarjetas, celdas, barras
--color-surface-2   #374151   elevación superior, encabezados
--color-border      #4b5563   separadores
--color-text        #ffffff   texto principal
```

### 2.2 Acentos — heredados

```
--color-green   #25f575   admin · éxito · listo · dinero a favor
--color-yellow  #c58d00   cocina · advertencia · pendiente
--color-blue    #3b82f6   mesero · acción · en preparación
--color-red     #fb2424   destructivo · cancelado
```

### 2.3 Jerarquía de texto (regla iOS)

iOS no usa grises arbitrarios: usa el texto blanco con opacidad decreciente.
**Cuatro niveles, ninguno más.**

```
--color-text-primary     rgba(255,255,255,1.00)   títulos, valores
--color-text-secondary   rgba(255,255,255,0.60)   subtítulos, descripciones
--color-text-tertiary    rgba(255,255,255,0.35)   placeholders, deshabilitado
--color-text-quaternary  rgba(255,255,255,0.20)   chevrons, decoración
```

### 2.4 Semántica

| Uso | Color |
|-----|-------|
| Rol admin | `green` |
| Rol cocina | `yellow` |
| Rol mesero | `blue` |
| Estatus pendiente | `yellow` |
| Estatus preparando | `blue` |
| Estatus listo | `green` |
| Estatus entregado | `green` |
| Estatus cancelado | `red` |
| Acción destructiva | `red` |

Ya está codificado en [`lib/roles.ts`](../lib/roles.ts). **Esa es la única
fuente de verdad de color semántico.** Ningún componente escribe un hex a mano.

### 2.5 Regla del color de acento

El acento de la app **es el color del rol** de quien inició sesión. El mismo
botón "Guardar" es verde para el admin, amarillo en cocina y azul para el
mesero. Se resuelve con una variable CSS puesta en el layout del dashboard:

```
--color-accent: <color del rol>
```

Todo componente usa `var(--color-accent)`, nunca el hex del rol.

## 3. Tipografía

Pila de fuentes del sistema — en un iPhone renderiza SF Pro real:

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
             'Segoe UI', Roboto, sans-serif;
```

Escala (nombres de iOS, valores en rem):

| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| Large Title | 34 / 2.125rem | 700 | Título de pantalla al inicio del scroll |
| Title 1 | 28 / 1.75rem | 700 | Cifras grandes del panel |
| Title 3 | 20 / 1.25rem | 600 | Encabezado de sección |
| Headline | 17 / 1.0625rem | 600 | Título de celda |
| Body | 17 / 1.0625rem | 400 | Texto general |
| Subhead | 15 / 0.9375rem | 400 | Subtítulo de celda |
| Footnote | 13 / 0.8125rem | 400 | Metadatos, timestamps |
| Caption | 12 / 0.75rem | 400 | Etiquetas de tab bar, badges |

**17px es el cuerpo**, no 16. Es lo que hace que se sienta iOS y no web.

Números siempre con `font-variant-numeric: tabular-nums` para que las columnas
de precios no bailen.

## 4. Forma y elevación

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 8px | badges, chips |
| `--radius-md` | 12px | botones, campos |
| `--radius-lg` | 16px | tarjetas, grupos de lista |
| `--radius-xl` | 20px | bottom sheets, modales |
| `--radius-full` | 9999px | avatares, pills, segmented |

Reglas:

- **Nada con esquinas rectas.** El radio mínimo es 8px.
- **Sin sombras.** En tema oscuro iOS separa por **color de superficie**, no por
  sombra. Sombra solo en elementos flotantes reales (sheet, tab bar).
- **Bordes de 1px** con `--color-border`, y solo cuando la diferencia de
  superficie no basta.
- Separadores de lista con **inset izquierdo** alineado al texto, no de borde a
  borde. Detalle pequeño, muy iOS.

Espaciado en múltiplos de 4. Márgenes laterales de pantalla: **16px** en
celular, **24px** en tablet y PC.

## 5. Navegación

### 5.1 Estructura

```
Tab bar (raíz)
 └─ Pantalla raíz de la pestaña
     └─ Detalle (push, con "‹ Atrás" arriba a la izquierda)
         └─ Sheet (modal, se arrastra hacia abajo para cerrar)
```

**Regla:** la tab bar nunca desaparece al navegar en profundidad, salvo dentro
de un sheet a pantalla completa.

### 5.2 Tab bar

- Fija abajo, fondo `--color-surface` con `backdrop-blur`.
- Borde superior de 1px, `--color-border`.
- **Ícono + etiqueta** (Caption). Nunca solo ícono.
- Pestaña activa en `--color-accent`; inactivas en `--color-text-tertiary`.
- Alto 49px + `env(safe-area-inset-bottom)`.
- **Máximo 5 pestañas.** Si el rol necesita más, la quinta es **"Más"**.

Pestañas por rol:

| Rol | Pestañas |
|-----|----------|
| Mesero | Inicio · Menú · Órdenes |
| Cocina | Órdenes · Historial |
| Admin | Inicio · Órdenes · Menú · Reportes · Más |

"Más" del admin abre una lista agrupada estilo Ajustes: Gastos, Empleados,
Caja, Configuración, Cerrar sesión.

### 5.3 Barra superior

- Fondo transparente que se vuelve `--color-surface` con blur **al hacer scroll**.
- Izquierda: "‹ Atrás" con el título de la pantalla anterior, o nada en la raíz.
- Centro: título en Headline, **visible solo al hacer scroll**.
- Derecha: máximo una acción, en `--color-accent`.
- Debajo, el **título grande** (Large Title) que se encoge al hacer scroll y se
  funde con el título del centro. Es la firma visual de iOS.

### 5.4 Adaptación a tablet y PC

La tab bar es de celular. En pantallas grandes **las mismas pestañas se mueven a
un riel lateral izquierdo** — exactamente lo que hace iPadOS. No se inventa una
navegación distinta; es la misma, reubicada.

| Ancho | Navegación | Contenido |
|-------|------------|-----------|
| `< 768px` (celular) | Tab bar abajo | Una columna, ancho completo |
| `768–1023px` (tablet) | Riel lateral, solo íconos (80px) | Una o dos columnas |
| `≥ 1024px` (PC) | Riel lateral con etiquetas (240px) | Dos columnas donde aplique |

**Regla de ancho de lectura:** ninguna columna de contenido pasa de **720px**.
En PC no se estira la lista a 1920px; se centra o se usa la segunda columna.

Dónde sí se usan dos columnas (`≥ 768px`):

| Pantalla | Izquierda | Derecha |
|----------|-----------|---------|
| Menú / armar orden | Productos por categoría | Carrito, siempre visible |
| Órdenes | Lista de órdenes | Detalle de la seleccionada |
| Reportes | Filtros y periodo | Gráficas y tablas |

En celular esa segunda columna se convierte en un **sheet**.

## 6. Componentes

### 6.1 Lista agrupada (el componente base)

Es el componente más usado de iOS y aquí también. Un contenedor
`--color-surface` con `--radius-lg`, celdas de 44px mínimo separadas por líneas
con inset, y un encabezado de sección en mayúsculas pequeñas por encima del
grupo.

Anatomía de celda: `[ícono opcional] Título / Subtítulo … valor · chevron ›`

Se usa para: configuración, empleados, categorías, listas de órdenes, "Más".

### 6.2 Botones

| Variante | Aspecto | Uso |
|----------|---------|-----|
| Filled | Fondo `--color-accent`, texto oscuro, radio `md`, alto 50px | Acción principal, una por pantalla |
| Tinted | Fondo del acento al 15%, texto en acento | Acción secundaria |
| Plain | Solo texto en acento | Terciaria, barras de navegación |
| Destructive | Texto o fondo `red` | Cancelar orden, eliminar |

**Área táctil mínima 44 × 44px, sin excepción.** El personal opera esto de pie y
con prisa.

### 6.3 Sheet (reemplaza al modal)

Sube desde abajo, esquinas superiores `--radius-xl`, "agarradera" gris arriba,
fondo detrás oscurecido y ligeramente escalado. Se cierra arrastrando hacia
abajo o con "Cancelar" arriba a la izquierda.

Alturas: `medium` (~50%) para elegir algo, `large` (~92%) para formularios.

**Todo formulario del sistema es un sheet**, no un modal centrado. En PC el
sheet se muestra centrado con el mismo estilo.

### 6.4 Segmented control

Píldora de fondo `--color-surface-2` con el segmento activo en una superficie
más clara que se desliza al cambiar. Para filtros de 2–4 opciones: tamaño del
producto, tipo de servicio, rango de fechas.

### 6.5 Badge de estatus

Píldora `--radius-full`, Caption en semibold, fondo del color de estatus al 20%
y texto en el color pleno. Clases ya definidas en `lib/roles.ts`.

### 6.6 Campos de formulario

Dentro de una lista agrupada: etiqueta a la izquierda, campo a la derecha,
alineado a la derecha. Fondo `--color-surface`, sin borde, radio `md`, alto
44px. `inputMode` correcto (`numeric` para precios y cantidades) — sale el
teclado numérico en el celular.

### 6.7 Otros

- **Switch** iOS (píldora 51×31, verde encendido).
- **Stepper** `− valor +` para cantidades.
- **Pull to refresh** en las listas de órdenes.
- **Swipe en celda** para acciones rápidas de orden (marcar listo, cancelar).
- **Estado vacío**: ícono grande terciario, título, una línea de explicación y,
  si aplica, un botón. Nunca una tabla vacía.
- **Carga**: skeletons con las formas reales del contenido, no un spinner.

## 7. Movimiento

| Transición | Duración | Curva |
|------------|----------|-------|
| Push / pop de pantalla | 350ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Sheet arriba / abajo | 400ms | misma |
| Presión de botón | 100ms | `ease-out`, escala a 0.96 |
| Aparición de contenido | 200ms | `ease-out` |

Esa curva es la de iOS: arranca rápido y frena suave. No usar `ease-in-out`.

Todo dentro de `@media (prefers-reduced-motion: reduce)` se reduce a un
`opacity` de 100ms.

## 8. Accesibilidad y contexto de uso

Se usa **de pie, con prisa, a veces con las manos mojadas o con guantes**. Eso
manda sobre la estética:

1. Área táctil mínima 44px, ya dicho, sin excepción.
2. Contraste mínimo 4.5:1 para texto. **El amarillo `#c58d00` no pasa sobre
   `#1f2937` en texto pequeño** — solo para fondos de badge e íconos, nunca
   texto Footnote o menor.
3. El estatus **nunca se comunica solo con color**: siempre lleva su etiqueta.
4. Acciones destructivas piden confirmación con un action sheet.
5. Foco visible con anillo de 2px en `--color-accent`.
6. `env(safe-area-inset-*)` respetado arriba y abajo.
7. Objetivo: **la pantalla de cocina se lee a un metro de distancia.** Título de
   orden mínimo en Title 3.

## 9. Implementación

### 9.1 Tokens

Todo lo anterior vive en `app/globals.css` dentro de `@theme` de Tailwind v4.
Ningún componente escribe un hex, un radio o una duración a mano.

### 9.2 Ubicación de componentes

```
app/
├─ (auth)/           login, sin tab bar
├─ (app)/            shell con tab bar / riel
│  ├─ layout.tsx     tab bar + accent del rol
│  └─ <pestaña>/
components/
├─ ui/               primitivas: List, Cell, Sheet, Button, Badge, Segmented…
└─ <dominio>/        componentes de negocio
```

`components/ui/` es genérico y **no sabe nada de Rugato**. Si un componente de
`ui/` importa algo de dominio, está mal ubicado.

### 9.3 Íconos

`lucide-react` únicamente, tamaño 24 (20 en celdas), grosor 2. Sin mezclar
familias de íconos — el 0.1 usaba tres a la vez.

### 9.4 PWA

Se instala en la pantalla de inicio: manifest, íconos, `display: standalone`,
`theme-color: #111827`. Sin esto no se siente app.

## 10. Qué se elimina del 0.1

Sidebar colapsable con chevron · drawer con hamburguesa · modales centrados ·
tablas densas en celular · los tres sets de íconos mezclados · colores hex
escritos dentro de los componentes · `useBreakpointValue` de Chakra para
decidir layout (se resuelve con CSS).
