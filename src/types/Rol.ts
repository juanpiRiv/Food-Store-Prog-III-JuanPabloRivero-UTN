export type Rol = "client" | "admin";

export function isRol(value: string): value is Rol {
  return value === "client" || value === "admin";
}
