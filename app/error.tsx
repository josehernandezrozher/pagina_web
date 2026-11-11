"use client";

import Link from "next/link";
import { Container } from "@/components/shared/Container";


/** Pantalla de error para fallos inesperados al renderizar una página. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24 sm:py-32">
      <h1 className="text-display font-bold text-[var(--color-ink)]">
        Algo salió mal
      </h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--color-ink-soft)]">
        Ocurrió un problema al cargar esta página. Puedes intentarlo de nuevo o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="btn btn-outline"
        >
          Volver al inicio
        </Link>
      </div>
    </Container>
  );
}
