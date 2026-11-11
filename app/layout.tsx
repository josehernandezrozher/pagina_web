import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/analytics/Analytics";
import {
  GTM_ENABLED,
  GTM_ID,
  IS_PRODUCTION_DEPLOY,
  META_DOMAIN_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rozher Seguros | Asesoría en créditos y seguros",
    template: "%s | Rozher Seguros",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE_NAME,
    title: "Rozher Seguros | Asesoría en créditos y seguros",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Rozher Seguros" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rozher Seguros | Asesoría en créditos y seguros",
    description: SITE_DESCRIPTION,
    images: ["/og-default.jpg"],
  },
  // Los previews de Vercel (contenido pendiente) no deben indexarse.
  robots: IS_PRODUCTION_DEPLOY ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
  // Verificación de dominio de Meta (método de etiqueta meta). Alternativa: registro TXT en el DNS.
  ...(META_DOMAIN_VERIFICATION
    ? { verification: { other: { "facebook-domain-verification": META_DOMAIN_VERIFICATION } } }
    : {}),
};

/**
 * Snippet oficial de Google Tag Manager. Va en <head> como script síncrono para que
 * `gtm.start` sea lo primero en el dataLayer, antes de nuestros eventos.
 * GTM_ID está validado (GTM-XXXX), así que es seguro insertarlo.
 */
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002A5C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {GTM_ENABLED && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
        </head>
      )}
      <body className="flex min-h-screen flex-col">
        {GTM_ENABLED && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
