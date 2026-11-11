import { WHATSAPP_NUMBER } from "@/lib/contact";

/**
 * Construye un link de WhatsApp con mensaje contextual por producto.
 * El número se define en lib/contact.ts.
 */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
