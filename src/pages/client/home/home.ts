import type { Producto } from "../../../types/IUser.js";
import { ROUTES } from "../../../utils/navigate.js";
import { getCategorias } from "../../../utils/categoriaStorage.js";
import { getProductos } from "../../../utils/productoStorage.js";
import { agregarAlCarrito } from "../../../utils/carritoStorage.js";
import { checkAuthTienda } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";
import { formatCurrency } from "../../../utils/format.js";

type OrdenTipo = "default" | "az" | "za" | "precio-asc" | "precio-desc";

let categoriaSeleccionada: number | null = null;
let textoBusqueda = "";
let ordenActual: OrdenTipo = "default";

function ordenarLista(lista: Producto[]): Producto[] {
  const copia = [...lista];
  switch (ordenActual) {
    case "az":
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
    case "za":
      return copia.sort((a, b) => b.nombre.localeCompare(a.nombre));
    case "precio-asc":
      return copia.sort((a, b) => a.precio - b.precio);
    case "precio-desc":
      return copia.sort((a, b) => b.precio - a.precio);
    default:
      return copia;
  }
}

function filtrarLista(): Producto[] {
  let lista = getProductos();

  const q = textoBusqueda.trim().toLowerCase();
  if (q.length > 0) {
    return ordenarLista(
      lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q),
      ),
    );
  }

  if (categoriaSeleccionada !== null) {
    lista = lista.filter((p) => p.categoriaId === categoriaSeleccionada);
  }

  return ordenarLista(lista);
}

function renderProductos(): void {
  const contenedor = document.getElementById("contenedor-productos");
  const contador = document.getElementById("contador-resultados");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const lista = filtrarLista();

  if (contador) contador.textContent = `${lista.length} producto${lista.length !== 1 ? "s" : ""}`;

  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="sin-resultados">No hay productos con ese criterio.</p>';
    return;
  }

  for (const prod of lista) {
    const article = document.createElement("article");
    const agotado = !prod.disponible || prod.stock === 0;

    article.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" />
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <strong>${formatCurrency(prod.precio)}</strong>
      ${agotado ? '<span class="badge-sin-stock">Sin stock</span>' : `<span class="badge-stock-ok">Stock: ${prod.stock}</span>`}
      <div class="card-actions">
        <a href="${ROUTES.productDetail}?id=${prod.id}" class="btn-detalle">Ver detalle</a>
        <button type="button" class="btn-agregar" ${agotado ? "disabled" : ""}>
          ${agotado ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    `;

    if (!agotado) {
      const btn = article.querySelector(".btn-agregar");
      btn?.addEventListener("click", () => {
        agregarAlCarrito(prod);
        renderClientNav();
      });
    }

    contenedor.appendChild(article);
  }
}

function marcarCategoriaActiva(): void {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;
  lista.querySelectorAll("a").forEach((a) => {
    const el = a as HTMLAnchorElement;
    const catId = el.dataset.categoriaId;
    const activo =
      (categoriaSeleccionada === null && catId === "todas") ||
      (categoriaSeleccionada !== null && Number(catId) === categoriaSeleccionada);
    el.classList.toggle("categoria-activa", activo);
  });
}

function cargarCategorias(): void {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;

  lista.innerHTML = "";

  const li0 = document.createElement("li");
  const aTodas = document.createElement("a");
  aTodas.href = "#";
  aTodas.dataset.categoriaId = "todas";
  aTodas.textContent = "Todas";
  aTodas.addEventListener("click", (e) => {
    e.preventDefault();
    categoriaSeleccionada = null;
    marcarCategoriaActiva();
    renderProductos();
  });
  li0.appendChild(aTodas);
  lista.appendChild(li0);

  for (const cat of getCategorias()) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.categoriaId = String(cat.id);
    a.textContent = cat.nombre;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      categoriaSeleccionada = cat.id;
      marcarCategoriaActiva();
      renderProductos();
    });
    li.appendChild(a);
    lista.appendChild(li);
  }

  marcarCategoriaActiva();
}

function setupBusqueda(): void {
  const form = document.getElementById("form-buscar") as HTMLFormElement | null;
  const input = document.getElementById("input-buscar") as HTMLInputElement | null;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    textoBusqueda = input?.value ?? "";
    renderProductos();
  });
  input?.addEventListener("input", () => {
    textoBusqueda = input?.value ?? "";
    renderProductos();
  });
}

function setupOrden(): void {
  const select = document.getElementById("select-orden") as HTMLSelectElement | null;
  select?.addEventListener("change", () => {
    ordenActual = (select.value as OrdenTipo) ?? "default";
    renderProductos();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) return;

  renderClientNav();
  cargarCategorias();
  setupBusqueda();
  setupOrden();
  renderProductos();
});
