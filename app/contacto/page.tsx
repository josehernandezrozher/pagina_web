import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { LeadForm } from "@/components/forms/LeadForm";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a un asesor de Rozher Seguros por WhatsApp o déjanos tus datos y te contactamos.",
};

export default function ContactoPage() {
  return (
    <Container className="py-16 sm:py-20 lg:py-24">
      <h1 className="text-display font-bold text-[var(--color-ink)]">
        Contacto
      </h1>
      <p className="mt-4 max-w-xl text-card text-[var(--color-ink)]">
        Elige el canal que prefieras. Un asesor de Rozher Seguros te
        responderá directamente.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <WhatsAppButton message="Hola, quiero información sobre los productos de Rozher Seguros.">
          Escribir por WhatsApp
        </WhatsAppButton>
      </div>
      <p className="mt-3 text-sm text-[var(--color-ink-soft)]">WhatsApp: {WHATSAPP_DISPLAY}</p>

      <div className="mt-6 -mx-5 sm:mx-0">
        <LeadForm productSlug="contacto-general" productName="Rozher Seguros" />
      </div>
    </Container>
  );
}
