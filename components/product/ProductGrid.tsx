import type { Product } from "@/lib/products/types";
import { ProductCard } from "./ProductCard";

/**
 * Cuadrícula de tarjetas: 3 columnas en escritorio, 2 en tableta, 1 en móvil.
 * Las filas incompletas se centran (p. ej. 2 tarjetas quedan al centro).
 */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-card text-[var(--color-ink)]">
        Todavía no hay productos publicados en esta categoría.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-[var(--card-gap)]">
      {products.map((product) => (
        <div
          key={product.id}
          className="w-full md:w-[calc((100%-var(--card-gap))/2)] lg:w-[calc((100%-2*var(--card-gap))/3)]"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
