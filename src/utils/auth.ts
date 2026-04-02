import type { Rol } from "../types/Rol.js";
import { isRol } from "../types/Rol.js";
import type { AuthResult, Sesion, Usuario } from "../types/IUser.js";
import { ROUTES, navigate } from "./navigate.js";

const STORAGE_KEYS = {
  USERS: "foodstore_users_v1",
  SESSION: "foodstore_session_v1",
} as const;

const MIN_PASSWORD = 8;
const SEED_ADMIN_EMAIL = "admin@foodstore.local";
const SEED_ADMIN_PASSWORD = "admin123";

async function sha256Hex(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // quota / private mode
  }
}

function removeRaw(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function isUsuarioRecord(x: unknown): x is {
  id: string;
  email: string;
  passwordHash: string;
  rol: Rol;
} {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.passwordHash === "string" &&
    typeof o.rol === "string" &&
    isRol(o.rol)
  );
}

function loadUsers(): Usuario[] {
  const raw = readRaw(STORAGE_KEYS.USERS);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: Usuario[] = [];
    for (const item of parsed) {
      if (isUsuarioRecord(item)) {
        out.push({
          id: item.id,
          email: item.email,
          passwordHash: item.passwordHash,
          rol: item.rol,
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

function saveUsers(users: readonly Usuario[]): void {
  writeRaw(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function isSesionRecord(x: unknown): x is {
  userId: string;
  email: string;
  rol: Rol;
} {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.userId === "string" &&
    typeof o.email === "string" &&
    typeof o.rol === "string" &&
    isRol(o.rol)
  );
}

function loadSession(): Sesion | null {
  const raw = readRaw(STORAGE_KEYS.SESSION);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSesionRecord(parsed)) return null;
    return {
      userId: parsed.userId,
      email: parsed.email,
      rol: parsed.rol,
    };
  } catch {
    return null;
  }
}

function saveSession(session: Sesion): void {
  writeRaw(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearSession(): void {
  removeRaw(STORAGE_KEYS.SESSION);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function ensureSeedAdmin(): Promise<void> {
  const users = loadUsers();
  if (users.length > 0) return;
  const hash = await sha256Hex(SEED_ADMIN_PASSWORD);
  const admin: Usuario = {
    id: crypto.randomUUID(),
    email: SEED_ADMIN_EMAIL,
    passwordHash: hash,
    rol: "admin",
  };
  saveUsers([admin]);
}

export function getSession(): Sesion | null {
  return loadSession();
}

export function logout(): void {
  clearSession();
  navigate(ROUTES.login);
}

export function checkAuthUser(
  loginPath: string,
  otherRoleHomePath: string,
  requiredRole: Rol,
): boolean {
  const session = getSession();
  if (session === null) {
    navigate(loginPath);
    return false;
  }
  if (session.rol !== requiredRole) {
    navigate(otherRoleHomePath);
    return false;
  }
  return true;
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResult> {
  const em = normalizeEmail(email);
  if (!isValidEmail(em)) {
    return {
      ok: false,
      code: "email_invalido",
      message: "Ingresá un email válido.",
    };
  }
  if (password.length < MIN_PASSWORD) {
    return {
      ok: false,
      code: "password_corta",
      message: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`,
    };
  }
  if (password !== confirmPassword) {
    return {
      ok: false,
      code: "confirmacion_distinta",
      message: "Las contraseñas no coinciden.",
    };
  }
  await ensureSeedAdmin();
  const users = loadUsers();
  if (users.some((u) => u.email === em)) {
    return {
      ok: false,
      code: "email_en_uso",
      message: "Ese email ya está registrado.",
    };
  }
  const hash = await sha256Hex(password);
  const nuevo: Usuario = {
    id: crypto.randomUUID(),
    email: em,
    passwordHash: hash,
    rol: "client",
  };
  saveUsers([...users, nuevo]);
  const sesion: Sesion = {
    userId: nuevo.id,
    email: nuevo.email,
    rol: nuevo.rol,
  };
  saveSession(sesion);
  return { ok: true };
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const em = normalizeEmail(email);
  if (!isValidEmail(em)) {
    return {
      ok: false,
      code: "email_invalido",
      message: "Ingresá un email válido.",
    };
  }
  if (password.length < MIN_PASSWORD) {
    return {
      ok: false,
      code: "password_corta",
      message: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`,
    };
  }
  await ensureSeedAdmin();
  const users = loadUsers();
  const hash = await sha256Hex(password);
  const found = users.find((u) => u.email === em && u.passwordHash === hash);
  if (!found) {
    return {
      ok: false,
      code: "credenciales_invalidas",
      message: "Email o contraseña incorrectos.",
    };
  }
  const sesion: Sesion = {
    userId: found.id,
    email: found.email,
    rol: found.rol,
  };
  saveSession(sesion);
  return { ok: true };
}

export function redirectAfterAuth(rol: Sesion["rol"]): void {
  const dest = rol === "admin" ? ROUTES.adminHome : ROUTES.clientHome;
  navigate(dest);
}
