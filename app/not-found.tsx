import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};


export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">Error 404</p>
      <h1 className="mt-3 text-display font-bold text-[var(--color-ink)]">
        No encontramos esta página
      </h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--color-ink-soft)]">
        Es posible que el enlace haya cambiado o que el producto aún no esté disponible.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <Link
          href="/contacto"
          className="btn btn-outline"
        >
          Contactar a un asesor
        </Link>
      </div>
    </Container>
  );
}
