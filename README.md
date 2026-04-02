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

## Cuenta de prueba (admin)

Si no hay usuarios guardados, se crea un administrador por defecto:

- **Email:** `admin@foodstore.local`
- **Contraseña:** `admin123`

Los nuevos registros obtienen rol **client**. El panel admin exige rol **admin**.

## Scripts disponibles

| Comando          | Acción                                      |
|------------------|---------------------------------------------|
| `npm run dev`    | Servidor de desarrollo con Vite             |
| `npm run build`  | Chequeo TypeScript + build a `dist/`        |
| `npm run preview`| Vista previa del build en `dist/`           |

## Imágenes de productos y estilos

- Las fotos del catálogo son **`burger.jpg` y `pizza.jpg`** en **`src/assets/productos/`** (copiá o reemplazá ahí tus JPG). Se importan en [`src/data/productos.ts`](src/data/productos.ts) con `?url`. Bebida y papas reutilizan esas dos fotos como placeholder hasta que agregues más archivos.
- Los CSS siguen en **`public/css/`** y se enlazan con rutas absolutas (`/css/...`), coherente con `base: "/"` en Vite.

## Nota de seguridad

La autenticación es solo en el navegador (`localStorage`). Sirve para aprendizaje y prototipos; **no** es seguridad real de producción (siempre hace falta validar en backend).
