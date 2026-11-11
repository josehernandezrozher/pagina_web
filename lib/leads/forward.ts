import type { LeadInput } from "@/lib/validation/schemas";

export type ForwardResult = "sent" | "not-configured" | "failed";

/**
 * Envía el lead al destino configurado. Solo se ejecuta en el servidor:
 * la URL y el secreto NUNCA llevan prefijo NEXT_PUBLIC_.
 *
 * Destino actual: Google Sheets mediante un Google Apps Script publicado como
 * aplicación web (ver docs/google-sheets/Code.gs y la sección 7 del README).
 *
 * CONTRATO con el destino: debe responder JSON `{"ok":true}`. Cualquier otra
 * respuesta (error, página HTML de inicio de sesión de Google, JSON con
 * ok:false) se trata como fallo para no dar por enviado un lead que se perdió.
 *
 * El secreto viaja en el cuerpo (Apps Script no puede leer headers) y no en un
 * header, porque Google redirige la petición a otro dominio.
 */
export async function forwardLead(lead: LeadInput, productName: string): Promise<ForwardResult> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return "not-configured";

  const payload = {
    secret: process.env.LEADS_WEBHOOK_SECRET?.trim() ?? "",
    name: lead.name,
    phone: lead.phone,
    email: lead.email || null,
    productSlug: lead.productSlug,
    productName,
    comments: lead.comments || null,
    eventId: lead.eventId ?? null,
    source: "web-rozher",
    receivedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!res.ok) return "failed";
    const data: unknown = await res.json().catch(() => null);
    const ok = typeof data === "object" && data !== null && (data as { ok?: unknown }).ok === true;
    return ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
