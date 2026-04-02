import type { Producto } from "../types/IUser.js";
import type { LineaPedido } from "../types/tienda.js";

const KEY = "foodstore_carrito_v1";

function read(): LineaPedido[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: LineaPedido[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (
        typeof o.productoId === "number" &&
        typeof o.nombre === "string" &&
        typeof o.precio === "number" &&
        typeof o.cantidad === "number" &&
        o.cantidad > 0
      ) {
        out.push({
          productoId: o.productoId,
          nombre: o.nombre,
          precio: o.precio,
          cantidad: o.cantidad,
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

function write(items: readonly LineaPedido[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getCarrito(): LineaPedido[] {
  return read();
}

export function getCarritoCantidadTotal(): number {
  return read().reduce((s, i) => s + i.cantidad, 0);
}

export function agregarAlCarrito(producto: Producto): void {
  const items = [...read()];
  const idx = items.findIndex((i) => i.productoId === producto.id);
  if (idx >= 0) {
    const linea = items[idx];
    items[idx] = {
      ...linea,
      cantidad: linea.cantidad + 1,
    };
  } else {
    items.push({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }
  write(items);
}

export function setCantidad(productoId: number, cantidad: number): void {
  let items = [...read()];
  if (cantidad <= 0) {
    items = items.filter((i) => i.productoId !== productoId);
  } else {
    const idx = items.findIndex((i) => i.productoId === productoId);
    if (idx >= 0) {
      const linea = items[idx];
      items[idx] = { ...linea, cantidad };
    }
  }
  write(items);
}

export function quitarLinea(productoId: number): void {
  write(read().filter((i) => i.productoId !== productoId));
}

export function vaciarCarrito(): void {
  write([]);
}

export function totalCarrito(): number {
  return read().reduce((s, i) => s + i.precio * i.cantidad, 0);
}
