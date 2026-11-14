import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

const LINK =
  "text-[clamp(1rem,1.15vw,1.25rem)] text-white/75 transition-colors hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      {/*
        Tarjeta de contacto a caballo entre el fondo claro y el pie azul:
        el degradado duro al 50 % hace que su centro quede justo en la unión.
      */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, var(--color-paper) 50%, var(--color-primary) 50%)",
        }}
      >
        <Container>
          <div className="grid items-center gap-[clamp(1.5rem,3vw,3.5rem)] rounded-[var(--radius-xl)] bg-[var(--color-panel)] py-[clamp(2.25rem,9.8vw,11rem)] pr-[clamp(1.5rem,5.5vw,7rem)] pl-[clamp(1.5rem,7.9vw,9.5rem)] lg:grid-cols-[max-content_minmax(0,1fr)_auto]">
            <h2 className="text-display font-bold text-[var(--color-ink)]">
              ¿Tienes dudas?
              <br />
              Un asesor te ayuda
            </h2>

            <div className="flex items-start gap-4">
              <MessageCircle
                size={30}
                strokeWidth={1.75}
                className="mt-1 shrink-0 text-[var(--color-accent)]"
              />
              <div>
                <p className="text-nav font-bold text-[var(--color-ink)]">WhatsApp:</p>
                <p className="text-nav font-semibold text-[var(--color-ink)]">{WHATSAPP_DISPLAY}</p>
              </div>
            </div>

            <WhatsAppButton
              variant="primary"
              message="Hola, quiero información sobre los productos de Servicios Financieros."
            >
              Escribir por WhatsApp
            </WhatsAppButton>
          </div>
        </Container>
      </div>

      <div className="-mt-px bg-[var(--color-primary)] text-white">
        <Container className="pt-[clamp(2.5rem,4.5vw,5.5rem)] pb-8">
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-[clamp(2rem,3.5vw,4rem)] md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="text-[clamp(1.25rem,1.9vw,2rem)] font-bold text-white">Rozher Servicios Financieros</p>
              <p className="mt-3 max-w-sm text-[clamp(0.9375rem,1.05vw,1.125rem)] text-white/70">
                Asesoría en productos financieros y de seguros. Rozher Servicios Financieros es intermediario/asesor
                comercial; las condiciones de cada producto corresponden a la institución otorgante
                correspondiente.
              </p>
            </div>

            <div>
              <p className="text-[clamp(1.0625rem,1.3vw,1.375rem)] font-bold text-white">Productos</p>
              <ul className="mt-4 space-y-3">
                <li><Link href="/productos/credito-nomina-imss" className={LINK}>Crédito de Nómina IMSS</Link></li>
                <li><Link href="/productos" className={LINK}>Ver todos los créditos</Link></li>
                <li><Link href="/seguros" className={LINK}>Seguros</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[clamp(1.0625rem,1.3vw,1.375rem)] font-bold text-white">Empresa</p>
              <ul className="mt-4 space-y-3">
                <li><Link href="/nosotros" className={LINK}>Nosotros</Link></li>
                <li><Link href="/contacto" className={LINK}>Contacto</Link></li>
                <li><Link href="/privacidad" className={LINK}>Aviso de privacidad</Link></li>
                <li><Link href="/terminos" className={LINK}>Términos y condiciones</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 pt-6 text-sm text-white/60 sm:flex-row sm:items-center">
            <p>© {year} Rozher Servicios Financieros. Todos los derechos reservados.</p>
            <Link href="/datos-legales" className="hover:text-white">
              Datos legales y regulatorios
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
