import { Container } from "@/components/shared/Container";
import { Lock, FileCheck2, UserCheck } from "lucide-react";

/**
 * Sección de confianza basada en hechos verificables sobre el proceso
 * (no en cifras, premios o alianzas no confirmadas — ver reglas de datos).
 */
const POINTS = [
  { icon: FileCheck2, text: "Te explicamos por escrito las condiciones antes de que decidas." },
  { icon: UserCheck, text: "Tu proceso lo sigue una persona, no un sistema anónimo." },
  { icon: Lock, text: "Tus datos se tratan conforme a nuestro aviso de privacidad." },
];

export function TrustSection() {
  return (
    <section className="bg-[var(--color-paper)] pb-[var(--section-y)]">
      <Container>
        <div className="grid grid-cols-1 gap-[clamp(1.5rem,3vw,3.5rem)] rounded-[var(--radius-lg)] bg-white px-[clamp(1.5rem,3.9vw,4rem)] py-[clamp(1.75rem,3.25vw,3.5rem)] shadow-[var(--shadow-card)] md:grid-cols-3">
          {POINTS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4">
              <Icon className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={32} strokeWidth={1.5} />
              <p className="text-card text-[var(--color-ink)]">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
