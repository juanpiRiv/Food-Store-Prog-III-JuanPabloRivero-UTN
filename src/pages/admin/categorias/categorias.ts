import { ROUTES } from "../../../utils/navigate.js";
import { checkAuthUser, getSession, logout } from "../../../utils/auth.js";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  getCategorias,
} from "../../../utils/categoriaStorage.js";

function renderTabla(): void {
  const tbody = document.getElementById("tbody-categorias");
  if (!tbody) return;
  tbody.innerHTML = "";

  const lista = getCategorias();

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="sin-resultados">No hay categorías activas.</td></tr>';
    return;
  }

  for (const cat of lista) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.nombre}</td>
      <td>${cat.descripcion}</td>
      <td>
        <button type="button" class="btn-edit btn-sm" data-id="${cat.id}">Editar</button>
        <button type="button" class="btn-delete btn-sm" data-id="${cat.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll<HTMLButtonElement>(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const cat = getCategorias().find((c) => c.id === id);
      if (!cat) return;
      cargarFormulario(cat.id, cat.nombre, cat.descripcion);
    });
  });

  tbody.querySelectorAll<HTMLButtonElement>(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (!confirm("¿Dar de baja esta categoría?")) return;
      eliminarCategoria(id);
      renderTabla();
    });
  });
}

function cargarFormulario(id: number, nombre: string, descripcion: string): void {
  const idInput = document.getElementById("cat-id") as HTMLInputElement | null;
  const nombreInput = document.getElementById("cat-nombre") as HTMLInputElement | null;
  const descInput = document.getElementById("cat-descripcion") as HTMLInputElement | null;
  const title = document.getElementById("form-title");
  const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement | null;

  if (idInput) idInput.value = String(id);
  if (nombreInput) nombreInput.value = nombre;
  if (descInput) descInput.value = descripcion;
  if (title) title.textContent = "Editar categoría";
  if (btnCancelar) btnCancelar.style.display = "inline-block";
}

function resetFormulario(): void {
  const idInput = document.getElementById("cat-id") as HTMLInputElement | null;
  const nombreInput = document.getElementById("cat-nombre") as HTMLInputElement | null;
  const descInput = document.getElementById("cat-descripcion") as HTMLInputElement | null;
  const title = document.getElementById("form-title");
  const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement | null;

  if (idInput) idInput.value = "";
  if (nombreInput) nombreInput.value = "";
  if (descInput) descInput.value = "";
  if (title) title.textContent = "Nueva categoría";
  if (btnCancelar) btnCancelar.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) return;

  const session = getSession();
  if (!session) return;

  const userEl = document.getElementById("admin-user");
  if (userEl) userEl.textContent = session.email;

  document.getElementById("btn-logout")?.addEventListener("click", () => logout());

  renderTabla();

  document.getElementById("form-categoria")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const idInput = document.getElementById("cat-id") as HTMLInputElement;
    const nombreInput = document.getElementById("cat-nombre") as HTMLInputElement;
    const descInput = document.getElementById("cat-descripcion") as HTMLInputElement;

    const nombre = nombreInput.value.trim();
    const descripcion = descInput.value.trim();
    const id = idInput.value ? Number(idInput.value) : null;

    if (!nombre) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (id !== null) {
      actualizarCategoria(id, nombre, descripcion);
    } else {
      crearCategoria(nombre, descripcion);
    }

    resetFormulario();
    renderTabla();
  });

  document.getElementById("btn-cancelar")?.addEventListener("click", () => {
    resetFormulario();
  });
});
