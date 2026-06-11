export type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO";
export type FormaPago = "TARJETA" | "TRANSFERENCIA" | "EFECTIVO";

export interface LineaPedido {
  readonly productoId: number;
  readonly nombre: string;
  readonly precio: number;
  readonly cantidad: number;
  readonly imagen?: string;
}

export interface Pedido {
  readonly id: string;
  readonly fecha: string;
  readonly items: readonly LineaPedido[];
  readonly total: number;
  readonly estado: EstadoPedido;
  readonly formaPago: FormaPago;
  readonly userId: string;
  readonly userEmail: string;
}
