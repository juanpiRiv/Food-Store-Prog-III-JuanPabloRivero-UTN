/** Rutas absolutas desde la raíz del sitio (Vite emite bajo `src/pages/`). */
export const ROUTES = {
  login: "/src/pages/auth/login/login.html",
  registro: "/src/pages/auth/registro/registro.html",
  clientHome: "/src/pages/client/home/home.html",
  carrito: "/src/pages/client/carrito/carrito.html",
  pedidos: "/src/pages/client/pedidos/pedidos.html",
  adminHome: "/src/pages/admin/home/home.html",
} as const;

export function navigate(route: string): void {
  window.location.href = route;
}
