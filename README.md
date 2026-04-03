# Food Store

Tienda front-end con **TypeScript**, **Vite**, autenticación en **localStorage**, roles (`client` / `admin`) y protección de rutas en el cliente.

## Requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado LTS)
- npm (viene con Node)

## Instalación

En la carpeta del proyecto:

```bash
npm install
```

## Cómo correrlo

### Desarrollo (recarga al guardar)

```bash
npm run dev
```

Abrí la URL que muestra la terminal (por defecto suele ser `http://localhost:5173`). El `index.html` redirige al login.

### Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` (no se sube a git; se puede borrar y volver a generar).

### Probar el build localmente

```bash
npm run preview
```

Sirve el contenido de `dist/` para verificar que el build funciona antes de desplegar.

## Cómo entrar como administrador

La app guarda usuarios en `localStorage` (clave `foodstore_users_v1`). **Solo si la lista de usuarios está vacía** se crea automáticamente un admin de prueba al cargar el login o el registro.

### Credenciales del admin por defecto

| Campo        | Valor                   |
|-------------|-------------------------|
| **Email**   | `admin@foodstore.local` |
| **Contraseña** | `admin123` (8 caracteres) |

### Pasos

1. Abrí la pantalla de **login** (la raíz del sitio te redirige ahí).
2. Ingresá el email y la contraseña de la tabla.
3. Al iniciar sesión con rol **admin**, te redirige al **panel admin**. Desde la tienda, si ya estás logueado como admin, también aparece el enlace **Panel Admin** en el menú.
4. En **Panel Admin → Productos** podés **editar precios** (número entero ≥ 0); se guardan en `localStorage` bajo la clave `foodstore_precios_v1`. La tienda del cliente usa esos valores al mostrar precios y al agregar al carrito.

### Si el admin “no existe” o no podés entrar

Eso pasa si **ya hay otros usuarios guardados**: el seed del admin **no se vuelve a ejecutar**. Podés:

- Abrir las herramientas de desarrollo del navegador → **Aplicación** (o **Almacenamiento**) → **Almacenamiento local** del sitio → borrar las entradas que empiecen con `foodstore_` (o al menos `foodstore_users_v1` y `foodstore_session_v1`), recargar y volver a intentar; con usuarios vacíos se recrea el admin, **o**
- Probar en una **ventana de incógnito** / otro navegador sin datos previos.

Los usuarios que se dan de alta por **Registro** tienen siempre rol **client**. El panel de administración solo es accesible con rol **admin** (por defecto, la cuenta de arriba).

## Scripts disponibles

| Comando          | Acción                                      |
|------------------|---------------------------------------------|
| `npm run dev`    | Servidor de desarrollo con Vite             |
| `npm run build`  | Chequeo TypeScript + build a `dist/`        |
| `npm run preview`| Vista previa del build en `dist/`           |

## Tienda (cliente)

- **Categorías:** en el inicio, “Todas” o una categoría filtran la grilla; la búsqueda filtra por nombre, descripción o categoría.
- **Carrito:** suma ítems desde la tienda; en **Carrito** podés cambiar cantidades, vaciar o **Confirmar pedido** (guarda el pedido en `localStorage` y te lleva a **Mis pedidos**).
- **Mis pedidos:** listado de pedidos confirmados (solo en este navegador).


## Nota de seguridad

La autenticación es solo en el navegador (`localStorage`). Sirve para aprendizaje y prototipos; **no** es seguridad real de producción (siempre hace falta validar en backend).
