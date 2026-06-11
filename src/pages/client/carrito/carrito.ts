import { ROUTES, navigate } from "../../../utils/navigate.js";
import {
  getCarrito,
  quitarLinea,
  setCantidad,
  totalCarrito,
  vaciarCarrito,
} from "../../../utils/carritoStorage.js";
import { registrarPedido } from "../../../utils/pedidosStorage.js";
import { checkAuthTienda, getSession } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";
import { getProductoById } from "../../../utils/productoStorage.js";
import { formatCurrency } from "../../../utils/format.js";
import type { FormaPago } from "../../../types/tienda.js";

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
    const prod = getProductoById(linea.productoId);
    const maxStock = prod ? prod.stock : 999;
    rows += `<tr data-id="${linea.productoId}" data-stock="${maxStock}">
      <td>${linea.nombre}</td>
      <td>${formatCurrency(linea.precio)}</td>
      <td>
        <button type="button" class="btn-menos" aria-label="Menos">−</button>
        <span class="qty">${linea.cantidad}</span>
        <button type="button" class="btn-mas" aria-label="Más" ${linea.cantidad >= maxStock ? "disabled" : ""}>+</button>
      </td>
      <td>${formatCurrency(sub)}</td>
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
    <p class="total-carrito"><strong>Total: <span id="total-num">${formatCurrency(totalCarrito())}</span></strong></p>

    <div class="forma-pago-row">
      <label for="sel-forma-pago">Forma de pago:</label>
      <select id="sel-forma-pago">
        <option value="EFECTIVO">Efectivo</option>
        <option value="TARJETA">Tarjeta</option>
        <option value="TRANSFERENCIA">Transferencia</option>
      </select>
    </div>

    <p class="acciones-carrito">
      <button type="button" id="btn-vaciar">Vaciar carrito</button>
      <button type="button" id="btn-confirmar">Confirmar pedido</button>
    </p>
  `;

  box.querySelectorAll("tr[data-id]").forEach((tr) => {
    const id = Number((tr as HTMLElement).dataset.id);
    const stock = Number((tr as HTMLElement).dataset.stock);

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
      if (linea.cantidad >= stock) {
        alert(`Stock máximo disponible: ${stock}`);
        return;
      }
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

    // Revalidar stock antes de confirmar
    for (const linea of actuales) {
      const prod = getProductoById(linea.productoId);
      if (!prod || !prod.disponible) {
        alert(`El producto "${linea.nombre}" ya no está disponible.`);
        return;
      }
      if (linea.cantidad > prod.stock) {
        alert(`Stock insuficiente para "${linea.nombre}". Disponible: ${prod.stock}`);
        return;
      }
    }

    const session = getSession();
    if (!session) { navigate(ROUTES.login); return; }

    const formaPago = (
      (document.getElementById("sel-forma-pago") as HTMLSelectElement | null)?.value ?? "EFECTIVO"
    ) as FormaPago;

    registrarPedido(actuales, formaPago, session.userId, session.email);
    vaciarCarrito();
    renderClientNav();
    navigate(ROUTES.pedidos);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) return;
  renderClientNav();
  renderCarrito();
});
