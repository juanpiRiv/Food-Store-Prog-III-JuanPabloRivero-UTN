import { ROUTES } from "../../../utils/navigate.js";
import { categorias, productos } from "../../../data/productos.js";
import { checkAuthUser, getSession, logout } from "../../../utils/auth.js";

function renderNav(): void {
  const nav = document.getElementById("nav-main");
  if (!nav) return;

  const session = getSession();

  const links: { href: string; label: string }[] = [
    { href: ROUTES.clientHome, label: "Inicio" },
    { href: "#", label: "Mis Pedidos" },
    { href: "#", label: "Carrito" },
  ];

  if (session?.rol === "admin") {
    links.push({ href: ROUTES.adminHome, label: "Panel Admin" });
  }

  const authBlock = session
    ? `<span class="nav-user">${session.email}</span>
       <button type="button" class="nav-logout" id="btn-logout">Cerrar sesión</button>`
    : `<a href="${ROUTES.login}">Iniciar sesión</a>
       <a href="${ROUTES.registro}">Registrarse</a>`;

  nav.innerHTML = [
    ...links.map((l) => `<a href="${l.href}">${l.label}</a>`),
    authBlock,
  ].join("");

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    logout();
  });
}

function cargarCategorias(): void {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;

  for (const cat of categorias) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = cat;
    li.appendChild(a);
    lista.appendChild(li);
  }
}

function cargarProductos(): void {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;

  for (const prod of productos) {
    const article = document.createElement("article");

    article.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <strong>$${prod.precio}</strong>
            <button type="button">Agregar</button>
        `;

    const btn = article.querySelector("button");
    btn?.addEventListener("click", () => {
      alert(`Agregaste: ${prod.nombre}`);
    });

    contenedor.appendChild(article);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.adminHome, "client")) {
    return;
  }

  renderNav();
  cargarCategorias();
  cargarProductos();
});
