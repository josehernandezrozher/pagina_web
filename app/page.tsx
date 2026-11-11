import { HeroSlider } from "@/components/sections/HeroSlider";
import { WhyRozher } from "@/components/sections/WhyRozher";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TrustSection } from "@/components/sections/TrustSection";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/shared/Container";
import { getAvailableProducts, getFeaturedProducts } from "@/lib/products/data";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const available = getAvailableProducts();

  return (
    <>
      <HeroSlider
        availableSlugs={available.map((p) => p.slug)}
        availableCategories={Array.from(new Set(available.map((p) => p.category)))}
      />

      <section className="bg-[var(--color-paper)] py-[var(--section-y)]">
        <Container className="px-[clamp(1.25rem,3.9vw,4.75rem)]">
          <h2 className="section-title mb-[clamp(1.25rem,1.3vw,1.75rem)]">Productos destacados</h2>
          <ProductGrid products={featured} />
        </Container>
      </section>

      <WhyRozher />
      <HowItWorks />
      <TrustSection />
    </>
  );
}
