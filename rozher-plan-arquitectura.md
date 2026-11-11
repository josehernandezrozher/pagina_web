# Rozher Seguros — Plan de Arquitectura y Desarrollo
**Fase: Pre-implementación** · v1.0

> Referencia estructural: PrestAngel (patrones de UX/conversión, no copy ni datos).
> Paleta e identidad visual: provisional, reemplazable sin rediseño estructural.

---

## 1. Arquitectura recomendada

**Modelo:** Next.js (App Router) + generación estática/incremental (SSG/ISR) para páginas de producto y contenido, con rutas dinámicas para escalar productos sin tocar la base.

**Por qué este enfoque:**
- Cada producto (crédito, seguro, servicio futuro) es un **registro de datos**, no una página nueva que haya que programar. Se agrega contenido, no código.
- SSG/ISR da páginas casi instantáneas en móvil (crítico si el tráfico viene de Facebook/Instagram/WhatsApp con conexiones variables).
- SEO nativo: cada producto puede tener su propio title, meta, OG y datos estructurados sin trabajo extra.
- El formulario de leads es la única pieza verdaderamente dinámica; vive en una API route aislada, fácil de conectar después a CRM/WhatsApp/webhook.

**Patrón de PrestAngel que sí vale la pena adoptar:** la jerarquía "Hero → Por qué → Requisitos → Quiénes somos → FAQ → Formulario → CTA final" funciona porque resuelve objeciones en orden (entender → confiar → resolver dudas → actuar). La reutilizamos como plantilla de página de producto, pero con copy propio y sin datos inventados.

**Lo que NO replicamos de PrestAngel:** el uso de un page builder (GoHighLevel) para todo el sitio. Nos ata a su editor y a un iframe de formulario que no controlamos ni podemos versionar. Rozher necesita código propio versionable para poder crecer a 20+ productos de forma ordenada.

---

## 2. Sitemap

```
/                               Home
/productos                      Listado de todos los productos (créditos + seguros + servicios)
/productos/credito-nomina-imss  Landing de conversión — Crédito de Nómina IMSS
/productos/[slug]               Plantilla reutilizable para futuros productos
/seguros                        Listado filtrado de productos de categoría "seguro"
/nosotros                       Quiénes somos, sin inventar historia/cifras no confirmadas
/contacto                       Formulario general + WhatsApp + datos de contacto
/privacidad                     Aviso de privacidad
/terminos                       Términos y condiciones
```

`/seguros` es un filtro sobre `/productos` (misma fuente de datos, distinta vista), no una sección paralela — evita duplicar lógica cuando lleguen más categorías.

---

## 3. Stack tecnológico

| Capa | Herramienta | Motivo |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Rutas dinámicas por producto, SSG/ISR, SEO nativo |
| Estilos | Tailwind CSS + tokens propios en `tailwind.config` | Consistencia visual, cero CSS suelto |
| Formulario | React Hook Form + Zod (validación) | Validación robusta sin dependencias pesadas |
| Envío de leads | API route de Next.js → Google Sheets (ampliable a CRM) | No depende de un tercero desde el día uno |
| Iconos | `lucide-react` | Sets consistentes, sin cargar librerías de íconos pesadas |
| Analytics | GA4 o Plausible + capa de eventos propia (ver sección 7) | Medir conversión real, no solo visitas |
| Hosting | Vercel | Despliegue, ISR y edge caching sin configuración extra |
| CMS (fase 2, opcional) | Sanity/Contentful si el equipo comercial va a editar contenido sin developer | Evita que cada cambio de copy dependa de un deploy |

No se incluye ninguna librería de animación pesada (Framer Motion queda como opción *si* se necesita, no por defecto) ni UI kits genéricos que hagan que el sitio "se vea como plantilla".

---

## 4. Estructura de carpetas

```
app/
├── (marketing)/
│   ├── page.tsx                    → /
│   ├── productos/
│   │   ├── page.tsx                → /productos
│   │   └── [slug]/page.tsx         → /productos/[slug]
│   ├── seguros/page.tsx            → /seguros
│   ├── nosotros/page.tsx
│   ├── contacto/page.tsx
│   ├── privacidad/page.tsx
│   └── terminos/page.tsx
├── api/
│   └── leads/route.ts              → recepción y envío de formularios
components/
├── layout/        Navbar, Footer
├── sections/       Hero, WhyRozher, HowItWorks, TrustSection, CTASection
├── product/         ProductCard, ProductGrid, ProductHero, RequirementsList, FAQAccordion
├── forms/           LeadForm, FormField, FormSuccess
├── shared/          WhatsAppButton, Badge, Section, Container
lib/
├── products/         data.ts (fuente de productos), types.ts
├── analytics/         events.ts (definición central de eventos)
├── validation/        schemas.ts (Zod)
hooks/
├── useWhatsAppLink.ts
├── useLeadForm.ts
styles/
├── tokens.css / tailwind.config.ts
public/
```

Ningún componente de sección supera ~150 líneas; si una sección crece más de eso, se descompone en subcomponentes.

---

## 5. Design system inicial (provisional)

Todo vive en tokens (`tailwind.config.ts` + variables CSS) para que el rebrand futuro sea un cambio de valores, no de estructura.

**Color** (provisional — a reemplazar por identidad oficial de Rozher):
```
--color-primary:      #0F3D5C   /* azul institucional oscuro — confianza, seriedad */
--color-primary-600:  #14507A
--color-secondary:    #0EA5A0   /* verde-azulado — acento, CTAs secundarios */
--color-accent:       #D9A441   /* dorado sobrio — detalles, no CTA principal */
--color-success:      #1D8A5E   /* WhatsApp / confirmaciones */
--color-neutral-900:  #101828   /* texto principal */
--color-neutral-600:  #475467   /* texto secundario */
--color-neutral-100:  #F5F7FA   /* fondos alternos */
--color-white:        #FFFFFF
```
*Nota:* evité deliberadamente el azul/cian de PrestAngel (`#3E4899`/`#00AEEF`) para que Rozher no herede una identidad ajena por accidente.

**Tipografía:**
- Familia: `Inter` o `Plus Jakarta Sans` (geométrica, legible, gratuita, con buen soporte de pesos) — provisional hasta definir tipografía de marca.
- Escala: base 16px, con posibilidad de aumentar a 17–18px si el producto objetivo son adultos mayores/pensionados (como hizo PrestAngel). **Esto lo dejo como decisión abierta**, ver sección 10.

**Espaciado / radios / sombras:** escala de 4px (4, 8, 12, 16, 24, 32, 48, 64). Radios moderados (8–16px), nunca "pill" extremo salvo en botones CTA. Sombras sutiles, un solo nivel de elevación por defecto y uno "hover" — nada de sombras dramáticas tipo glassmorphism.

**Breakpoints:** 360 / 390 / 430 (mobile) → 768 (tablet) → 1024 (desktop) → 1440+ (large desktop). Diseño mobile-first real: cada componente se construye primero en 390px.

---

## 6. Arquitectura de componentes

Principio: **secciones de página = composición de componentes atómicos**, nunca bloques monolíticos con lógica mezclada.

```
<ProductPage>
 ├── <ProductHero product={} />              → entiende
 ├── <ProductBenefits items={} />            → confía
 ├── <ProductFeatures items={} />            → confía
 ├── <ProductAudience text={} />             → entiende si aplica
 ├── <RequirementsList items={} />           → revisa info
 ├── <HowItWorks steps={} />                 → revisa info
 ├── <FAQAccordion items={} />               → resuelve objeción
 ├── <LeadForm productId={} />               → convierte
 └── <FinalCTA whatsappMessage={} />         → convierte
```

Cada componente recibe datos, no los conoce de antemano — así la misma plantilla sirve para el Crédito de Nómina IMSS y para el producto #20 sin tocar el componente.

---

## 7. Flujo de conversión y eventos de analytics

```
page_view (home o producto)
   ↓
product_view              → visitante entra a un producto específico
   ↓
faq_open                  → señal de interés/duda (intención media)
   ↓
cta_click (por tipo)      → "Ver requisitos" | "Conocer más" | "Hablar con un asesor"
   ↓
whatsapp_click / phone_click / email_click   → intención alta, contacto directo
   ↓
form_start → form_submit  → lead calificado
```

Cada CTA declara su nivel de intención en el propio componente (`intent="info" | "consideration" | "conversion"`), lo que permite:
1. Mantener consistencia de copy por nivel de intención (tal como pediste).
2. Alimentar analytics sin re-etiquetar nada después.

---

## 8. Modelo conceptual de producto

```ts
type ProductCategory = "credito" | "seguro" | "servicio";
type ProductStatus = "disponible" | "proximamente" | "pausado";

interface Product {
  id: string;
  slug: string;                 // /productos/[slug]
  name: string;
  category: ProductCategory;
  shortDescription: string;     // usado en ProductCard
  description: string;          // usado en Hero de producto
  benefits: string[];           // sección "Por qué elegir"
  features: { title: string; description: string }[];
  audience?: string;            // "¿A quién va dirigido?"
  requirements: string[];       // documentos/condiciones — SOLO si Rozher confirma
  howItWorks: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  cta: { label: string; whatsappTemplate: string };
  status: ProductStatus;
  seo: { title: string; description: string; ogImage?: string };
}
```

Cualquier campo sin dato confirmado se renderiza como `[INFORMACIÓN PENDIENTE]` visible en desarrollo, nunca se omite silenciosamente ni se rellena con un valor inventado.

---

## 9. Plan de desarrollo por fases

**Fase 0 — Fundaciones (sin contenido final)**
Setup de Next.js + Tailwind, tokens de diseño, layout base (Navbar/Footer), sistema de componentes vacíos con datos de placeholder visibles.

**Fase 1 — Home + arquitectura de producto**
Home completa con secciones aprobadas, listado `/productos`, plantilla `[slug]` funcionando con datos placeholder del Crédito de Nómina IMSS.

**Fase 2 — Landing Crédito de Nómina IMSS (con datos reales)**
Solo se completa una vez recibida la información de la sección 10. Incluye FAQ real, requisitos reales, formulario conectado.

**Fase 3 — Páginas institucionales**
Nosotros, Contacto, Privacidad, Términos — dependen de info legal/corporativa de Rozher.

**Fase 4 — Integración de leads**
Conexión real del formulario a email/CRM/WhatsApp/webhook, analytics en producción.

**Fase 5 — Escalamiento de catálogo**
Se agregan más productos (créditos/seguros) usando la misma plantilla — sin tocar arquitectura.

No avanzamos a una fase con datos inventados solo para "ver cómo se ve"; usamos placeholders explícitos.

---

## 10. Información que necesito de Rozher antes de implementar contenido real

**Identidad de marca**
- [ ] Logotipo (formatos vectoriales si existen)
- [ ] Colores corporativos oficiales (si ya existen, para no seguir con la paleta provisional)
- [ ] Tipografía de marca (si existe)

**Empresa**
- [ ] Descripción oficial de qué es Rozher Seguros (para no asumir que es banco/institución regulada)
- [ ] Razón social, datos legales para footer y avisos
- [ ] Datos de contacto: teléfono, WhatsApp Business, correo, dirección si aplica

**Crédito de Nómina IMSS**
- [ ] Rozher actúa como intermediario/asesor de qué institución otorgante (esto cambia el copy legal)
- [ ] Requisitos reales (documentos, edad, tipo de pensión aceptada, etc.)
- [ ] Montos, plazos, tasas o CAT — **solo si existen y pueden publicarse**
- [ ] Preguntas frecuentes reales del equipo comercial
- [ ] ¿El público objetivo son específicamente adultos mayores/pensionados? (define si adoptamos tipografía de mayor tamaño, como en PrestAngel, aunque compita un poco con la estética "premium" — lo marco como decisión a validar contigo, no lo doy por hecho)

**Legal**
- [ ] Aviso de privacidad (texto oficial o quién lo redacta)
- [ ] Términos y condiciones

**Leads**
- [ ] ¿A dónde deben llegar los leads inicialmente? (correo, número de WhatsApp Business, CRM ya existente)
- [ ] Número de WhatsApp oficial de asesores

Mientras no tengamos estos datos, cualquier vista de producto que construya usará `[INFORMACIÓN PENDIENTE]` de forma visible, nunca un dato de ejemplo disfrazado de real.
