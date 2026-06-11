import type { Categoria } from "../types/IUser.js";

export const categoriasSeed: readonly Categoria[] = [
  { id: 1, nombre: "Hamburguesas", descripcion: "Las mejores hamburguesas de la ciudad" },
  { id: 2, nombre: "Pizzas", descripcion: "Pizzas artesanales con ingredientes frescos" },
  { id: 3, nombre: "Papas Fritas", descripcion: "Crocantes por fuera, suaves por dentro" },
  { id: 4, nombre: "Bebidas", descripcion: "Refrescos, jugos y agua" },
  { id: 5, nombre: "Postres", descripcion: "El final perfecto para tu comida" },
];
