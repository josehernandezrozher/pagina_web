import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAvailableProductBySlug, getAvailableProducts } from "@/lib/products/data";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RequirementsList } from "@/components/product/RequirementsList";
import { HowProductWorks } from "@/components/product/HowProductWorks";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { LeadForm } from "@/components/forms/LeadForm";
import { LegalNotice } from "@/components/product/LegalNotice";
import { ProductViewTracker } from "@/components/analytics/ProductViewTracker";

export function generateStaticParams() {
  return getAvailableProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getAvailableProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seo.title,
    description: product.seo.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getAvailableProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ProductViewTracker productSlug={product.slug} productName={product.name} />
      <ProductHero product={product} />
      <ProductBenefits benefits={product.benefits} />
      <ProductFeatures features={product.features} infoTables={product.infoTables} />
      {product.gallery && (
        <div className="pt-16 sm:pt-20">
          <ProductGallery gallery={product.gallery} contain={product.galleryContain} />
        </div>
      )}
      <RequirementsList requirements={product.requirements} />
      <HowProductWorks steps={product.howItWorks} />
      <FAQAccordion faqs={product.faqs} productSlug={product.slug} />
      <LeadForm productSlug={product.slug} productName={product.name} />
      <LegalNotice />
    </>
  );
}
