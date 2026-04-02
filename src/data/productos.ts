import type { Producto } from "../types/IUser.js";

import imgBurger from "../assets/productos/burger.jpg?url";
import imgPizza from "../assets/productos/pizza.jpg?url";

export const categorias: readonly string[] = [
  "Hamburguesas",
  "Pizzas",
  "Papas Fritas",
  "Bebidas",
] as const;

/**
 * Fotos reales: solo hay burger.jpg y pizza.jpg en assets.
 * Bebida y papas reutilizan esas imágenes como placeholder (como el mock viejo).
 */
export const productos: readonly Producto[] = [
  {
    id: 1,
    nombre: "Hamburguesa",
    descripcion: "Con queso",
    precio: 3500,
    imagen: imgBurger,
    categoria: "Hamburguesas",
  },
  {
    id: 2,
    nombre: "Pizza",
    descripcion: "Muzzarella",
    precio: 4200,
    imagen: imgPizza,
    categoria: "Pizzas",
  },
  {
    id: 3,
    nombre: "Coca Cola",
    descripcion: "500ml",
    precio: 1800,
    imagen: imgBurger,
    categoria: "Bebidas",
  },
  {
    id: 4,
    nombre: "Papas Fritas",
    descripcion: "Porción grande",
    precio: 2200,
    imagen: imgPizza,
    categoria: "Papas Fritas",
  },
];
