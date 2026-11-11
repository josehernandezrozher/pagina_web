import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Info } from "lucide-react";

/**
 * Aviso de transparencia al pie de la página de producto.
 * Mantiene explícito el papel de Rozher (intermediario) y dónde consultar
 * los datos legales. La mención nominal de la institución otorgante sigue
 * siendo una decisión de negocio/legal de Rozher.
 */
export function LegalNotice() {
  return (
    <Container className="pb-16">
      <div className="flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-paper)] p-5 text-sm text-[var(--color-ink-soft)]">
        <Info size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
        <p>
          Rozher Seguros es intermediario/asesor. El crédito es otorgado por una
          institución financiera con convenio con el IMSS; su otorgamiento está
          sujeto a la capacidad de crédito que determina el IMSS y a las
          condiciones de la institución otorgante. La tasa de interés y el CAT
          se determinan en la cotización de cada solicitud. Consulta los{" "}
          <Link href="/datos-legales" className="font-medium text-[var(--color-primary)] underline">
            datos legales y regulatorios
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
