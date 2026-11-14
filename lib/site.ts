/**
 * Constantes del sitio. Un solo lugar para URL pública y nombre de marca.
 * Orden de resolución de la URL:
 *   1. NEXT_PUBLIC_SITE_URL (dominio definitivo, p. ej. https://rozherseguros.com)
 *   2. VERCEL_URL (preview de Vercel, mientras no hay dominio)
 *   3. localhost (desarrollo)
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Rozher Servicios Financieros";
export const SITE_DESCRIPTION =
  "Rozher Seguros te asesora en productos de crédito y seguros, con acompañamiento de un asesor en cada paso.";

/**
 * true solo cuando el sitio está en producción real. Los previews de Vercel
 * (con contenido pendiente) no deben indexarse ni mostrarse en buscadores.
 */
export const IS_PRODUCTION_DEPLOY =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

/* ------------------------------------------------------------------ */
/* Medición (GTM, GA4, Meta). Ver docs/medicion-gtm-ga4-meta.md        */
/* ------------------------------------------------------------------ */

/** true cuando NEXT_PUBLIC_META_PIXEL_ID es un ID válido (solo dígitos). */
export const META_PIXEL_ENABLED = /^\d{5,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "");

/** ID del contenedor web de Google Tag Manager (formato GTM-XXXXXXX). Vacío = GTM apagado. */
const GTM_RAW = process.env.NEXT_PUBLIC_GTM_ID?.trim().toUpperCase() ?? "";
export const GTM_ID = /^GTM-[A-Z0-9]{4,10}$/.test(GTM_RAW) ? GTM_RAW : "";
export const GTM_ENABLED = GTM_ID !== "";

/**
 * Con GTM activo, el Pixel de Meta y GA4 se instalan DESDE GTM. Si además la página
 * cargara el Pixel por su cuenta, cada evento se contaría doble; por eso el Pixel
 * directo solo se usa cuando NO hay GTM.
 */
export const META_PIXEL_DIRECT = META_PIXEL_ENABLED && !GTM_ENABLED;

/**
 * Origen (https) del contenedor de GTM del lado del servidor, p. ej. https://sgtm.rozherseguros.com.
 * Solo se usa para permitirlo en la política de seguridad (CSP). Vacío si no aplica.
 */
function resolveSgtmOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SGTM_URL?.trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.protocol === "https:" ? u.origin : "";
  } catch {
    return "";
  }
}
export const SGTM_ORIGIN = resolveSgtmOrigin();

/** Token de verificación de dominio de Meta (método de etiqueta meta). Vacío = no se agrega. */
const DV_RAW = process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION?.trim() ?? "";
export const META_DOMAIN_VERIFICATION = /^[A-Za-z0-9]{20,64}$/.test(DV_RAW) ? DV_RAW : "";

/** true si hay alguna herramienta de medición/publicidad activa en el sitio. */
export const TRACKING_ENABLED = GTM_ENABLED || META_PIXEL_DIRECT;
