import { ROUTES } from "../../../utils/navigate.js";
import { checkAuthUser, getSession, logout } from "../../../utils/auth.js";
import { actualizarEstadoPedido, getPedidos } from "../../../utils/pedidosStorage.js";
import { formatCurrency, formatDate } from "../../../utils/format.js";
import type { EstadoPedido } from "../../../types/tienda.js";

let filtroEstado: EstadoPedido | "" = "";

function renderTabla(): void {
  const tbody = document.getElementById("tbody-pedidos");
  if (!tbody) return;
  tbody.innerHTML = "";

  let pedidos = getPedidos();

  // Orden: más reciente primero
  pedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  if (filtroEstado) {
    pedidos = pedidos.filter((p) => p.estado === filtroEstado);
  }

  if (pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="sin-resultados">No hay pedidos con ese criterio.</td></tr>';
    return;
  }

  const estadoLabels: Record<EstadoPedido, string> = {
    PENDIENTE: "Pendiente",
    CONFIRMADO: "Confirmado",
    TERMINADO: "Terminado",
    CANCELADO: "Cancelado",
  };

  for (const pedido of pedidos) {
    const tr = document.createElement("tr");
    const idCorto = pedido.id.slice(0, 8);

    tr.innerHTML = `
      <td title="${pedido.id}">${idCorto}…</td>
      <td>${formatDate(pedido.fecha)}</td>
      <td>${pedido.userEmail}</td>
      <td>${formatCurrency(pedido.total)}</td>
      <td>${pedido.formaPago}</td>
      <td><span class="badge-estado badge-${pedido.estado.toLowerCase()}">${estadoLabels[pedido.estado]}</span></td>
      <td>
        <select class="sel-estado" data-id="${pedido.id}">
          <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
          <option value="CONFIRMADO" ${pedido.estado === "CONFIRMADO" ? "selected" : ""}>Confirmado</option>
          <option value="TERMINADO" ${pedido.estado === "TERMINADO" ? "selected" : ""}>Terminado</option>
          <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll<HTMLSelectElement>(".sel-estado").forEach((sel) => {
    sel.addEventListener("change", () => {
      const id = sel.dataset.id ?? "";
      const nuevoEstado = sel.value as EstadoPedido;
      actualizarEstadoPedido(id, nuevoEstado);
      renderTabla();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) return;

  const session = getSession();
  if (!session) return;

  const userEl = document.getElementById("admin-user");
  if (userEl) userEl.textContent = session.email;

  document.getElementById("btn-logout")?.addEventListener("click", () => logout());

  renderTabla();

  document.getElementById("filtro-estado")?.addEventListener("change", (e) => {
    filtroEstado = (e.target as HTMLSelectElement).value as EstadoPedido | "";
    renderTabla();
  });
});
