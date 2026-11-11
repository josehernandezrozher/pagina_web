import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByCategory } from "@/lib/products/data";

export const metadata: Metadata = {
  title: "Créditos",
  description: "Conoce las opciones de crédito disponibles con la asesoría de Rozher Seguros.",
};

export default function ProductosPage() {
  const products = getProductsByCategory("credito");

  return (
    <Container className="py-[var(--section-y)]">
      <h1 className="section-title">Créditos</h1>
      <p className="mx-auto mt-[clamp(0.75rem,1.2vw,1.5rem)] max-w-[52rem] text-center text-card text-[var(--color-ink)]">
        Estas son las opciones disponibles hoy. Si no ves lo que buscas,
        escríbenos y te ayudamos a encontrarlo.
      </p>
      <div className="mt-[clamp(1.5rem,3.3vw,3.5rem)]">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}
