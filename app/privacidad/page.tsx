import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { Pending } from "@/components/shared/Pending";
import { LEGAL } from "@/lib/legal";
import { GTM_ENABLED, META_PIXEL_DIRECT } from "@/lib/site";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad integral de Rozher Seguros: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos.",
};

export default function PrivacidadPage() {
  return (
    <LegalDocument title="Aviso de privacidad integral" updated={LEGAL.privacyUpdated}>
      <LegalSection title="1. Identidad y domicilio del responsable">
        <p>
          <Pending value={LEGAL.legalName} />, que opera comercialmente bajo el nombre{" "}
          <strong>{LEGAL.brand}</strong> (en adelante, “Rozher Seguros”), con domicilio en{" "}
          <Pending value={LEGAL.address} />, es responsable del tratamiento de tus datos
          personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de
          los Particulares (en adelante, “la Ley”), su Reglamento y demás disposiciones aplicables.
        </p>
      </LegalSection>

      <LegalSection title="2. Datos personales que recabamos">
        <p>
          <strong>Los que tú nos proporcionas en este sitio web</strong> al llenar un formulario:
        </p>
        <ul>
          <li>Nombre completo.</li>
          <li>Número de teléfono (con WhatsApp).</li>
          <li>Correo electrónico (opcional).</li>
          <li>Producto de tu interés y los comentarios que decidas escribir.</li>
        </ul>
        <p>
          <strong>Los que se recaban automáticamente</strong> al navegar: páginas visitadas,
          interacciones (por ejemplo, clics en botones de contacto), tipo de dispositivo y
          navegador, y dirección IP. Ver la sección 7.
        </p>
        <p>
          <strong>Los que podríamos solicitarte durante la asesoría.</strong> Si decides continuar
          con el trámite de un producto, un asesor podría pedirte, por WhatsApp u otros medios,
          información y documentos adicionales necesarios para evaluar tu solicitud (por ejemplo,
          identificación oficial, comprobante de domicilio, datos de tu pensión o empleo y datos de
          tu cuenta bancaria). Solo los pediremos cuando decidas avanzar, y cuando la Ley lo
          requiera recabaremos tu consentimiento expreso.
        </p>
        <p>
          <strong>Datos sensibles.</strong> No solicitamos datos personales sensibles (como salud,
          religión u origen étnico) a través de este sitio. Te pedimos no incluirlos en el campo de
          comentarios.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidades del tratamiento">
        <p>
          <strong>Finalidades necesarias</strong> (sin ellas no podemos atenderte):
        </p>
        <ul>
          <li>Contactarte para atender tu solicitud de información.</li>
          <li>Brindarte asesoría sobre el producto financiero o de seguros que te interesa.</li>
          <li>
            Dar seguimiento a tu trámite y gestionarlo ante la institución financiera o
            aseguradora correspondiente.
          </li>
          <li>Resolver tus dudas, quejas y aclaraciones.</li>
          <li>Cumplir obligaciones legales y atender requerimientos de autoridades competentes.</li>
        </ul>
        <p>
          <strong>Finalidades adicionales</strong> (puedes negarte sin que eso afecte la atención
          anterior):
        </p>
        <ul>
          <li>Enviarte información sobre otros productos, servicios o promociones.</li>
          <li>Realizar encuestas de calidad y análisis estadísticos para mejorar el servicio.</li>
          <li>Medir la efectividad de nuestra publicidad y de este sitio web.</li>
        </ul>
        <p>
          Si no deseas que usemos tus datos para las finalidades adicionales, escríbenos a{" "}
          <Pending value={LEGAL.privacyEmail} /> indicando tu nombre y que te opones a ellas. Tu
          negativa no será motivo para negarte los servicios.
        </p>
      </LegalSection>

      <LegalSection title="4. Transferencias y remisiones de datos">
        <p>Para cumplir las finalidades necesarias, tus datos podrán compartirse con:</p>
        <ul>
          <li>
            Instituciones financieras y aseguradoras con las que Rozher Seguros tiene convenio,
            correspondientes al producto que solicitaste, para evaluar y tramitar tu solicitud.
          </li>
          <li>
            Autoridades competentes, cuando la ley lo exija o lo requiera una resolución fundada y
            motivada.
          </li>
          <li>
            Proveedores de servicios que tratan datos por nuestra cuenta (por ejemplo, alojamiento
            del sitio web, almacenamiento de información en la nube como las hojas de cálculo de
            Google, y mensajería), obligados a confidencialidad y a usarlos solo para prestarnos
            el servicio.
          </li>
        </ul>
        <p>No vendemos tus datos personales.</p>
      </LegalSection>

      <LegalSection id="arco" title="5. Derechos ARCO y revocación del consentimiento">
        <p>
          Tienes derecho a <strong>acceder</strong> a tus datos y conocer cómo los tratamos,{" "}
          <strong>rectificarlos</strong> si son inexactos, <strong>cancelarlos</strong> cuando
          consideres que no se requieren para las finalidades señaladas, y{" "}
          <strong>oponerte</strong> a su tratamiento para fines específicos. También puedes
          revocar tu consentimiento y limitar el uso o divulgación de tus datos.
        </p>
        <p>
          Para ejercer estos derechos envía tu solicitud a <Pending value={LEGAL.privacyEmail} />{" "}
          con: (a) tu nombre completo y un medio para responderte; (b) documentos que acrediten tu
          identidad o la de tu representante; (c) la descripción clara de los datos y del derecho
          que deseas ejercer; y (d) cualquier elemento que ayude a localizar tus datos. Te
          responderemos en los plazos que establece la Ley.
        </p>
      </LegalSection>

      <LegalSection title="6. Conservación de los datos">
        <p>
          Conservamos tus datos durante el tiempo necesario para cumplir las finalidades descritas
          y las obligaciones legales aplicables. Después, los bloqueamos y los suprimimos conforme
          a la Ley.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies y tecnologías de rastreo">
        {GTM_ENABLED ? (
          <>
            <p>
              Este sitio utiliza <strong>Google Tag Manager</strong> para administrar herramientas de
              medición y publicidad, entre ellas <strong>Google Analytics</strong> (Google LLC) y el{" "}
              <strong>Pixel y la API de Conversiones de Meta</strong> (Meta Platforms, Inc.). Estas
              herramientas pueden colocar cookies o identificadores en tu navegador para medir el
              tráfico del sitio, evaluar la efectividad de nuestra publicidad, crear audiencias y
              mostrarte anuncios más relevantes en Facebook e Instagram. Registran, por ejemplo, las
              páginas que visitas, tu interacción con los botones de contacto y el envío de
              formularios, junto con tu dirección IP, tu agente de usuario e identificadores del
              navegador.
            </p>
            <p>
              Parte de esa información se procesa en un servidor propio de etiquetado (del lado del
              servidor), operado por Rozher Seguros o por un proveedor contratado, desde el cual se
              envía a Meta. A estas herramientas{" "}
              <strong>no enviamos tu nombre, teléfono ni correo electrónico</strong>. Google y Meta
              tratan la información que reciben conforme a sus propias políticas de privacidad.
              Puedes limitar la publicidad personalizada desde la configuración de anuncios de tu
              cuenta de Google, Facebook o Instagram, y bloquear o eliminar cookies desde la
              configuración de tu navegador.
            </p>
          </>
        ) : META_PIXEL_DIRECT ? (
          <>
            <p>
              Este sitio utiliza el <strong>Pixel de Meta</strong> (Meta Platforms, Inc.), que puede
              colocar cookies o identificadores en tu navegador para medir la efectividad de
              nuestra publicidad, crear audiencias y mostrarte anuncios más relevantes en Facebook
              e Instagram. Registra, por ejemplo, las páginas que visitas, tu interacción con los
              botones de contacto y el envío de formularios, junto con tu dirección IP e
              identificadores del navegador.
            </p>
            <p>
              A través del Pixel{" "}
              <strong>no enviamos a Meta tu nombre, teléfono ni correo electrónico</strong>. Meta
              trata la información que recibe conforme a su propia política de privacidad. Puedes
              limitar la publicidad personalizada desde la configuración de anuncios de tu cuenta
              de Facebook o Instagram, y bloquear o eliminar cookies desde la configuración de tu
              navegador.
            </p>
          </>
        ) : (
          <p>
            Este sitio no utiliza cookies de terceros con fines publicitarios. Solo se emplean los
            elementos técnicos necesarios para su funcionamiento.
          </p>
        )}
        <p>
          Los botones de WhatsApp abren una conversación en esa aplicación (propiedad de Meta), que
          se rige por sus propios términos y aviso de privacidad. Nuestro número de contacto es{" "}
          {WHATSAPP_DISPLAY}.
        </p>
      </LegalSection>

      <LegalSection title="8. Medidas de seguridad">
        <p>
          Mantenemos medidas de seguridad administrativas, técnicas y físicas para proteger tus
          datos contra daño, pérdida, alteración, destrucción o uso no autorizado. Este sitio
          transmite la información mediante una conexión cifrada (HTTPS).
        </p>
      </LegalSection>

      <LegalSection title="9. Menores de edad">
        <p>
          Este sitio no está dirigido a menores de edad y no recabamos intencionalmente sus datos
          personales.
        </p>
      </LegalSection>

      <LegalSection title="10. Cambios a este aviso">
        <p>
          Podemos modificar este aviso por cambios legales, de nuestras prácticas o de nuestros
          productos. Publicaremos la versión vigente en esta página, con su fecha de última
          actualización.
        </p>
      </LegalSection>

      <LegalSection title="11. Autoridad y consentimiento">
        <p>
          Si consideras que tu derecho a la protección de datos personales ha sido vulnerado,
          puedes acudir a la autoridad competente en la materia.
        </p>
        <p>
          Al enviar tus datos mediante los formularios de este sitio o al contactarnos, confirmas
          que leíste este aviso y consientes el tratamiento de tus datos en los términos aquí
          descritos. Consulta también nuestros <Link href="/terminos">términos y condiciones</Link>{" "}
          y los <Link href="/datos-legales">datos legales y regulatorios</Link>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
