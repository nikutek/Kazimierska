import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getEnvOrThrow(name: "ADMIN_SESSION_SECRET" | "ADMIN_PASSWORD"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return toHex(signature);
}

export function getAdminPassword(): string {
  return getEnvOrThrow("ADMIN_PASSWORD");
}

export async function createAdminSessionToken(
  ttlSeconds = DEFAULT_TTL_SECONDS,
): Promise<string> {
  const secret = getEnvOrThrow("ADMIN_SESSION_SECRET");
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${expiresAt}`;
  const signature = await signValue(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  const secret = getEnvOrThrow("ADMIN_SESSION_SECRET");
  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const expectedSignature = await signValue(expiresAtRaw, secret);
  return signature === expectedSignature;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}
