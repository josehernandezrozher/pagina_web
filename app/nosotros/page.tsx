import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a Rozher Seguros, empresa de asesoría en productos financieros y de seguros.",
};

export default function NosotrosPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20 lg:py-24">
      <h1 className="text-display font-bold text-[var(--color-ink)]">
        Nosotros
      </h1>
      <p className="mt-6 text-card text-[var(--color-ink)]">
        Rozher Seguros es una empresa de asesoría en productos financieros y
        de seguros. Ayudamos a las personas a entender sus opciones y las
        conectamos con la institución o el producto que corresponde a su
        caso.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-[var(--color-ink)]">Cómo trabajamos</h2>
      <p className="mt-3 text-card text-[var(--color-ink)]">
        Rozher Seguros actúa como intermediario o asesor comercial: te orientamos y te
        acompañamos en el trámite. Las condiciones, los requisitos y la aprobación de cada
        producto corresponden a la institución financiera o aseguradora correspondiente.
      </p>
      <p className="mt-4 text-card text-[var(--color-ink)]">
        Consulta nuestros{" "}
        <Link href="/datos-legales" className="font-medium text-[var(--color-primary)] underline">
          datos legales y regulatorios
        </Link>
        .
      </p>
    </Container>
  );
}
