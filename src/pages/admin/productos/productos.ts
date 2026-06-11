import { ROUTES } from "../../../utils/navigate.js";
import { checkAuthUser, getSession, logout } from "../../../utils/auth.js";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProductos,
} from "../../../utils/productoStorage.js";
import { getCategorias } from "../../../utils/categoriaStorage.js";
import { formatCurrency } from "../../../utils/format.js";

function poblarSelectCategorias(selectedId?: number): void {
  const select = document.getElementById("prod-categoria") as HTMLSelectElement | null;
  if (!select) return;
  select.innerHTML = '<option value="">Seleccionar...</option>';
  for (const cat of getCategorias()) {
    const opt = document.createElement("option");
    opt.value = String(cat.id);
    opt.textContent = cat.nombre;
    if (selectedId !== undefined && cat.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  }
}

function renderTabla(): void {
  const tbody = document.getElementById("tbody-productos");
  if (!tbody) return;
  tbody.innerHTML = "";

  const lista = getProductos();
  const cats = getCategorias();

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="sin-resultados">No hay productos activos.</td></tr>';
    return;
  }

  for (const prod of lista) {
    const catNombre = cats.find((c) => c.id === prod.categoriaId)?.nombre ?? prod.categoria;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.nombre}</td>
      <td>${catNombre}</td>
      <td>${formatCurrency(prod.precio)}</td>
      <td>${prod.stock}</td>
      <td>${prod.disponible ? "Sí" : "No"}</td>
      <td>
        <button type="button" class="btn-edit btn-sm" data-id="${prod.id}">Editar</button>
        <button type="button" class="btn-delete btn-sm" data-id="${prod.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll<HTMLButtonElement>(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const prod = getProductos().find((p) => p.id === id);
      if (!prod) return;
      cargarFormulario(prod.id, prod.nombre, prod.descripcion, prod.precio,
        prod.stock, prod.categoriaId, prod.imagen ?? "", prod.disponible);
    });
  });

  tbody.querySelectorAll<HTMLButtonElement>(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (!confirm("¿Dar de baja este producto?")) return;
      eliminarProducto(id);
      renderTabla();
    });
  });
}

function cargarFormulario(
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  stock: number,
  categoriaId: number,
  imagen: string,
  disponible: boolean,
): void {
  (document.getElementById("prod-id") as HTMLInputElement).value = String(id);
  (document.getElementById("prod-nombre") as HTMLInputElement).value = nombre;
  (document.getElementById("prod-descripcion") as HTMLInputElement).value = descripcion;
  (document.getElementById("prod-precio") as HTMLInputElement).value = String(precio);
  (document.getElementById("prod-stock") as HTMLInputElement).value = String(stock);
  (document.getElementById("prod-imagen") as HTMLInputElement).value = imagen;
  (document.getElementById("prod-disponible") as HTMLInputElement).checked = disponible;
  poblarSelectCategorias(categoriaId);
  const title = document.getElementById("form-title");
  if (title) title.textContent = "Editar producto";
  const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement | null;
  if (btnCancelar) btnCancelar.style.display = "inline-block";
}

function resetFormulario(): void {
  (document.getElementById("prod-id") as HTMLInputElement).value = "";
  (document.getElementById("prod-nombre") as HTMLInputElement).value = "";
  (document.getElementById("prod-descripcion") as HTMLInputElement).value = "";
  (document.getElementById("prod-precio") as HTMLInputElement).value = "";
  (document.getElementById("prod-stock") as HTMLInputElement).value = "";
  (document.getElementById("prod-imagen") as HTMLInputElement).value = "";
  (document.getElementById("prod-disponible") as HTMLInputElement).checked = true;
  poblarSelectCategorias();
  const title = document.getElementById("form-title");
  if (title) title.textContent = "Nuevo producto";
  const btnCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement | null;
  if (btnCancelar) btnCancelar.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) return;

  const session = getSession();
  if (!session) return;

  const userEl = document.getElementById("admin-user");
  if (userEl) userEl.textContent = session.email;

  document.getElementById("btn-logout")?.addEventListener("click", () => logout());

  poblarSelectCategorias();
  renderTabla();

  document.getElementById("form-producto")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const idInput = document.getElementById("prod-id") as HTMLInputElement;
    const nombre = (document.getElementById("prod-nombre") as HTMLInputElement).value.trim();
    const descripcion = (document.getElementById("prod-descripcion") as HTMLInputElement).value.trim();
    const precioStr = (document.getElementById("prod-precio") as HTMLInputElement).value;
    const stockStr = (document.getElementById("prod-stock") as HTMLInputElement).value;
    const categoriaIdStr = (document.getElementById("prod-categoria") as HTMLSelectElement).value;
    const imagen = (document.getElementById("prod-imagen") as HTMLInputElement).value.trim();
    const disponible = (document.getElementById("prod-disponible") as HTMLInputElement).checked;

    const precio = parseFloat(precioStr);
    const stock = parseInt(stockStr, 10);
    const categoriaId = parseInt(categoriaIdStr, 10);

    if (!nombre || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0 || isNaN(categoriaId)) {
      alert("Completá todos los campos requeridos correctamente.");
      return;
    }

    const catNombre = getCategorias().find((c) => c.id === categoriaId)?.nombre ?? "";
    const id = idInput.value ? Number(idInput.value) : null;

    if (id !== null) {
      actualizarProducto(id, { nombre, descripcion, precio, stock, categoriaId, categoria: catNombre, imagen, disponible });
    } else {
      crearProducto({ nombre, descripcion, precio, stock, categoriaId, categoria: catNombre, imagen, disponible });
    }

    resetFormulario();
    renderTabla();
  });

  document.getElementById("btn-cancelar")?.addEventListener("click", () => resetFormulario());
});
