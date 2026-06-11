import type { Producto } from "../types/IUser.js";
import { productosSeed } from "../data/productos.js";

const KEY = "foodstore_productos_v1";

function read(): Producto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedAndReturn();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedAndReturn();
    const out: Producto[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (
        typeof o.id === "number" &&
        typeof o.nombre === "string" &&
        typeof o.precio === "number"
      ) {
        out.push({
          id: o.id,
          nombre: o.nombre,
          descripcion: typeof o.descripcion === "string" ? o.descripcion : "",
          precio: o.precio,
          imagen: typeof o.imagen === "string" ? o.imagen : "",
          categoria: typeof o.categoria === "string" ? o.categoria : "",
          categoriaId: typeof o.categoriaId === "number" ? o.categoriaId : 0,
          stock: typeof o.stock === "number" ? o.stock : 0,
          disponible: o.disponible !== false,
          eliminado: o.eliminado === true,
        });
      }
    }
    return out.length > 0 ? out : seedAndReturn();
  } catch {
    return seedAndReturn();
  }
}

function seedAndReturn(): Producto[] {
  const data = productosSeed.map((p) => ({ ...p, eliminado: false }));
  write(data);
  return data;
}

function write(productos: readonly Producto[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(productos));
  } catch {
    // ignore
  }
}

function nextId(productos: readonly Producto[]): number {
  return productos.length > 0
    ? Math.max(...productos.map((p) => p.id)) + 1
    : 1;
}

export function getProductos(): Producto[] {
  return read().filter((p) => !p.eliminado);
}

export function getTodosProductos(): Producto[] {
  return read();
}

export function getProductoById(id: number): Producto | undefined {
  return read().find((p) => p.id === id && !p.eliminado);
}

export function crearProducto(data: Omit<Producto, "id" | "eliminado">): Producto {
  const todos = read();
  const nuevo: Producto = { ...data, id: nextId(todos), eliminado: false };
  write([...todos, nuevo]);
  return nuevo;
}

export function actualizarProducto(
  id: number,
  cambios: Partial<Omit<Producto, "id" | "eliminado">>,
): boolean {
  const todos = read();
  const idx = todos.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  const updated = [...todos];
  updated[idx] = { ...updated[idx], ...cambios };
  write(updated);
  return true;
}

export function eliminarProducto(id: number): boolean {
  const todos = read();
  const idx = todos.findIndex((p) => p.id === id);
  if (idx < 0 || todos[idx].eliminado) return false;
  const updated = [...todos];
  updated[idx] = { ...updated[idx], eliminado: true };
  write(updated);
  return true;
}
