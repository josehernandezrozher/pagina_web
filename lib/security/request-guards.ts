import type { NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/* Rate limit en memoria                                               */
/* ------------------------------------------------------------------ */
/**
 * Limitador simple por IP (ventana deslizante). IMPORTANTE: en Vercel cada
 * instancia serverless tiene su propia memoria, así que esto frena abuso
 * básico pero no es una garantía global. Para protección real activar
 * Vercel Firewall (Rate Limiting) o Upstash Ratelimit. Ver README.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Limpieza ocasional para que el Map no crezca sin límite.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/* ------------------------------------------------------------------ */
/* Validaciones de la petición                                         */
/* ------------------------------------------------------------------ */

/** Solo aceptamos peticiones del propio sitio (defensa contra CSRF/abuso cruzado). */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function isJson(request: NextRequest): boolean {
  return (request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}

export const MAX_BODY_BYTES = 8 * 1024;

/** Lee el cuerpo con tope de tamaño. Devuelve null si lo excede. */
export async function readBodyLimited(request: NextRequest): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return null;
  return text;
}
