import { ROUTES } from "../../../utils/navigate.js";
import { checkAuthUser, getSession, logout } from "../../../utils/auth.js";
import { getCategorias } from "../../../utils/categoriaStorage.js";
import { getProductos } from "../../../utils/productoStorage.js";
import { getPedidos } from "../../../utils/pedidosStorage.js";
import type { EstadoPedido } from "../../../types/tienda.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) return;

  const session = getSession();
  if (!session) return;

  const userEl = document.getElementById("admin-user");
  if (userEl) userEl.textContent = session.email;

  document.getElementById("btn-logout")?.addEventListener("click", () => logout());

  const categorias = getCategorias();
  const productos = getProductos();
  const pedidos = getPedidos();
  const disponibles = productos.filter((p) => p.disponible && p.stock > 0);

  const set = (id: string, val: string | number): void => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };

  set("stat-categorias", categorias.length);
  set("stat-productos", productos.length);
  set("stat-disponibles", disponibles.length);
  set("stat-pedidos", pedidos.length);

  const estadoLabels: Record<EstadoPedido, string> = {
    PENDIENTE: "Pendiente",
    CONFIRMADO: "Confirmado",
    TERMINADO: "Terminado",
    CANCELADO: "Cancelado",
  };

  const tbody = document.getElementById("tbody-estados");
  if (tbody) {
    const estados: EstadoPedido[] = ["PENDIENTE", "CONFIRMADO", "TERMINADO", "CANCELADO"];
    for (const e of estados) {
      const count = pedidos.filter((p) => p.estado === e).length;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${estadoLabels[e]}</td><td>${count}</td>`;
      tbody.appendChild(tr);
    }
  }
});
