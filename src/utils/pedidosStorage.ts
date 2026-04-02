import type { LineaPedido, Pedido } from "../types/tienda.js";

const KEY = "foodstore_pedidos_v1";

function read(): Pedido[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: Pedido[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (
        typeof o.id === "string" &&
        typeof o.fecha === "string" &&
        typeof o.total === "number" &&
        Array.isArray(o.items)
      ) {
        const items: LineaPedido[] = [];
        for (const it of o.items) {
          if (!it || typeof it !== "object") continue;
          const x = it as Record<string, unknown>;
          if (
            typeof x.productoId === "number" &&
            typeof x.nombre === "string" &&
            typeof x.precio === "number" &&
            typeof x.cantidad === "number"
          ) {
            items.push({
              productoId: x.productoId,
              nombre: x.nombre,
              precio: x.precio,
              cantidad: x.cantidad,
            });
          }
        }
        out.push({ id: o.id, fecha: o.fecha, items, total: o.total });
      }
    }
    return out;
  } catch {
    return [];
  }
}

function write(pedidos: readonly Pedido[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(pedidos));
  } catch {
    // ignore
  }
}

export function getPedidos(): Pedido[] {
  return read();
}

export function registrarPedido(items: readonly LineaPedido[]): Pedido {
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const pedido: Pedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    items: [...items],
    total,
  };
  write([pedido, ...read()]);
  return pedido;
}
