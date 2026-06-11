import type { Categoria } from "../types/IUser.js";
import { categoriasSeed } from "../data/categorias.js";

const KEY = "foodstore_categorias_v1";

function read(): Categoria[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedAndReturn();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedAndReturn();
    const out: Categoria[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (typeof o.id === "number" && typeof o.nombre === "string") {
        out.push({
          id: o.id,
          nombre: o.nombre,
          descripcion: typeof o.descripcion === "string" ? o.descripcion : "",
          eliminado: o.eliminado === true,
        });
      }
    }
    return out.length > 0 ? out : seedAndReturn();
  } catch {
    return seedAndReturn();
  }
}

function seedAndReturn(): Categoria[] {
  const data = categoriasSeed.map((c) => ({ ...c, eliminado: false }));
  write(data);
  return data;
}

function write(categorias: readonly Categoria[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(categorias));
  } catch {
    // ignore
  }
}

function nextId(categorias: readonly Categoria[]): number {
  return categorias.length > 0
    ? Math.max(...categorias.map((c) => c.id)) + 1
    : 1;
}

export function getCategorias(): Categoria[] {
  return read().filter((c) => !c.eliminado);
}

export function getTodasCategorias(): Categoria[] {
  return read();
}

export function crearCategoria(nombre: string, descripcion: string): Categoria {
  const todas = read();
  const nueva: Categoria = {
    id: nextId(todas),
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    eliminado: false,
  };
  write([...todas, nueva]);
  return nueva;
}

export function actualizarCategoria(
  id: number,
  nombre: string,
  descripcion: string,
): boolean {
  const todas = read();
  const idx = todas.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  const updated = [...todas];
  updated[idx] = { ...updated[idx], nombre: nombre.trim(), descripcion: descripcion.trim() };
  write(updated);
  return true;
}

export function eliminarCategoria(id: number): boolean {
  const todas = read();
  const idx = todas.findIndex((c) => c.id === id);
  if (idx < 0 || todas[idx].eliminado) return false;
  const updated = [...todas];
  updated[idx] = { ...updated[idx], eliminado: true };
  write(updated);
  return true;
}
