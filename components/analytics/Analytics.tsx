"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { GTM_ENABLED, META_PIXEL_DIRECT } from "@/lib/site";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";

/**
 * Seguimiento de navegación y, solo en modo "Pixel directo", carga del Pixel.
 *
 * - Modo GTM: el contenedor se carga en <head> (app/layout.tsx). Aquí solo se publica
 *   `page_view` en cada cambio de ruta (el App Router no recarga la página).
 * - Modo Pixel directo: el PageView inicial va dentro del snippet; en la navegación
 *   entre páginas se dispara aquí.
 * - Sin ninguno de los dos, no hace nada.
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (GTM_ENABLED) {
      trackEvent({ name: "page_view", path: pathname });
      return;
    }
    if (META_PIXEL_DIRECT) {
      if (first.current) {
        first.current = false;
        return;
      }
      window.fbq?.("track", "PageView");
    }
  }, [pathname]);

  if (!META_PIXEL_DIRECT) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
`}
    </Script>
  );
}
