import { Container } from "@/components/shared/Container";

const STEPS = [
  {
    step: 1,
    title: "Nos cuentas tu caso",
    description: "Por WhatsApp, teléfono o formulario — como prefieras.",
    image: "/images/como_funciona_1.jpg",
  },
  {
    step: 2,
    title: "Un asesor revisa tus opciones",
    description: "Te explica qué producto se ajusta a tu situación y resuelve tus dudas.",
    image: "/images/como_funciona_2.jpg",
  },
  {
    step: 3,
    title: "Avanzas con información clara",
    description: "Decides con los datos completos, sin presión ni letra pequeña sorpresa.",
    image: "/images/como_funciona_3.jpg",
  },
];

/**
 * Tarjetas de imagen con degradado azul y texto blanco al pie (esquinas de
 * 28 px a 1536 px), según la referencia.
 */
export function HowItWorks() {
  return (
    <section className="bg-[var(--color-paper)] pb-[var(--section-y)]">
      <Container>
        <h2 className="section-title">Cómo funciona</h2>

        <ol className="mt-[clamp(1.5rem,4.4vw,4.5rem)] grid grid-cols-1 gap-[var(--card-gap)] md:grid-cols-3">
          {STEPS.map(({ step, title, description, image }) => (
            <li
              key={step}
              className="relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-primary)] sm:aspect-[322/430]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,2,84,0) 25%, rgba(0,2,84,0.78) 62%, rgba(0,2,84,0.96) 100%)",
                }}
              />
              <div className="px-[clamp(1.25rem,2vw,2.25rem)] pb-[clamp(1.5rem,2.2vw,2.5rem)] text-center text-white">
                <span className="text-card font-semibold text-white/70">
                  {String(step).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-card-title font-bold">{title}</h3>
                <p className="mt-[clamp(0.5rem,0.8vw,1rem)] text-card text-white/90">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
