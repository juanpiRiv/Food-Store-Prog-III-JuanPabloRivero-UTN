import { ROUTES } from "./navigate.js";
import { getSession, logout } from "./auth.js";
import { getCarritoCantidadTotal } from "./carritoStorage.js";

export function renderClientNav(): void {
  const nav = document.getElementById("nav-main");
  if (!nav) return;

  const session = getSession();
  const nCarrito = getCarritoCantidadTotal();

  const links: { href: string; label: string }[] = [
    { href: ROUTES.clientHome, label: "Inicio" },
    { href: ROUTES.pedidos, label: "Mis pedidos" },
    {
      href: ROUTES.carrito,
      label: nCarrito > 0 ? `Carrito (${nCarrito})` : "Carrito",
    },
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
