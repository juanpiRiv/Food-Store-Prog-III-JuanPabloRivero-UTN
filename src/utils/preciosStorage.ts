import type { Producto } from "../types/IUser.js";
import { productos as catalogoBase } from "../data/productos.js";

const KEY = "foodstore_precios_v1";

function readOverrides(): Map<number, number> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Map();
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return new Map();
    const m = new Map<number, number>();
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(k);
      if (!Number.isInteger(id) || id <= 0) continue;
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0) continue;
      m.set(id, Math.round(v));
    }
    return m;
  } catch {
    return new Map();
  }
}

function writeOverrides(m: Map<number, number>): void {
  const obj: Record<string, number> = {};
  for (const [id, precio] of m) {
    obj[String(id)] = precio;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch {
    /* ignore quota */
  }
}

/** Catálogo con precios guardados por el admin (o base si no hay override). */
export function aplicarPreciosABase(productosBase: readonly Producto[]): Producto[] {
  const overrides = readOverrides();
  return productosBase.map((p) => {
    const precio = overrides.has(p.id) ? overrides.get(p.id)! : p.precio;
    if (precio === p.precio) return p;
    return { ...p, precio };
  });
}

export function getPrecioEfectivo(productoId: number, precioBase: number): number {
  const overrides = readOverrides();
  return overrides.has(productoId) ? overrides.get(productoId)! : precioBase;
}

export function setPrecioProducto(productoId: number, precio: number): boolean {
  const base = catalogoBase.find((p) => p.id === productoId);
  if (!base) return false;
  if (!Number.isFinite(precio) || precio < 0) return false;
  const rounded = Math.round(precio);
  const overrides = readOverrides();
  if (rounded === base.precio) {
    overrides.delete(productoId);
  } else {
    overrides.set(productoId, rounded);
  }
  writeOverrides(overrides);
  return true;
}
