import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
        carrito: resolve(__dirname, "src/pages/client/carrito/carrito.html"),
        pedidos: resolve(__dirname, "src/pages/client/pedidos/pedidos.html"),
      },
    },
  },
  // "/" hace que `/css/...`, `/assets/...` en `public/` y rutas absolutas funcionen bien en `npm run dev`.
  base: "/",
});
