import type { Producto } from "../../../types/IUser.js";
import { ROUTES } from "../../../utils/navigate.js";
import { categorias, productos } from "../../../data/productos.js";
import { aplicarPreciosABase } from "../../../utils/preciosStorage.js";
import { agregarAlCarrito } from "../../../utils/carritoStorage.js";
import { checkAuthTienda } from "../../../utils/auth.js";
import { renderClientNav } from "../../../utils/clientNav.js";

let categoriaSeleccionada: string | null = null;
let textoBusqueda = "";

function catalogoActual(): Producto[] {
  return aplicarPreciosABase(productos);
}

function filtrarLista(): Producto[] {
  let lista = [...catalogoActual()];

  const q = textoBusqueda.trim().toLowerCase();
  if (q.length > 0) {
    // Si hay búsqueda activa, se busca en todo el catálogo (sin restringir por categoría).
    return lista.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q),
    );
  }

  if (categoriaSeleccionada !== null) {
    lista = lista.filter((p) => p.categoria === categoriaSeleccionada);
  }

  return lista;
}

function aplicarFiltros(): void {
  renderProductos();
}

function renderProductos(): void {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const lista = filtrarLista();

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="sin-resultados">No hay productos con ese criterio.</p>';
    return;
  }

  for (const prod of lista) {
    const article = document.createElement("article");

    article.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <strong>$${prod.precio}</strong>
            <button type="button" class="btn-agregar">Agregar al carrito</button>
        `;

    const btn = article.querySelector(".btn-agregar");
    btn?.addEventListener("click", () => {
      agregarAlCarrito(prod);
      renderClientNav();
    });

    contenedor.appendChild(article);
  }
}

function marcarCategoriaActiva(): void {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;
  lista.querySelectorAll("a").forEach((a) => {
    const el = a as HTMLAnchorElement;
    const cat = el.dataset.categoria ?? "";
    const activo =
      (categoriaSeleccionada === null && cat === "todas") ||
      (categoriaSeleccionada !== null && cat === categoriaSeleccionada);
    el.classList.toggle("categoria-activa", activo);
  });
}

function cargarCategorias(): void {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;

  lista.innerHTML = "";

  const todas = document.createElement("li");
  const aTodas = document.createElement("a");
  aTodas.href = "#";
  aTodas.dataset.categoria = "todas";
  aTodas.textContent = "Todas";
  aTodas.addEventListener("click", (e) => {
    e.preventDefault();
    categoriaSeleccionada = null;
    marcarCategoriaActiva();
    aplicarFiltros();
  });
  todas.appendChild(aTodas);
  lista.appendChild(todas);

  for (const cat of categorias) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.categoria = cat;
    a.textContent = cat;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      categoriaSeleccionada = cat;
      marcarCategoriaActiva();
      aplicarFiltros();
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
    aplicarFiltros();
  });
  input?.addEventListener("input", () => {
    textoBusqueda = input.value;
    aplicarFiltros();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthTienda(ROUTES.login)) {
    return;
  }

  renderClientNav();
  cargarCategorias();
  setupBusqueda();
  renderProductos();
});
