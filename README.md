# Rozher Seguros — Sitio web

Sitio de captación de leads de **Rozher Seguros** (crédito IMSS, tarjetas y seguros).
Construido con **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS v4**.

Incluye: páginas de producto generadas desde un solo archivo de datos, formulario de leads
con envío a Google Sheets, botón de WhatsApp, medición lista para Google Tag Manager (servidor), GA4 y la API de Conversiones de Meta (apagada hasta configurarla), SEO
(Open Graph, sitemap, robots), encabezados de seguridad y páginas 404 / error propias.

---

## 1. Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | **20.9 o superior** (probado con 22; ver `.nvmrc`) |
| npm | 10 o superior (viene con Node) |

Comprueba con `node -v` y `npm -v`. Si usas `nvm`: `nvm install && nvm use`.

## 2. Instalar y ejecutar en local

```bash
# 1) Instalar dependencias (usa el package-lock.json: versiones exactas)
npm ci

# 2) Crear tu archivo de variables de entorno
cp .env.example .env.local          # en Windows (PowerShell): copy .env.example .env.local

# 3) Servidor de desarrollo
npm run dev
```

Abre <http://localhost:3000>.

> En local **no necesitas rellenar ninguna variable** para ver el sitio. Sin `LEADS_WEBHOOK_URL`
> el formulario responde "éxito" en desarrollo (sin enviar nada) y sin `NEXT_PUBLIC_WHATSAPP_NUMBER`
> los botones de WhatsApp abren `wa.me` sin número.

### Probar la versión de producción en tu máquina

`npm run start` **solo sirve una compilación ya hecha**: siempre ejecuta antes `npm run build`.
Para trabajar o revisar el sitio en tu máquina usa `npm run dev`.

```bash
npm run build
npm run start        # http://localhost:3000
```

**Probar desde otro equipo de tu red local** (por IP, sin HTTPS):

```bash
npm run build
npm run start -- -H 0.0.0.0 -p 3000     # y abre http://TU_IP:3000 desde el otro equipo
```

Funciona porque las protecciones exclusivas de HTTPS (`upgrade-insecure-requests`, HSTS) solo se activan cuando el sitio se sirve por HTTPS: en
Vercel, o si compilas con `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`. **No compiles con esa variable para pruebas por IP/HTTP**: el navegador pediría
los estilos y scripts por `https://` y la página se vería sin formato.

> En esta modalidad (producción) el formulario responde **error 503** si no definiste `LEADS_WEBHOOK_URL`.
> Es intencional: así no se pierden leads sin darte cuenta. Para probarlo de punta a punta, define esa variable.

## 3. Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga |
| `npm run build` | Compila para producción (falla si hay errores de tipos o de compilación) |
| `npm run start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con ESLint |
| `npm audit --omit=dev` | Revisa vulnerabilidades de lo que se publica (debe dar 0) |

## 4. Variables de entorno

Se definen en `.env.local` (local) o en el panel de tu hosting (producción). Plantilla en `.env.example`.

| Variable | ¿Visible en el navegador? | Para qué sirve |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública definitiva, sin `/` final (p. ej. `https://rozherseguros.com`). Se usa en Open Graph, sitemap y robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí | **Opcional.** Sobrescribe el WhatsApp oficial (por defecto 55 8034 9931, definido en `lib/contact.ts`). Formato internacional, solo dígitos |
| `NEXT_PUBLIC_GTM_ID` | Sí | ID del contenedor web de Google Tag Manager (`GTM-XXXXXXX`). Con GTM activo, GA4, el Pixel y la API de Conversiones se configuran dentro de GTM |
| `NEXT_PUBLIC_SGTM_URL` | Sí | URL https del contenedor de GTM del lado del servidor (`https://sgtm.tudominio.com`). Solo ajusta la política de seguridad |
| `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | Sí | Token de verificación de dominio de Meta (método etiqueta meta). Opcional: puede verificarse con un registro TXT en el DNS |
| `NEXT_PUBLIC_META_PIXEL_ID` | Sí | ID del Pixel de Meta (solo dígitos). **Solo para el modo "Pixel directo" sin GTM**; con GTM se ignora |
| `LEADS_WEBHOOK_URL` | **No** (solo servidor) | URL de la aplicación web de Google Apps Script (termina en `/exec`) que guarda los leads en Google Sheets |
| `LEADS_WEBHOOK_SECRET` | **No** (solo servidor) | Secreto compartido con el script de Google (debe ser idéntico al valor `SECRETO` del script) |

**Importante:** las variables `NEXT_PUBLIC_*` se incrustan al compilar. Si las cambias, hay que volver a ejecutar `npm run build` (o redesplegar).

## 5. Estructura del proyecto

```
app/                         Rutas (una carpeta por página)
  page.tsx                   Inicio
  productos/                 Listado de créditos
  productos/[slug]/          Plantilla de producto (se genera por cada producto disponible)
  seguros/  nosotros/  contacto/  privacidad/  terminos/  datos-legales/
  api/leads/route.ts         Recepción del formulario (validación + envío a Google Sheets)
  layout.tsx                 Layout global, metadatos, GTM y verificación de dominio
  not-found.tsx  error.tsx   Páginas 404 y de error
  robots.ts  sitemap.ts      SEO (se generan solos)
components/
  layout/                    Navbar y Footer
  sections/                  Secciones de la página de inicio
  product/                   Piezas de la página de producto
  forms/LeadForm.tsx         Formulario de leads
  legal/                     Plantilla de los documentos legales
  analytics/                 GTM / Pixel (Analytics.tsx) y seguimiento de vistas de producto
  shared/                    Piezas reutilizables (Container, Section, Pending, WhatsAppButton…)
lib/
  products/data.ts           ÚNICA fuente de productos (textos, FAQ, requisitos, estado)
  products/types.ts          Tipos de producto
  products/pending.ts        Marcador de información pendiente
  leads/forward.ts           Envío del lead a Google Sheets (vía Apps Script)
  security/request-guards.ts Límite de intentos, verificación de origen y tamaño
  validation/schemas.ts      Validación del formulario (Zod)
  analytics/events.ts        Eventos: dataLayer de GTM (con event_id) o Pixel directo
  whatsapp.ts  contact.ts    Enlaces y número oficial de WhatsApp
  legal.ts                   Datos legales de la empresa (razón social, domicilio, correo ARCO…)
  site.ts                    Constantes del sitio (URL, nombre, modo de medición)
public/                      Imágenes (public/images) e imagen Open Graph
next.config.ts               Encabezados de seguridad y CSP
docs/google-sheets/Code.gs    Script que se pega en la hoja de Google para recibir los leads
docs/medicion-gtm-ga4-meta.md Guía de GTM servidor, GA4, API de Conversiones y verificación de dominio
rozher-plan-arquitectura.md  Documento de arquitectura y fases del proyecto
```

## 6. Cómo editar el contenido

**Todo el contenido de los productos está en `lib/products/data.ts`.** No hay base de datos ni CMS.
Para cambiar un texto, una pregunta frecuente o un requisito, edita ese archivo y guarda.

### Estado de cada producto

Cada producto tiene un campo `status`:

| Valor | Efecto |
|---|---|
| `"disponible"` | Tiene página propia, aparece en el sitemap, en el carrusel y recibe leads |
| `"proximamente"` | Se muestra como tarjeta "Próximamente" **sin enlace**; su página da 404, no está en el sitemap y no recibe leads |
| `"pausado"` | Igual que `proximamente`, con la etiqueta "No disponible por ahora" |

**Estado actual:** solo el *Crédito de Nómina IMSS* está `disponible`. Las tarjetas Aeroméxico y los tres seguros están en
`proximamente` porque su contenido aún no está completo. Para publicar uno, completa sus textos y cambia su
`status` a `"disponible"`: el resto (página, sitemap, carrusel) se ajusta solo.

### Información pendiente

Cualquier dato que Rozher aún no confirma usa el valor `PENDING_INFO` y se muestra en la página como
"Información pendiente de confirmar". **Nunca lo sustituyas por un dato inventado.** Para ver qué falta:

```bash
grep -n "PENDING_INFO" lib/products/data.ts
```

### Diseño y estilos

El estilo (colores, esquinas, botones en píldora, tipografía y espacios) sigue una dirección visual de banca institucional y está
**centralizado en `app/globals.css`**. Cambiar un color, un radio o un tamaño ahí se refleja en todo el sitio.

- **Colores:** azul marino `#000254`, azul de acción `#0d6efd`, fondo `#f5f5f7`, tarjetas blancas y panel gris `#e6e5e5`.
- **Escala fluida:** títulos, textos y espacios usan `vw` con mínimo y máximo (`text-display`, `text-section`, `text-card`, `--gutter`,
  `--nav-h`…). Las proporciones se midieron sobre una referencia a **1536 px de ancho**; en otras pantallas escalan de forma proporcional.
- **Componentes comunes:** `.btn`, `.btn-primary`, `.btn-outline`, `.section-title` y `.site-container` (en `app/globals.css`).
- **Encabezado:** en la página de inicio la navegación es transparente sobre el carrusel y se vuelve azul al hacer scroll; en las demás
  páginas es azul siempre.
- **Pie de página:** la tarjeta de contacto va a caballo entre el fondo claro y el pie azul; reemplaza a la antigua sección de llamada a la acción.
- **Banner de inicio:** `public/images/hero/banner-imss.jpg` (1600×773). Es un banner claro con la persona en el tercio izquierdo y el resto
  libre: el texto se coloca en ese espacio vacío, en azul marino y sin overlay, y la imagen se muestra completa (el carrusel conserva su proporción).
  Para cambiarlo, sustituye el archivo por otro con la misma composición (sujeto a la izquierda, espacio libre a la derecha, preferible 2:1).
  Los slides se definen en `components/sections/HeroSlider.tsx`; `tone: "light"` es este estilo y `tone: "dark"` es una foto con overlay azul y texto
  blanco. La barra de navegación cambia sola el color de sus letras según el slide.
- Logo, textos e imágenes son de Rozher Seguros; no se usa ningún activo de terceros.

### Datos legales de la empresa

El aviso de privacidad, los términos y la página de datos legales ya están redactados (**borrador que debe revisar un abogado**).
Los datos propios de la empresa se capturan **en un solo archivo: `lib/legal.ts`** (razón social, domicilio, correo para derechos ARCO,
registros regulatorios, unidad de atención de quejas y ciudad de jurisdicción). Mientras un campo valga `PENDING_INFO`, el sitio
muestra "Información pendiente de confirmar". Reemplázalo por el texto real y guarda: las tres páginas y el pie de página se actualizan solos.
Si cambias los documentos, actualiza también las fechas `privacyUpdated` y `termsUpdated`.

### Imágenes

Van en `public/images/` y se referencian como `/images/archivo.jpg`. Usa JPG/WebP optimizados
(ancho máximo ~1920 px; las de tarjeta con 1200 px bastan).

## 7. Formulario de leads → Google Sheets

1. El visitante envía el formulario → `POST /api/leads`.
2. La API valida (origen, tamaño, campos, producto disponible, límite de intentos, honeypot).
3. Reenvía el lead, desde el servidor, a un **Google Apps Script** que lo agrega como fila nueva en tu hoja de Google.

El sitio **no guarda nada por sí mismo** (no hay base de datos): los leads viven solo en tu hoja de Google.

### Configurar la hoja (una sola vez, ~10 minutos)

1. Crea una hoja de cálculo nueva en [Google Sheets](https://sheets.google.com) (p. ej. "Leads Rozher Seguros").
   Contiene datos personales: compártela solo con quien deba verla.
2. Menú **Extensiones → Apps Script**. Borra el código que aparezca y pega el contenido de `docs/google-sheets/Code.gs`.
3. En la primera línea, cambia `SECRETO` por un texto **largo y aleatorio** (20+ caracteres). Guárdalo: lo necesitas en el paso 6.
4. Guarda (icono de disquete). Luego **Implementar → Nueva implementación → ⚙ → Aplicación web**:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona** (esto solo permite llamar a la URL; sin el secreto no se escribe nada)
5. Pulsa **Implementar** y autoriza los permisos (Google avisará que la app no está verificada: *Avanzado → Ir a… (no seguro)*; es tu propio script).
   Copia la **URL de la aplicación web** (termina en `/exec`).
6. Configura en la página (hosting o `.env.local`):
   ```
   LEADS_WEBHOOK_URL=<la URL que termina en /exec>
   LEADS_WEBHOOK_SECRET=<el mismo secreto del paso 3>
   ```
7. **Prueba:** abre la URL `/exec` en el navegador (debe mostrar `{"ok":true,"service":"leads-rozher"}`) y luego envía el formulario del sitio: debe aparecer una fila en la pestaña **Leads** (se crea sola, con encabezados).

Columnas: Fecha y hora (México), Nombre, Teléfono, Correo, Producto, Comentarios, Origen, ID de evento.

**Notas**

- Si modificas el script, crea una **nueva versión** (*Implementar → Administrar implementaciones → ✏ → Versión: Nueva*). La URL no cambia.
- El script guarda todo como texto plano, así que un dato que empiece con `=` o `+` nunca se ejecuta como fórmula.
- **Contrato:** el destino debe responder JSON `{"ok":true}`. Cualquier otra respuesta (error, página de inicio de sesión de Google, `ok:false`) se trata como fallo y el visitante ve el mensaje de error con la opción de WhatsApp, para no dar por enviado un lead que se perdió.
- En producción, **si no hay `LEADS_WEBHOOK_URL` la API responde 503**.
- Si más adelante cambias de destino (CRM, otro servicio), basta con apuntar `LEADS_WEBHOOK_URL` a un endpoint que acepte el mismo JSON y responda `{"ok":true}`. Actualiza entonces la sección 4 del aviso de privacidad (proveedores).

Cuerpo que recibe el destino:

```json
{
  "secret": "el-secreto-compartido",
  "name": "Juan Pérez",
  "phone": "8681234567",
  "email": null,
  "productSlug": "credito-nomina-imss",
  "productName": "Crédito de Nómina IMSS",
  "comments": null,
  "eventId": "uuid-para-deduplicar-con-meta",
  "source": "web-rozher",
  "receivedAt": "2026-11-05T20:02:26.152Z"
}
```

## 8. Medición: GTM (servidor), GA4 y Meta

> **Guía completa para el equipo técnico: [`docs/medicion-gtm-ga4-meta.md`](docs/medicion-gtm-ga4-meta.md).**

El código ya viene preparado; la configuración de las etiquetas se hace en las consolas de Google y Meta.

| Modo | Cuándo | Qué hace el sitio |
|---|---|---|
| **GTM** (recomendado) | Producción | Carga GTM y publica cada acción en el `dataLayer` con un `event_id` único. GA4, el Pixel y la API de Conversiones (desde un contenedor de servidor) se configuran en GTM |
| Pixel directo | Respaldo, sin GTM | Carga el Pixel con `NEXT_PUBLIC_META_PIXEL_ID` |
| Sin medición | Desarrollo | No carga nada |

**Con GTM activo el Pixel directo se desactiva solo**, para que ningún evento se cuente doble.

Eventos publicados: `page_view`, `view_item`, `form_start`, `generate_lead`, `contact`, `faq_open`. El `event_id` del `generate_lead`
es el mismo que se guarda en la hoja de Google (columna *ID de evento*), lo que permite auditar leads entre la hoja, GA4 y Meta.

Pasos resumidos (detalle en la guía):

1. Verificar el dominio `.com` en Meta (registro TXT o `NEXT_PUBLIC_META_DOMAIN_VERIFICATION`).
2. Crear el contenedor web y el de servidor de GTM; alojar el de servidor (Stape o Google Cloud) con un subdominio propio.
3. Definir `NEXT_PUBLIC_GTM_ID` y `NEXT_PUBLIC_SGTM_URL` en el hosting y **redesplegar**.
4. Configurar las etiquetas de GA4 y Meta (con `event_id` / `eventID` para deduplicar) y probar (Tag Assistant, Probar eventos, DebugView).
5. Antes de gastar en anuncios: Meta necesita ~50 eventos de optimización por conjunto de anuncios en 7 días para salir de la fase de aprendizaje.

A Google y Meta **no se envían** nombre, teléfono, correo ni comentarios. No actives la medición hasta publicar el aviso de privacidad
(su sección 7 cambia sola según la medición activa). Si más adelante activas la *coincidencia avanzada* (correo/teléfono cifrados en la
API de Conversiones), **hay que actualizar el aviso de privacidad antes**.

## 9. Seguridad

- Encabezados: CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (`next.config.ts`).
  Los dominios de Google y Meta solo se permiten en la CSP si hay medición activa (GTM o Pixel directo).
- `/api/leads`: mismo origen obligatorio, solo JSON, máximo 8 KB, esquema estricto (rechaza campos extra), honeypot,
  límite de 5 intentos por IP cada 10 min y verificación de que el producto exista y esté disponible.
- Los leads no se escriben en logs. La URL y el secreto del webhook son solo de servidor.
- **Limitación conocida:** el límite de intentos es por instancia (en memoria). En Vercel conviene activar
  *Firewall → Rate Limiting* sobre `/api/leads` para una protección global.

## 10. Publicar en internet (Vercel)

1. Sube el proyecto a un repositorio de GitHub (el `.gitignore` ya excluye `node_modules`, `.next` y `.env*`).
2. En [vercel.com](https://vercel.com): *Add New → Project* → importa el repositorio. Framework: Next.js (se detecta solo).
3. Plan **Pro** (el plan gratuito *Hobby* no permite uso comercial).
4. En *Settings → Environment Variables* carga las variables de la sección 4 (**antes del primer build**).
5. *Deploy*. Prueba en la URL `*.vercel.app`: llena el formulario y confirma que aparece una fila nueva en tu hoja de Google.
   Los *previews* salen con `noindex` automáticamente; solo producción se indexa.
6. **Dominio:** *Settings → Domains* → agrega tu dominio y crea en tu registrador los registros DNS que Vercel indique.
   Si usas Cloudflare, deja esos registros en "solo DNS" (nube gris).
7. Define `NEXT_PUBLIC_SITE_URL` con el dominio final y vuelve a desplegar.
8. Medición y Meta: sigue la guía [`docs/medicion-gtm-ga4-meta.md`](docs/medicion-gtm-ga4-meta.md) (verificar el dominio,
   crear GTM web y de servidor, definir `NEXT_PUBLIC_GTM_ID` y `NEXT_PUBLIC_SGTM_URL` y volver a desplegar).
   Vincula también la página de Facebook en Meta Business Suite.

Otros hostings: sirve cualquier plataforma con Node.js 20.9+ (`npm run build` y `npm run start`). No sirve un hosting
estático/PHP tradicional (cPanel) porque el sitio tiene una API (`/api/leads`).

## 11. Antes de publicar: pendientes

El código y los textos legales están completos; lo siguiente **depende de Rozher** y debe resolverse antes de la revisión de Meta:

- [ ] Completar `lib/legal.ts`: razón social, domicilio, correo para derechos ARCO, registros regulatorios (si aplican), unidad de atención de quejas y ciudad de jurisdicción.
- [ ] **Revisión de un abogado** del aviso de privacidad, los términos y los datos legales (son un borrador).
- [ ] Dominio `.com` definitivo comprado y sitio desplegado; verificarlo en Meta (Business Manager).
- [ ] Crear y alojar el contenedor de GTM del lado del servidor, con su subdominio; configurar GA4 y las etiquetas de Meta (ver `docs/medicion-gtm-ga4-meta.md`).
- [ ] Confirmar la vigencia de los datos del crédito IMSS (el manual de origen es de febrero de 2025).
- [ ] Definir si Inbursa autoriza publicar una tasa o un CAT de referencia (hoy la pregunta frecuente explica cómo se informan, sin cifras).
- [ ] Confirmar estas frases del sitio, que describen el servicio: "Cobertura nacional", "Tu proceso lo sigue una persona, no un sistema anónimo" y "Te explicamos por escrito las condiciones antes de que decidas".
- [ ] Contenido de las tarjetas Aeroméxico y de los tres seguros (hoy en `proximamente`).
- [ ] Revisar con el área legal el texto de los anuncios de crédito.

## 12. Solución de problemas

| Síntoma | Causa y solución |
|---|---|
| `Unsupported engine` / error de Node al instalar | Tienes Node anterior a 20.9. Actualiza (`nvm install 22`) |
| `Could not find a production build in the '.next' directory` | Ejecutaste `npm run start` sin compilar. Corre primero `npm run build` (o usa `npm run dev`) |
| `Next.js ignored package-lock.json in C:\Users\...` | Hay un `package-lock.json` suelto en una carpeta superior (p. ej. tu carpeta de usuario). Ya está neutralizado en `next.config.ts`; además puedes borrar ese archivo si no lo necesitas |
| `npm ci` falla | Borra `node_modules` y vuelve a ejecutar. No borres `package-lock.json` |
| Por `http://IP:3000` la página se ve en texto plano, sin estilos (con `localhost` sí se ve bien) | Se compiló con `NEXT_PUBLIC_SITE_URL=https://…` o en un entorno con HTTPS forzado, y se prueba por HTTP. Recompila sin esa variable (`npm run build`) para pruebas por IP; en producción con HTTPS no ocurre |
| El botón del formulario no hace nada al abrir por `http://IP:3000` | Algún código usaba funciones del navegador que solo existen en HTTPS o `localhost` (p. ej. `crypto.randomUUID`). Ya está resuelto con `lib/utils/id.ts`; al agregar código nuevo, evita APIs de "contexto seguro" sin una alternativa |
| El formulario responde error 503 en producción | Falta `LEADS_WEBHOOK_URL` en el hosting |
| El formulario responde error 502 | El script de Google rechazó o no recibió el lead. Revisa que el secreto sea idéntico en ambos lados, que la implementación tenga acceso *Cualquier persona* y que `LEADS_WEBHOOK_URL` termine en `/exec` |
| El formulario responde 403 | La petición viene de otro dominio, o el sitio se abre por una URL distinta a la que sirve el servidor |
| Cambié `NEXT_PUBLIC_*` y no se nota | Se incrustan al compilar: vuelve a ejecutar `npm run build` o redesplegar |
| Una página de producto da 404 | Su `status` no es `"disponible"` (ver sección 6) |
| El sitio no aparece en Google | Los previews tienen `noindex` a propósito; solo producción se indexa |
