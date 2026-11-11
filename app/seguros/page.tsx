import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByCategory, isAvailable } from "@/lib/products/data";

export const metadata: Metadata = {
  title: "Seguros",
  description: "Productos de seguros disponibles con la asesoría de Rozher Seguros.",
};

export default function SegurosPage() {
  const products = getProductsByCategory("seguro");
  const anyAvailable = products.some(isAvailable);

  return (
    <Container className="py-[var(--section-y)]">
      <h1 className="section-title">Seguros</h1>
      <p className="mx-auto mt-[clamp(0.75rem,1.2vw,1.5rem)] max-w-[52rem] text-center text-card text-[var(--color-ink)]">
        {anyAvailable
          ? "Estas son las coberturas disponibles con la asesoría de Rozher Seguros. Escríbenos y te ayudamos a elegir la que se ajusta a lo que necesitas."
          : "Estamos preparando nuestra oferta de seguros. Mientras tanto, escríbenos y un asesor te orienta."}
      </p>
      <div className="mt-[clamp(1.5rem,3.3vw,3.5rem)]">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}
