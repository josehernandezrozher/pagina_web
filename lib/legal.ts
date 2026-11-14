import { PENDING_INFO } from "@/lib/products/pending";

/**
 * DATOS LEGALES DE LA EMPRESA — ÚNICO LUGAR DONDE SE CAPTURAN.
 *
 * Los campos con PENDING_INFO aparecen en el sitio como "Información pendiente
 * de confirmar". Para completarlos, reemplaza PENDING_INFO por el texto real
 * (entre comillas) y guarda. Se actualizan solos el aviso de privacidad, los
 * términos, la página de datos legales y el pie de página.
 *
 * NUNCA los rellenes con valores de ejemplo.
 */
export const LEGAL = {
  /** Nombre comercial */
  brand: "Rozher Servicios Financieros",
  /** Razón social completa, tal como aparece en el acta constitutiva / RFC */
  legalName: "Rozher Agente de Seguros y de Fianzas",
  /** Domicilio completo del responsable (calle, número, colonia, C.P., ciudad, estado) */
  address: "Lauro Villar, 1004, Alianza, 87410, H. Matamoros, Tamaulipas",
  /** Correo para ejercer derechos ARCO y asuntos de privacidad */
  privacyEmail: "jose.hernandez@rozherseguros.com",
  /** Registros, autorizaciones o inscripciones regulatorias que apliquen (si aplican) */
  regulatoryRegistrations: "Agente de seguros y de fianzas persona moral autorizado por la Comisión Nacional de Seguros y Fianzas (CNSF).",
  /** Unidad o canal de atención de quejas y aclaraciones de usuarios */
  complaintsUnit: "jose.hernandez@rozherseguros.com",
  /** Ciudad cuyos tribunales serán competentes (para los términos y condiciones) */
  jurisdictionCity: "H. Matamoros, Tam.",

  /** Fechas de última actualización de los documentos */
  privacyUpdated: "noviembre de 2026",
  termsUpdated: "noviembre de 2026",
} as const;
