import path from "node:path";
import type { NextConfig } from "next";
import { GTM_ENABLED, META_PIXEL_DIRECT, SGTM_ORIGIN } from "./lib/site";

const isDev = process.env.NODE_ENV !== "production";

/**
 * ¿El sitio se sirve por HTTPS? Solo entonces se aplican `upgrade-insecure-requests` y HSTS.
 * Si se aplicaran en una prueba por HTTP (p. ej. http://192.168.1.10:3000 en la red local),
 * el navegador pediría los estilos y scripts por https://, el servidor no hablaría TLS y la
 * página se vería sin estilos ni funcionalidad. (En localhost el navegador lo exime, por eso
 * el problema solo aparece al entrar por IP.)
 *   - Vercel: la variable VERCEL existe durante la compilación.
 *   - Servidor propio con HTTPS: definir NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
 */
const servedOverHttps =
  Boolean(process.env.VERCEL) ||
  (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().toLowerCase().startsWith("https://");

/**
 * Content-Security-Policy.
 * - Next.js inyecta scripts inline para hidratar la app; por eso script-src
 *   lleva 'unsafe-inline'. (Usar nonces obligaría a renderizado dinámico y
 *   perderíamos las páginas estáticas.) El resto de la política sí es estricta.
 * - Los dominios de Meta y Google solo se permiten si hay medición activa
 *   (Pixel directo o GTM). Con GTM se permiten ambos porque el contenedor puede
 *   cargar GA4 y el Pixel de Meta.
 */
function buildCsp(): string {
  const meta = META_PIXEL_DIRECT || GTM_ENABLED;
  const google = GTM_ENABLED;
  const sgtm = SGTM_ORIGIN ? [SGTM_ORIGIN] : [];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      ...(meta ? ["https://connect.facebook.net"] : []),
      // tagmanager.google.com: necesario solo para la vista previa (Tag Assistant) de GTM
      ...(google ? ["https://*.googletagmanager.com", "https://tagmanager.google.com", ...sgtm] : []),
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      ...(google ? ["https://tagmanager.google.com", "https://fonts.googleapis.com"] : []),
    ],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      ...(meta ? ["https://www.facebook.com"] : []),
      ...(google
        ? [
            "https://*.google-analytics.com",
            "https://*.googletagmanager.com",
            "https://*.g.doubleclick.net",
            "https://ssl.gstatic.com",
            "https://www.gstatic.com",
            ...sgtm,
          ]
        : []),
    ],
    "font-src": ["'self'", "data:", ...(google ? ["https://fonts.gstatic.com"] : [])],
    "connect-src": [
      "'self'",
      ...(meta ? ["https://www.facebook.com", "https://connect.facebook.net"] : []),
      ...(google
        ? [
            "https://*.google-analytics.com",
            "https://*.analytics.google.com",
            "https://*.googletagmanager.com",
            "https://*.g.doubleclick.net",
            ...sgtm,
          ]
        : []),
    ],
    "frame-src": google ? ["https://www.googletagmanager.com"] : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(" ")}`);
  if (!isDev && servedOverHttps) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Con GTM activo se omite COOP: "same-origin" corta la conexión de la vista previa
  // (Tag Assistant) de GTM con la página y impide depurar el contenedor.
  // Solo por HTTPS: sin HTTPS el navegador la ignora y muestra un aviso en la consola.
  ...(GTM_ENABLED || !servedOverHttps ? [] : [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }]),
  // Sin includeSubDomains/preload a propósito: evita romper subdominios futuros.
  // Solo por HTTPS (los navegadores lo ignoran por HTTP, pero así la cabecera no engaña).
  ...(servedOverHttps ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Fija la raíz del proyecto. Evita la advertencia (y rutas mal inferidas) cuando existe
  // otro package-lock.json en una carpeta superior, p. ej. en la carpeta de usuario.
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
