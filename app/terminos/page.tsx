import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { Pending } from "@/components/shared/Pending";
import { LEGAL } from "@/lib/legal";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio web de Rozher Seguros y alcance de la información sobre productos.",
};

export default function TerminosPage() {
  return (
    <LegalDocument title="Términos y condiciones de uso" updated={LEGAL.termsUpdated}>
      <LegalSection title="1. Aceptación">
        <p>
          Al acceder o utilizar este sitio web aceptas estos términos y condiciones. Si no estás de
          acuerdo con ellos, te pedimos no utilizar el sitio. El tratamiento de tus datos
          personales se rige por nuestro <Link href="/privacidad">aviso de privacidad</Link>.
        </p>
      </LegalSection>

      <LegalSection title="2. Quiénes somos y cuál es nuestro papel">
        <p>
          Este sitio es operado por <Pending value={LEGAL.legalName} />, que opera comercialmente
          bajo el nombre <strong>{LEGAL.brand}</strong>. Rozher Seguros ofrece asesoría y
          orientación comercial sobre productos financieros y de seguros.
        </p>
        <p>
          Rozher Seguros actúa como intermediario o asesor comercial. Los créditos, tarjetas y
          seguros son otorgados o emitidos por las instituciones financieras o aseguradoras
          correspondientes, y sus condiciones, requisitos y aprobación son responsabilidad de
          ellas. Consulta los <Link href="/datos-legales">datos legales y regulatorios</Link>.
        </p>
      </LegalSection>

      <LegalSection title="3. La información del sitio es informativa y no es una oferta">
        <p>
          Los contenidos del sitio son de carácter informativo y general. No constituyen una
          oferta vinculante ni garantizan la aprobación, el monto, el plazo, la tasa ni las
          condiciones de ningún producto. Todo producto está sujeto a la evaluación y aprobación de
          la institución correspondiente, a la validación de la información que proporciones y a su
          disponibilidad. Las condiciones pueden cambiar sin previo aviso.
        </p>
      </LegalSection>

      <LegalSection title="4. Crédito de Nómina IMSS">
        <p>
          El otorgamiento del crédito está sujeto a la capacidad de crédito que determina y
          administra el Instituto Mexicano del Seguro Social (IMSS), a la edad del solicitante, al
          plazo elegido y al cumplimiento de los requisitos de la institución otorgante. Rozher
          Seguros no puede modificar la capacidad de crédito.
        </p>
        <p>
          Rozher Seguros no forma parte del IMSS ni lo representa. Las menciones al IMSS describen
          el tipo de pensión o nómina al que se dirige el producto.
        </p>
      </LegalSection>

      <LegalSection title="5. Uso del sitio y de los formularios">
        <ul>
          <li>Debes proporcionar datos verídicos, completos y que te pertenezcan.</li>
          <li>Debes usar el sitio de forma lícita y de buena fe.</li>
          <li>
            Está prohibido intentar vulnerar la seguridad del sitio, enviar información falsa o
            masiva (spam, bots), extraer su contenido de forma automatizada o suplantar a otra
            persona.
          </li>
        </ul>
        <p>
          Podemos limitar o bloquear el acceso a quien incumpla estas reglas. Enviar un formulario
          no crea una relación contractual ni garantiza que obtengas un producto.
        </p>
      </LegalSection>

      <LegalSection title="6. Comunicaciones">
        <p>
          Al enviar tus datos autorizas que un asesor de Rozher Seguros te contacte por WhatsApp,
          teléfono o correo electrónico para atender tu solicitud.
        </p>
      </LegalSection>

      <LegalSection title="7. Propiedad intelectual y marcas de terceros">
        <p>
          Los textos, diseños, logotipos y demás contenidos del sitio pertenecen a Rozher Seguros o
          a sus titulares y no pueden reproducirse sin autorización. Las marcas de terceros
          (instituciones financieras, IMSS, aerolíneas, Meta, WhatsApp, entre otras) pertenecen a
          sus propietarios; su mención no implica afiliación, salvo que se indique expresamente.
        </p>
      </LegalSection>

      <LegalSection title="8. Enlaces y servicios de terceros">
        <p>
          El sitio puede enlazar a servicios de terceros, como WhatsApp. Esos servicios se rigen
          por sus propios términos y políticas, y Rozher Seguros no es responsable de ellos.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitación de responsabilidad">
        <p>
          El sitio se ofrece “tal como está”. No garantizamos que esté disponible de forma
          ininterrumpida ni libre de errores. En la máxima medida permitida por la legislación
          aplicable, Rozher Seguros no será responsable por decisiones tomadas únicamente con base
          en la información del sitio, ni por daños indirectos derivados de su uso.
        </p>
      </LegalSection>

      <LegalSection title="10. Quejas y aclaraciones">
        <p>
          Puedes escribirnos por WhatsApp al {WHATSAPP_DISPLAY}. Unidad o canal de atención de
          quejas: <Pending value={LEGAL.complaintsUnit} />.
        </p>
        <p>
          Si tu queja se relaciona con un producto o servicio financiero, también puedes acudir a
          la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios
          Financieros (CONDUSEF), en <strong>www.condusef.gob.mx</strong>.
        </p>
      </LegalSection>

      <LegalSection title="11. Modificaciones">
        <p>
          Podemos actualizar estos términos en cualquier momento. La versión vigente es la
          publicada en esta página, con su fecha de última actualización.
        </p>
      </LegalSection>

      <LegalSection title="12. Legislación aplicable y jurisdicción">
        <p>
          Estos términos se rigen por las leyes federales aplicables de los Estados Unidos
          Mexicanos. Para su interpretación y cumplimiento, las partes se someten a los tribunales
          competentes de <Pending value={LEGAL.jurisdictionCity} />, sin perjuicio de los derechos
          que la legislación otorga a los consumidores y a los usuarios de servicios financieros.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
