import { ROUTES } from "../../../utils/navigate.js";
import { productos } from "../../../data/productos.js";
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

  for (const prod of productos) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>$${prod.precio}</td>
        `;
    tbody.appendChild(tr);
  }
});
