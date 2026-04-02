import type { Rol } from "./Rol.js";

export interface Usuario {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly rol: Rol;
}

export interface Sesion {
  readonly userId: string;
  readonly email: string;
  readonly rol: Rol;
}

export interface Producto {
  readonly id: number;
  readonly nombre: string;
  readonly descripcion: string;
  readonly precio: number;
  readonly imagen: string;
  readonly categoria: string;
}

export type AuthErrorCode =
  | "email_invalido"
  | "password_corta"
  | "email_en_uso"
  | "credenciales_invalidas"
  | "confirmacion_distinta";

export type AuthResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly code: AuthErrorCode;
      readonly message: string;
    };
