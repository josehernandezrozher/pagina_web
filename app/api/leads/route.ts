import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/schemas";
import { getAvailableProductBySlug } from "@/lib/products/data";
import { forwardLead } from "@/lib/leads/forward";
import {
  getClientIp,
  isJson,
  isRateLimited,
  isSameOrigin,
  readBodyLimited,
} from "@/lib/security/request-guards";

/**
 * Recepción de leads.
 * Capas de protección (en orden): origen -> content-type -> rate limit ->
 * tamaño -> JSON -> validación estricta -> honeypot -> producto conocido ->
 * envío al destino (Google Sheets). No se registran datos personales en logs.
 */
const NO_STORE = { "Cache-Control": "no-store" };

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return fail(403, "Origen no permitido.");
  if (!isJson(request)) return fail(415, "Formato no soportado.");
  if (isRateLimited(getClientIp(request))) return fail(429, "Demasiados intentos. Intenta más tarde.");

  const raw = await readBodyLimited(request);
  if (raw === null) return fail(413, "Solicitud demasiado grande.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "JSON inválido.");
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return fail(422, "Datos inválidos.");

  const lead = parsed.data;

  // Honeypot: respondemos "ok" para no darle pistas al bot, pero no enviamos nada.
  if (lead.website) return NextResponse.json({ ok: true }, { headers: NO_STORE });

  // El producto debe existir y estar disponible (o ser el formulario general de contacto).
  const product = getAvailableProductBySlug(lead.productSlug);
  if (lead.productSlug !== "contacto-general" && !product) {
    return fail(422, "Datos inválidos.");
  }

  const result = await forwardLead(lead, product?.name ?? "Contacto general");

  if (result === "sent") return NextResponse.json({ ok: true }, { headers: NO_STORE });

  if (result === "not-configured") {
    if (process.env.NODE_ENV !== "production") {
      // Desarrollo: confirmamos recepción sin imprimir datos personales.
      console.info("[leads] recibido (dev, LEADS_WEBHOOK_URL sin configurar):", lead.productSlug);
      return NextResponse.json({ ok: true }, { headers: NO_STORE });
    }
    // Producción: nunca fingir éxito si el lead se perdería.
    console.error("[leads] LEADS_WEBHOOK_URL no está configurada. Lead NO enviado.");
    return fail(503, "Servicio no disponible.");
  }

  console.error("[leads] Falló el envío del lead a Google Sheets.");
  return fail(502, "No se pudo enviar la solicitud.");
}
