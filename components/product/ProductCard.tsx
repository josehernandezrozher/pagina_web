import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products/types";

const STATUS_LABEL: Record<Product["status"], string | null> = {
  disponible: null,
  proximamente: "Próximamente",
  pausado: "No disponible por ahora",
};

/**
 * Tarjeta blanca de esquinas amplias (24 px a 1536 px): imagen arriba, título,
 * texto y flecha azul. Proporciones medidas sobre la referencia.
 */
const BASE =
  "group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-card)]";

export function ProductCard({ product }: { product: Product }) {
  const statusLabel = STATUS_LABEL[product.status];
  const available = product.status === "disponible";

  const content = (
    <>
      {product.image && (
        <div className="relative aspect-[441/282] overflow-hidden bg-[var(--color-paper)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover ${
              available ? "transition-transform duration-300 group-hover:scale-[1.03]" : "opacity-80"
            }`}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col px-[clamp(1.5rem,3.9vw,4rem)] pt-[clamp(1.5rem,3.25vw,3.5rem)] pb-[clamp(1.5rem,3vw,3.25rem)]">
        {statusLabel && (
          <span className="mb-3 w-fit rounded-full bg-[var(--color-paper)] px-3 py-1 text-sm font-semibold text-[var(--color-ink-soft)]">
            {statusLabel}
          </span>
        )}

        <h3 className="text-card-title font-bold text-[var(--color-ink)]">{product.name}</h3>
        <p className="mt-[clamp(0.75rem,1vw,1.25rem)] flex-1 text-card text-[var(--color-ink)]">
          {product.shortDescription}
        </p>

        {available ? (
          <ArrowRight
            size={32}
            strokeWidth={1.5}
            className="mt-[clamp(1.25rem,2.2vw,2.5rem)] text-[var(--color-accent)] transition-transform group-hover:translate-x-1"
            aria-label="Conocer producto"
          />
        ) : (
          <span className="mt-[clamp(1.25rem,2.2vw,2.5rem)] text-card font-semibold text-[var(--color-ink-soft)]">
            Muy pronto
          </span>
        )}
      </div>
    </>
  );

  // Los productos que aún no están disponibles no enlazan a una página vacía.
  if (!available) return <div className={BASE}>{content}</div>;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className={`${BASE} transition-shadow hover:shadow-[var(--shadow-card-hover)]`}
    >
      {content}
    </Link>
  );
}
