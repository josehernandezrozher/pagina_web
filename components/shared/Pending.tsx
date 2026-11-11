import { isPending } from "@/lib/products/pending";

/**
 * Muestra de forma explícita cuando un dato aún no ha sido confirmado
 * por Rozher Seguros. Nunca oculta el hueco ni lo rellena con un valor
 * de ejemplo — así el equipo ve exactamente qué falta antes de publicar.
 */
export function Pending({ value }: { value?: string | null }) {
  if (!isPending(value)) {
    return <>{value}</>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-pending-bg)] px-2 py-0.5 text-sm font-medium text-[var(--color-pending)]">
      Información pendiente de confirmar
    </span>
  );
}
