import type { EstadoPedido, FormaPago, LineaPedido, Pedido } from "../types/tienda.js";

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
              imagen: typeof x.imagen === "string" ? x.imagen : undefined,
            });
          }
        }

        const estado: EstadoPedido =
          o.estado === "PENDIENTE" ||
          o.estado === "CONFIRMADO" ||
          o.estado === "TERMINADO" ||
          o.estado === "CANCELADO"
            ? (o.estado as EstadoPedido)
            : "PENDIENTE";

        const formaPago: FormaPago =
          o.formaPago === "TARJETA" ||
          o.formaPago === "TRANSFERENCIA" ||
          o.formaPago === "EFECTIVO"
            ? (o.formaPago as FormaPago)
            : "EFECTIVO";

        out.push({
          id: o.id,
          fecha: o.fecha,
          items,
          total: o.total,
          estado,
          formaPago,
          userId: typeof o.userId === "string" ? o.userId : "",
          userEmail: typeof o.userEmail === "string" ? o.userEmail : "",
        });
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

export function getPedidosDeUsuario(userId: string): Pedido[] {
  return read().filter((p) => p.userId === userId);
}

export function registrarPedido(
  items: readonly LineaPedido[],
  formaPago: FormaPago,
  userId: string,
  userEmail: string,
): Pedido {
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const pedido: Pedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    items: [...items],
    total,
    estado: "PENDIENTE",
    formaPago,
    userId,
    userEmail,
  };
  write([pedido, ...read()]);
  return pedido;
}

export function actualizarEstadoPedido(id: string, estado: EstadoPedido): boolean {
  const todos = read();
  const idx = todos.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  const updated = [...todos];
  updated[idx] = { ...updated[idx], estado };
  write(updated);
  return true;
}
