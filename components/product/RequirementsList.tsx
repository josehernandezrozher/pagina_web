import { Container } from "@/components/shared/Container";
import { CheckCircle2 } from "lucide-react";
import { Pending } from "@/components/shared/Pending";
import type { Product } from "@/lib/products/types";

export function RequirementsList({ requirements }: { requirements: Product["requirements"] }) {
  return (
    <Container className="py-16 sm:py-20">
      <h2 className="section-title">
        ¿Qué necesitas para solicitarlo?
      </h2>
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={20} />
            <span className="text-card text-[var(--color-ink)]">
              <Pending value={req} />
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
