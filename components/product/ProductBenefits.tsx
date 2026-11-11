import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Pending } from "@/components/shared/Pending";
import { Sparkles } from "lucide-react";

export function ProductBenefits({ benefits }: { benefits: string[] }) {
  return (
    <Section tone="paper">
      <Container>
        <h2 className="section-title">
          Beneficios principales
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-card)]">
              <Sparkles className="text-[var(--color-accent)]" size={22} />
              <p className="mt-4 text-card text-[var(--color-ink)]">
                <Pending value={benefit} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
