/**
 * Canal de contacto oficial. El número de WhatsApp al que se redirige a los
 * visitantes es 55 8034 9931 (México). Puede sobrescribirse con la variable
 * NEXT_PUBLIC_WHATSAPP_NUMBER (formato internacional, solo dígitos).
 *
 * Nota: si el enlace de WhatsApp no abriera el chat, probar con el prefijo
 * móvil antiguo de México ("521" en lugar de "52").
 */
const DEFAULT_WHATSAPP_NUMBER = "525580349931";

export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "") || DEFAULT_WHATSAPP_NUMBER;

/** "55 8034 9931": últimos 10 dígitos con formato legible. */
export const WHATSAPP_DISPLAY = (() => {
  const d = WHATSAPP_NUMBER.slice(-10);
  return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
})();
