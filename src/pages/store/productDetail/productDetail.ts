import { ROUTES, navigate } from "../../../utils/navigate.js";
import { checkAuthTienda } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";
import { agregarAlCarrito } from "../../../utils/carritoStorage.js";
import { getProductoById } from "../../../utils/productoStorage.js";
import { formatCurrency } from "../../../utils/format.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) return;

  renderClientNav();

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  if (isNaN(id) || id <= 0) {
    contenedor.innerHTML = '<p class="sin-resultados">Producto no encontrado.</p>';
    return;
  }

  const producto = getProductoById(id);

  if (!producto) {
    contenedor.innerHTML = '<p class="sin-resultados">Producto no encontrado.</p>';
    return;
  }

  const badgeStock = producto.stock > 0
    ? `<span class="badge-stock-ok">Stock: ${producto.stock}</span>`
    : `<span class="badge-sin-stock">Sin stock</span>`;

  const badgeDisp = producto.disponible
    ? ""
    : `<span class="badge-no-disponible">No disponible</span>`;

  const puedeAgregar = producto.disponible && producto.stock > 0;

  contenedor.innerHTML = `
    <div class="detalle-card">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="detalle-imagen" />
      <div class="detalle-info">
        <h2>${producto.nombre}</h2>
        <p class="detalle-categoria">Categoría: ${producto.categoria}</p>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        <p class="detalle-precio">${formatCurrency(producto.precio)}</p>
        <div class="detalle-badges">${badgeStock} ${badgeDisp}</div>
        ${puedeAgregar ? `
          <div class="detalle-cantidad">
            <label for="input-cantidad">Cantidad:</label>
            <input
              type="number"
              id="input-cantidad"
              min="1"
              max="${producto.stock}"
              value="1"
            />
          </div>
          <button type="button" id="btn-agregar-detalle" class="btn-agregar">
            Agregar al carrito
          </button>
        ` : `
          <p class="sin-resultados">Este producto no está disponible en este momento.</p>
        `}
      </div>
    </div>
  `;

  if (puedeAgregar) {
    document.getElementById("btn-agregar-detalle")?.addEventListener("click", () => {
      const input = document.getElementById("input-cantidad") as HTMLInputElement | null;
      const cantidad = input ? parseInt(input.value, 10) : 1;

      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingresá una cantidad válida.");
        return;
      }

      if (cantidad > producto.stock) {
        alert(`Stock insuficiente. Máximo disponible: ${producto.stock}`);
        return;
      }

      agregarAlCarrito(producto, cantidad);
      renderClientNav();
      navigate(ROUTES.carrito);
    });
  }
});
