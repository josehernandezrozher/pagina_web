export type ProductCategory = "credito" | "seguro" | "servicio";
export type ProductStatus = "disponible" | "proximamente" | "pausado";

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductStep {
  step: number;
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

/** Tabla de referencia de dos columnas (p. ej. edad -> plazo máximo). */
export interface ProductInfoTable {
  title: string;
  headers: [string, string];
  rows: [string, string][];
  /** Aclaración al pie de la tabla */
  note?: string;
}

export interface ProductSeo {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  /** Frase corta para tarjetas de listado */
  shortDescription: string;
  /** Texto principal del hero de producto */
  description: string;
  /** Imagen principal (miniatura en listados y cabecera en su página) */
  image?: string;
  /** Imágenes adicionales del producto */
  gallery?: { src: string; caption?: string }[];
  /** true = mostrar la galería con la imagen completa (object-contain), p. ej. tarjetas */
  galleryContain?: boolean;
  /** Si aparece en "Productos destacados" de la home */
  featured?: boolean;
  /** ¿A quién va dirigido? Omitir si no aplica */
  audience?: string;
  benefits: string[];
  features: ProductFeature[];
  /** Tablas de referencia que se muestran bajo las características */
  infoTables?: ProductInfoTable[];
  /** Documentos/condiciones — solo con confirmación oficial de Rozher */
  requirements: string[];
  howItWorks: ProductStep[];
  faqs: ProductFaq[];
  cta: {
    label: string;
    whatsappMessage: string;
  };
  status: ProductStatus;
  seo: ProductSeo;
}
