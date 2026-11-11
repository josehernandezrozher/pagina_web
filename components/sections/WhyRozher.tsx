import { Container } from "@/components/shared/Container";
import { ShieldCheck, MessagesSquare, Compass } from "lucide-react";

const REASONS = [
  {
    icon: MessagesSquare,
    title: "Asesoría personal, no un formulario frío",
    description:
      "Cada consulta la atiende una persona que responde tus dudas antes de que decidas, no un sistema automático.",
  },
  {
    icon: ShieldCheck,
    title: "Transparencia sobre lo que sí y lo que no",
    description:
      "Te explicamos exactamente cómo funciona cada producto y qué papel juega Rozher Seguros en el proceso.",
  },
  {
    icon: Compass,
    title: "Te ayudamos a comparar, no solo a vender",
    description:
      "Nuestro trabajo es que entiendas tus opciones para que la decisión sea tuya, con información clara.",
  },
];

export function WhyRozher() {
  return (
    <section className="bg-[var(--color-paper)] pb-[var(--section-y)]">
      <Container>
        <h2 className="section-title">¿Por qué hablar con Rozher?</h2>
        <p className="mx-auto mt-[clamp(0.75rem,1.2vw,1.5rem)] max-w-[52rem] text-center text-card text-[var(--color-ink)]">
          No somos un banco. Somos el equipo que te ayuda a entender tus opciones y te conecta con
          quien puede resolverlas.
        </p>

        <div className="mt-[clamp(1.5rem,3.3vw,3.5rem)] grid grid-cols-1 gap-[var(--card-gap)] md:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[var(--radius-lg)] bg-white px-[clamp(1.5rem,3.9vw,4rem)] py-[clamp(1.75rem,3.25vw,3.5rem)] shadow-[var(--shadow-card)]"
            >
              <Icon className="text-[var(--color-accent)]" size={40} strokeWidth={1.5} />
              <h3 className="mt-[clamp(1rem,1.6vw,1.75rem)] text-card-title font-bold text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="mt-[clamp(0.75rem,1vw,1.25rem)] text-card text-[var(--color-ink)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
