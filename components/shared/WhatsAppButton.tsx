"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics/events";

export function WhatsAppButton({
  message,
  productSlug,
  variant = "solid",
  children,
}: {
  message: string;
  productSlug?: string;
  /** solid = verde WhatsApp · ghost = contorno verde · primary = azul de la marca */
  variant?: "solid" | "ghost" | "primary";
  children: React.ReactNode;
}) {
  const href = buildWhatsAppLink(message);

  const style =
    variant === "primary"
      ? "btn-primary"
      : variant === "solid"
        ? "bg-[var(--color-whatsapp)] text-white hover:bg-[var(--color-whatsapp-dark)]"
        : "border-2 border-[var(--color-whatsapp)] text-[var(--color-whatsapp-dark)] hover:bg-[var(--color-whatsapp)]/10";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent({ name: "whatsapp_click", productSlug })}
      className={`btn ${style}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.11-1.55a9.9 9.9 0 004.93 1.3h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.05c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09.99-2.37.25-.28.55-.35.74-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.8 2 .87 2.15.07.14.12.31.02.5-.1.19-.15.3-.29.46-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.14.46.12.63-.07.17-.19.72-.83.91-1.12.19-.28.38-.24.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.53.33.07.13.07.72-.17 1.4z" />
      </svg>
      {children}
    </a>
  );
}
