import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { Pending } from "@/components/shared/Pending";
import { LEGAL } from "@/lib/legal";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Datos legales y regulatorios",
  description:
    "Información legal y regulatoria de Rozher Seguros: quiénes somos, nuestro papel como intermediario y cómo presentar una queja.",
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-[var(--color-border)] py-4 sm:grid-cols-3 sm:gap-6">
      <dt className="font-medium text-[var(--color-ink)]">{label}</dt>
      <dd className="text-[var(--color-ink-soft)] sm:col-span-2">{children}</dd>
    </div>
  );
}

export default function DatosLegalesPage() {
  return (
    <LegalDocument
      title="Datos legales y regulatorios"
      intro="Información de identificación de la empresa y del alcance de sus servicios."
    >
      <dl className="-mt-4 border-b border-[var(--color-border)]">
        <Row label="Nombre comercial">{LEGAL.brand}</Row>
        <Row label="Razón social">
          <Pending value={LEGAL.legalName} />
        </Row>
        <Row label="Domicilio">
          <Pending value={LEGAL.address} />
        </Row>
        <Row label="Naturaleza de los servicios">
          Rozher Seguros es intermediario o asesor comercial. Los créditos, tarjetas y seguros son
          otorgados o emitidos por las instituciones financieras o aseguradoras correspondientes,
          y sus condiciones, requisitos y aprobación corresponden a ellas.
        </Row>
        <Row label="Registros y autorizaciones">
          <Pending value={LEGAL.regulatoryRegistrations} />
        </Row>
        <Row label="Contacto">WhatsApp: {WHATSAPP_DISPLAY}</Row>
        <Row label="Atención de quejas">
          <Pending value={LEGAL.complaintsUnit} />
          <p className="mt-2">
            También puedes acudir a la Comisión Nacional para la Protección y Defensa de los
            Usuarios de Servicios Financieros (CONDUSEF): www.condusef.gob.mx
          </p>
        </Row>
        <Row label="Protección de datos">
          Consulta el <Link className="font-medium text-[var(--color-primary)] underline" href="/privacidad">aviso de privacidad</Link>.
          Correo para derechos ARCO: <Pending value={LEGAL.privacyEmail} />
        </Row>
        <Row label="Condiciones de uso">
          Consulta los <Link className="font-medium text-[var(--color-primary)] underline" href="/terminos">términos y condiciones</Link>.
        </Row>
      </dl>
    </LegalDocument>
  );
}
