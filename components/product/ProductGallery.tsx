import { Container } from "@/components/shared/Container";
import type { Product } from "@/lib/products/types";

/**
 * Galería de imágenes del producto. Todos los contenedores tienen proporción
 * fija (object-cover para fotos, object-contain para tarjetas), de modo que
 * cualquier imagen encaja sin romper las medidas de la página.
 */
export function ProductGallery({
  gallery,
  contain = false,
}: {
  gallery: NonNullable<Product["gallery"]>;
  contain?: boolean;
}) {
  if (!gallery || gallery.length === 0) return null;

  // Tarjetas / imágenes que deben verse completas
  if (contain) {
    return (
      <Container className="pb-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {gallery.map((g, i) => (
            <div key={i} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper)] p-6">
              <div className="flex aspect-[4/3] items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.caption ?? "Tarjeta"}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
              {g.caption && (
                <p className="mt-4 text-center font-semibold text-[var(--color-ink)]">
                  {g.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    );
  }

  // Una sola foto: mostrarla completa (sin recortar) en un marco 16:9
  if (gallery.length === 1) {
    return (
      <Container className="pb-4">
        <div className="mx-auto flex aspect-[16/9] max-w-4xl items-center justify-center overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-paper)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[0].src}
            alt={gallery[0].caption ?? ""}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </div>
      </Container>
    );
  }

  // Varias fotos: cuadrícula
  return (
    <Container className="pb-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((g, i) => (
          <div key={i} className="aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-paper)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.caption ?? ""}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
