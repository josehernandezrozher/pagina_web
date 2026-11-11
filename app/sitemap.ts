import type { MetadataRoute } from "next";
import { getAvailableProducts } from "@/lib/products/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/productos", "/seguros", "/nosotros", "/contacto", "/privacidad", "/terminos", "/datos-legales"];
  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...getAvailableProducts().map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
