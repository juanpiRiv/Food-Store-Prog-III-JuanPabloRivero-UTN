import {
  ROUTES,
  navigate,
} from "../../../utils/navigate.js";
import {
  getCarrito,
  quitarLinea,
  setCantidad,
  totalCarrito,
  vaciarCarrito,
} from "../../../utils/carritoStorage.js";
import { registrarPedido } from "../../../utils/pedidosStorage.js";
import { checkAuthTienda } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";

function renderCarrito(): void {
  const box = document.getElementById("contenedor-carrito");
  if (!box) return;

  const items = getCarrito();
  if (items.length === 0) {
    box.innerHTML =
      '<p class="sin-resultados">El carrito está vacío. <a href="../home/home.html">Ir a la tienda</a></p>';
    return;
  }

  let rows = "";
  for (const linea of items) {
    const sub = linea.precio * linea.cantidad;
    rows += `<tr data-id="${linea.productoId}">
      <td>${linea.nombre}</td>
      <td>$${linea.precio}</td>
      <td>
        <button type="button" class="btn-menos" aria-label="Menos">−</button>
        <span class="qty">${linea.cantidad}</span>
        <button type="button" class="btn-mas" aria-label="Más">+</button>
      </td>
      <td>$${sub}</td>
      <td><button type="button" class="btn-quitar">Quitar</button></td>
    </tr>`;
  }

  box.innerHTML = `
    <table class="tabla-carrito" border="1">
      <thead>
        <tr><th>Producto</th><th>Precio unit.</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="total-carrito"><strong>Total: $<span id="total-num">${totalCarrito()}</span></strong></p>
    <p class="acciones-carrito">
      <button type="button" id="btn-vaciar">Vaciar carrito</button>
      <button type="button" id="btn-confirmar">Confirmar pedido</button>
    </p>
  `;

  box.querySelectorAll("tr[data-id]").forEach((tr) => {
    const id = Number((tr as HTMLElement).dataset.id);
    tr.querySelector(".btn-menos")?.addEventListener("click", () => {
      const linea = getCarrito().find((l) => l.productoId === id);
      if (!linea) return;
      setCantidad(id, linea.cantidad - 1);
      renderClientNav();
      renderCarrito();
    });
    tr.querySelector(".btn-mas")?.addEventListener("click", () => {
      const linea = getCarrito().find((l) => l.productoId === id);
      if (!linea) return;
      setCantidad(id, linea.cantidad + 1);
      renderClientNav();
      renderCarrito();
    });
    tr.querySelector(".btn-quitar")?.addEventListener("click", () => {
      quitarLinea(id);
      renderClientNav();
      renderCarrito();
    });
  });

  document.getElementById("btn-vaciar")?.addEventListener("click", () => {
    vaciarCarrito();
    renderClientNav();
    renderCarrito();
  });

  document.getElementById("btn-confirmar")?.addEventListener("click", () => {
    const actuales = getCarrito();
    if (actuales.length === 0) return;
    registrarPedido(actuales);
    vaciarCarrito();
    renderClientNav();
    navigate(ROUTES.pedidos);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) {
    return;
  }
  renderClientNav();
  renderCarrito();
});
