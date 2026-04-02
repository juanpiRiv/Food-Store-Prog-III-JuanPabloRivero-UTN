import { ROUTES } from "../../../utils/navigate.js";
import { productos } from "../../../data/productos.js";
import {
  aplicarPreciosABase,
  setPrecioProducto,
} from "../../../utils/preciosStorage.js";
import { checkAuthUser, getSession } from "../../../utils/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) {
    return;
  }

  const session = getSession();
  if (session === null) {
    return;
  }

  const volver = document.getElementById("link-volver");
  if (volver) {
    volver.setAttribute("href", ROUTES.clientHome);
  }

  const userLabel = document.getElementById("admin-user");
  if (userLabel) {
    userLabel.textContent = session.email;
  }

  const tbody = document.getElementById("tabla-productos");
  if (!tbody) return;

  const conPrecios = aplicarPreciosABase(productos);

  for (const prod of conPrecios) {
    const baseRow = productos.find((p) => p.id === prod.id);
    const precioBase = baseRow?.precio ?? prod.precio;
    const tr = document.createElement("tr");
    const precioStr = String(prod.precio);
    tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td class="celda-precio">
              <label class="sr-only" for="precio-${prod.id}">Precio ${prod.nombre}</label>
              <span class="prefijo-precio">$</span>
              <input
                type="number"
                class="admin-input-precio"
                id="precio-${prod.id}"
                min="0"
                step="1"
                inputmode="numeric"
                value="${precioStr}"
                data-producto-id="${prod.id}"
                data-precio-base="${precioBase}"
              />
            </td>
        `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll<HTMLInputElement>(".admin-input-precio").forEach((input) => {
    const commit = (): void => {
      const id = Number(input.dataset.productoId);
      const base = Number(input.dataset.precioBase);
      const raw = input.value.trim();
      const n = raw === "" ? NaN : Number(raw);
      if (!Number.isFinite(n) || n < 0 || !Number.isInteger(id)) {
        const ok = aplicarPreciosABase(productos).find((p) => p.id === id);
        input.value = String(ok?.precio ?? base);
        return;
      }
      setPrecioProducto(id, n);
      const actualizado = aplicarPreciosABase(productos).find((p) => p.id === id);
      if (actualizado) {
        input.value = String(actualizado.precio);
      }
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.blur();
      }
    });
  });
});
