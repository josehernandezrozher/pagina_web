/**
 * Marcador explícito para cualquier dato aún no confirmado por Rozher Seguros.
 * Nunca se debe reemplazar por un valor inventado "de ejemplo" — los componentes
 * que reciben este valor lo muestran con un tratamiento visual distinto
 * (ver <Pending />) para que sea imposible confundirlo con contenido real.
 */
export const PENDING_INFO = "[INFORMACIÓN PENDIENTE]";

export function isPending(value?: string | null): boolean {
  return !value || value.trim() === PENDING_INFO;
}
