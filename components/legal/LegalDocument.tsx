import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";

/** Contenedor de documentos legales (aviso de privacidad, términos, etc.). */
export function LegalDocument({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-16 sm:py-20 lg:py-24">
      <h1 className="text-4xl font-semibold text-[var(--color-ink)]">{title}</h1>
      {updated && (
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Última actualización: {updated}</p>
      )}
      {intro && <p className="mt-6 leading-relaxed text-[var(--color-ink-soft)]">{intro}</p>}
      <div className="mt-10 space-y-10">{children}</div>
    </Container>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-[var(--color-ink-soft)] [&_a]:font-medium [&_a]:text-[var(--color-primary)] [&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}
