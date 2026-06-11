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
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
        carrito: resolve(__dirname, "src/pages/client/carrito/carrito.html"),
        pedidos: resolve(__dirname, "src/pages/client/pedidos/pedidos.html"),
        productDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        adminDashboard: resolve(__dirname, "src/pages/admin/dashboard/dashboard.html"),
        adminCategorias: resolve(__dirname, "src/pages/admin/categorias/categorias.html"),
        adminProductos: resolve(__dirname, "src/pages/admin/productos/productos.html"),
        adminPedidos: resolve(__dirname, "src/pages/admin/pedidos/pedidos.html"),
      },
    },
  },
  base: "/",
});
