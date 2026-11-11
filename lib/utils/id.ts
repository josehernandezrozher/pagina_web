/**
 * Identificador único (UUID v4) que funciona en CUALQUIER contexto del navegador.
 *
 * `crypto.randomUUID()` solo existe en contextos seguros (HTTPS o localhost). Al probar el
 * sitio por HTTP desde otra máquina (http://192.168.x.x:3000) no existe, y llamarlo sin
 * protección rompe el formulario en silencio. `crypto.getRandomValues` sí está disponible
 * en todos los contextos, así que se usa como respaldo.
 */
export function newEventId(): string {
  const c: Crypto | undefined = typeof crypto !== "undefined" ? crypto : undefined;

  if (c && typeof c.randomUUID === "function") return c.randomUUID();

  if (c && typeof c.getRandomValues === "function") {
    const b = c.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // versión 4
    b[8] = (b[8] & 0x3f) | 0x80; // variante RFC 4122
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
