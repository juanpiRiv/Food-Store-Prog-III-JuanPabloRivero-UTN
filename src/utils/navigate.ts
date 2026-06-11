export const ROUTES = {
  login: "/src/pages/auth/login/login.html",
  registro: "/src/pages/auth/registro/registro.html",
  clientHome: "/src/pages/client/home/home.html",
  carrito: "/src/pages/client/carrito/carrito.html",
  pedidos: "/src/pages/client/pedidos/pedidos.html",
  productDetail: "/src/pages/store/productDetail/productDetail.html",
  adminHome: "/src/pages/admin/dashboard/dashboard.html",
  adminDashboard: "/src/pages/admin/dashboard/dashboard.html",
  adminCategorias: "/src/pages/admin/categorias/categorias.html",
  adminProductos: "/src/pages/admin/productos/productos.html",
  adminPedidos: "/src/pages/admin/pedidos/pedidos.html",
} as const;

export function navigate(route: string): void {
  window.location.href = route;
}
