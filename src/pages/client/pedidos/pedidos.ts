import { ROUTES } from "../../../utils/navigate.js";
import { getPedidos } from "../../../utils/pedidosStorage.js";
import { checkAuthTienda } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";

function renderPedidos(): void {
  const box = document.getElementById("lista-pedidos");
  if (!box) return;

  const pedidos = getPedidos();
  if (pedidos.length === 0) {
    box.innerHTML =
      '<p class="sin-resultados">Todavía no registraste pedidos. Comprá algo en la tienda y confirmá el carrito.</p>';
    return;
  }

  const bloques = pedidos.map((p) => {
    const fecha = new Date(p.fecha).toLocaleString("es-AR");
    const lineas = p.items
      .map(
        (i) =>
          `<li>${i.nombre} × ${i.cantidad} — $${i.precio * i.cantidad}</li>`,
      )
      .join("");
    return `<article class="pedido-card">
      <h3>Pedido ${p.id.slice(0, 8)}…</h3>
      <p class="pedido-fecha">${fecha}</p>
      <ul>${lineas}</ul>
      <p><strong>Total: $${p.total}</strong></p>
    </article>`;
  });

  box.innerHTML = bloques.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) {
    return;
  }
  renderClientNav();
  renderPedidos();
});
