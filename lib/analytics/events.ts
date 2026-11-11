import { GTM_ENABLED, META_PIXEL_DIRECT } from "@/lib/site";
import { newEventId } from "@/lib/utils/id";

/**
 * Capa central de eventos. Un solo punto de definición evita que cada
 * componente invente su propio nombre de evento o payload.
 *
 * DOS MODOS (excluyentes, ver docs/medicion-gtm-ga4-meta.md):
 *  1. GTM (recomendado): cada evento se publica en window.dataLayer y GTM decide
 *     a qué herramienta va (GA4, Pixel de Meta, API de Conversiones vía servidor).
 *  2. Pixel directo: sin GTM, solo si hay NEXT_PUBLIC_META_PIXEL_ID. Se llama a fbq().
 *
 * Privacidad: a ninguna herramienta se envían nombre, teléfono, correo ni comentarios
 * del visitante; solo el producto y un identificador de evento.
 */
export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "product_view"; productSlug: string; productName?: string }
  | { name: "cta_click"; intent: "info" | "consideration" | "conversion"; label: string; productSlug?: string }
  | { name: "whatsapp_click"; productSlug?: string }
  | { name: "phone_click" }
  | { name: "email_click" }
  | { name: "faq_open"; question: string; productSlug?: string }
  | { name: "form_start"; productSlug?: string }
  | { name: "form_submit"; productSlug?: string; productName?: string; eventId?: string };

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    dataLayer?: Record<string, unknown>[];
  }
}


/* ------------------------------------------------------------------ */
/* Modo 1: GTM (dataLayer)                                             */
/* ------------------------------------------------------------------ */

/**
 * El dataLayer de GTM CONSERVA los valores de pushes anteriores (modelo de datos
 * persistente). Para que, p. ej., product_slug de una página no "se pegue" a eventos
 * de otra, cada push lleva TODAS las claves, con `undefined` donde no aplican
 * (en GTM, undefined borra el valor anterior).
 */
const RESET_KEYS = {
  event_id: undefined,
  page_path: undefined,
  page_location: undefined,
  page_title: undefined,
  product_slug: undefined,
  product_name: undefined,
  content_name: undefined,
  content_category: undefined,
  content_ids: undefined,
  items: undefined,
  contact_method: undefined,
  cta_intent: undefined,
  cta_label: undefined,
  faq_question: undefined,
} as const;

function toDataLayer(event: AnalyticsEvent): Record<string, unknown> | null {
  switch (event.name) {
    case "page_view":
      return {
        event: "page_view",
        page_path: event.path,
        page_location: window.location.href,
        page_title: document.title,
      };
    case "product_view": {
      const name = event.productName ?? event.productSlug;
      return {
        event: "view_item",
        product_slug: event.productSlug,
        product_name: name,
        content_name: name,
        content_category: "producto",
        content_ids: [event.productSlug],
        items: [{ item_id: event.productSlug, item_name: name, item_category: "producto" }],
      };
    }
    case "form_submit":
      return {
        event: "generate_lead",
        product_slug: event.productSlug,
        product_name: event.productName,
        content_name: event.productName ?? event.productSlug,
        content_category: "producto",
      };
    case "whatsapp_click":
      return { event: "contact", contact_method: "whatsapp", product_slug: event.productSlug };
    case "phone_click":
      return { event: "contact", contact_method: "phone" };
    case "email_click":
      return { event: "contact", contact_method: "email" };
    case "form_start":
      return { event: "form_start", product_slug: event.productSlug };
    case "cta_click":
      return {
        event: "cta_click",
        cta_intent: event.intent,
        cta_label: event.label,
        product_slug: event.productSlug,
      };
    case "faq_open":
      return {
        event: "faq_open",
        faq_question: event.question.slice(0, 100), // GA4 limita los parámetros a 100 caracteres
        product_slug: event.productSlug,
      };
    default:
      return null;
  }
}

function pushToDataLayer(event: AnalyticsEvent, eventId: string) {
  if (typeof window === "undefined") return;
  const payload = toDataLayer(event);
  if (!payload) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...RESET_KEYS, ...payload, event_id: eventId });
}

/* ------------------------------------------------------------------ */
/* Modo 2: Pixel directo (sin GTM)                                     */
/* ------------------------------------------------------------------ */

/**
 * El script del Pixel se carga después de hidratar (afterInteractive), pero
 * algunos eventos (p. ej. product_view) se disparan justo al hidratar. Si el
 * Pixel aún no existe, el evento espera en cola hasta que esté listo
 * (máx. ~10 s) en lugar de perderse.
 */
const pending: AnalyticsEvent[] = [];
let waiter: ReturnType<typeof setInterval> | null = null;

function dispatchToMeta(event: AnalyticsEvent) {
  const fbq = window.fbq as Fbq;

  switch (event.name) {
    case "product_view":
      fbq("track", "ViewContent", {
        content_name: event.productName ?? event.productSlug,
        content_category: "producto",
      });
      break;
    case "form_submit":
      fbq(
        "track",
        "Lead",
        { content_name: event.productName ?? event.productSlug },
        event.eventId ? { eventID: event.eventId } : undefined
      );
      break;
    case "whatsapp_click":
    case "phone_click":
    case "email_click":
      fbq("track", "Contact", { content_name: "productSlug" in event ? event.productSlug : undefined });
      break;
    case "form_start":
      fbq("trackCustom", "FormStart", { content_name: event.productSlug });
      break;
    default:
      // page_view lo dispara Analytics en cada cambio de ruta; cta_click y
      // faq_open no se envían a Meta para evitar ruido (y texto libre).
      break;
  }
}

function sendToMeta(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    dispatchToMeta(event);
    return;
  }

  pending.push(event);
  if (waiter) return;
  let tries = 0;
  waiter = setInterval(() => {
    tries += 1;
    if (typeof window.fbq === "function") {
      while (pending.length) dispatchToMeta(pending.shift() as AnalyticsEvent);
    }
    if (typeof window.fbq === "function" || tries >= 50) {
      pending.length = 0;
      if (waiter) clearInterval(waiter);
      waiter = null;
    }
  }, 200);
}

/* ------------------------------------------------------------------ */

export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }

  if (GTM_ENABLED) {
    // El mismo ID viaja a Meta por el navegador (Pixel) y por el servidor (API de
    // Conversiones), y así Meta deduplica. Para el Lead, es el mismo ID que se guarda en la hoja.
    const eventId = event.name === "form_submit" && event.eventId ? event.eventId : newEventId();
    pushToDataLayer(event, eventId);
  }

  if (META_PIXEL_DIRECT) sendToMeta(event);
}
