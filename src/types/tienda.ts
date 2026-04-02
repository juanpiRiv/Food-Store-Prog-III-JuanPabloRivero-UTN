export interface LineaPedido {
  readonly productoId: number;
  readonly nombre: string;
  readonly precio: number;
  readonly cantidad: number;
}

export interface Pedido {
  readonly id: string;
  readonly fecha: string;
  readonly items: readonly LineaPedido[];
  readonly total: number;
}
