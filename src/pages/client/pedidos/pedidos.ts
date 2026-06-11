import { ROUTES } from "../../../utils/navigate.js";
import { getPedidosDeUsuario } from "../../../utils/pedidosStorage.js";
import { checkAuthTienda, getSession } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";
import { formatCurrency, formatDate } from "../../../utils/format.js";

const estadoLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  TERMINADO: "Terminado",
  CANCELADO: "Cancelado",
};

function renderPedidos(): void {
  const box = document.getElementById("lista-pedidos");
  if (!box) return;

  const session = getSession();
  if (!session) return;

  const pedidos = getPedidosDeUsuario(session.userId);

  if (pedidos.length === 0) {
    box.innerHTML =
      '<p class="sin-resultados">Todavía no tenés pedidos. Comprá algo en la tienda y confirmá el carrito.</p>';
    return;
  }

  const bloques = pedidos.map((p) => {
    const lineas = p.items
      .map(
        (i) =>
          `<li>${i.nombre} × ${i.cantidad} — ${formatCurrency(i.precio * i.cantidad)}</li>`,
      )
      .join("");

    const estadoLabel = estadoLabels[p.estado] ?? p.estado;

    return `<article class="pedido-card">
      <div class="pedido-card-header">
        <h3>Pedido #${p.id.slice(0, 8)}…</h3>
        <span class="badge-estado badge-${p.estado.toLowerCase()}">${estadoLabel}</span>
      </div>
      <p class="pedido-fecha">${formatDate(p.fecha)}</p>
      <p>Forma de pago: ${p.formaPago}</p>
      <ul>${lineas}</ul>
      <p class="pedido-total"><strong>Total: ${formatCurrency(p.total)}</strong></p>
    </article>`;
  });

  box.innerHTML = bloques.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) return;
  renderClientNav();
  renderPedidos();
});
