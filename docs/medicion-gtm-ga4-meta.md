# Medición: GTM (servidor), GA4 y API de Conversiones de Meta

Guía para el equipo técnico. Explica **qué ya hace el código** y **qué se configura en las consolas** de
Google y Meta (esa parte no se puede automatizar desde el repositorio).

---

## 1. Arquitectura

```
                 ┌─────────────────────────── NAVEGADOR (el sitio) ───────────────────────────┐
 Visitante ───►  │  dataLayer: { event, event_id, ... }  ──►  Contenedor WEB de GTM (GTM-XXXX) │
                 │                                              ├─ Etiqueta GA4 ───────────┐   │
                 │                                              └─ Etiqueta Pixel de Meta  │   │
                 └──────────────────────────────────────────────────────────┬──────────────┼───┘
                                                                            │ (Pixel, con eventID)
                                              ┌─────────────────────────────▼───────┐      │
                                              │  Contenedor de SERVIDOR (sGTM)      │◄─────┘
                                              │  sgtm.tudominio.com (dominio propio)│
                                              │   ├─ Etiqueta GA4 ─────────► Google Analytics 4
                                              │   └─ Etiqueta API de Conversiones ──► Meta
                                              └─────────────────────────────────────┘
        Meta recibe cada evento DOS veces (navegador + servidor) y lo deduplica por event_name + event_id.
```

**Por qué así:** el servidor no depende del navegador (bloqueadores, iOS), la web carga más ligera y
Meta recomienda esta combinación (Pixel + API de Conversiones redundantes con deduplicación).

## 2. Lo que ya está hecho en el código

| Tema | Estado |
|---|---|
| Carga de GTM en `<head>` (síncrono, antes que cualquier evento) y `<noscript>` | Listo, se activa con `NEXT_PUBLIC_GTM_ID` |
| `dataLayer` con contrato de eventos y `event_id` único por evento | Listo (sección 3) |
| `page_view` en cada cambio de ruta (el sitio es una SPA y no recarga) | Listo |
| Claves del `dataLayer` anuladas entre eventos (GTM las "arrastra" si no) | Listo |
| El `event_id` del Lead es el **mismo** que se guarda en la hoja de Google (columna "ID de evento") | Listo: permite auditar 1 a 1 |
| Política de seguridad (CSP) con los dominios de Google/Meta/sGTM solo cuando GTM está activo | Listo |
| Sin `Cross-Origin-Opener-Policy` con GTM activo (rompe la vista previa de GTM) | Listo |
| Etiqueta de verificación de dominio de Meta (`NEXT_PUBLIC_META_DOMAIN_VERIFICATION`) | Listo |
| Aviso de privacidad que cambia solo según la medición activa | Listo |
| **Con GTM activo, el Pixel directo se desactiva** (`NEXT_PUBLIC_META_PIXEL_ID` se ignora) para no contar cada evento doble | Listo |

**Modos de operación (excluyentes)**

| Modo | Cuándo | Variables |
|---|---|---|
| **GTM** (recomendado) | Producción con GA4 + API de Conversiones | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_SGTM_URL` |
| **Pixel directo** | Respaldo temporal, sin GTM | `NEXT_PUBLIC_META_PIXEL_ID` |
| Sin medición | Desarrollo / antes de lanzar | ninguna |

## 3. Contrato del `dataLayer`

Todos los eventos incluyen `event_id` (UUID). Ningún evento lleva nombre, teléfono, correo ni comentarios del visitante.

| `event` | Cuándo se dispara | Parámetros | GA4 | Meta |
|---|---|---|---|---|
| `page_view` | Al cargar cada página y en cada cambio de ruta | `page_path`, `page_location`, `page_title` | `page_view` | `PageView` |
| `view_item` | Al entrar a la página de un producto | `product_slug`, `product_name`, `content_name`, `content_category`, `content_ids`, `items[]` | `view_item` | `ViewContent` |
| `form_start` | Al enfocar el formulario | `product_slug` | `form_start` (personalizado, opcional) | No enviar |
| `generate_lead` | Al enviarse el formulario con éxito | `product_slug`, `product_name`, `content_name`, `content_category` | `generate_lead` (**evento clave**) | `Lead` |
| `contact` | Clic en cualquier enlace de WhatsApp | `contact_method` (`whatsapp`), `product_slug` | `contact` (opcional como evento clave) | `Contact` |
| `faq_open` | Al abrir una pregunta frecuente | `faq_question` (máx. 100 caracteres), `product_slug` | `faq_open` (opcional) | No enviar |
| `cta_click` | Definido, **aún no se dispara** desde ningún componente | `cta_intent`, `cta_label`, `product_slug` | — | No enviar |

El orden en la página de producto es `view_item` y luego `page_view` (los efectos de React se ejecutan de hijo a padre); no afecta a la medición.

## 4. Contenedor WEB de GTM (en tagmanager.google.com)

**Variables → Variable de capa de datos** (versión 2), una por cada clave:
`event_id`, `page_path`, `page_location`, `page_title`, `product_slug`, `product_name`, `content_name`,
`content_category`, `content_ids`, `items`, `contact_method`.

**Activadores → Evento personalizado:** `page_view`, `view_item`, `generate_lead`, `contact`, `form_start`.

**Etiquetas**

1. **Etiqueta de Google (GA4)** — ID de medición `G-XXXXXXX`. Activador: *Initialization – All Pages*.
   Parámetros de configuración:
   - `server_container_url` = `https://sgtm.tudominio.com` (envía a tu contenedor de servidor).
   - `send_page_view` = `false` (el `page_view` lo manda el sitio; si no, se duplica).
2. **Etiquetas de evento GA4**, una por evento, con su activador de evento personalizado:
   `page_view`, `view_item` (enviar `items` = `{{DLV items}}`), `generate_lead`, `contact` (`contact_method`),
   `form_start`. **En todas, agrega el parámetro `event_id` = `{{DLV event_id}}`.**
3. **Pixel de Meta (navegador)** — plantilla oficial de Meta de la Galería de plantillas de la comunidad.
   - Inicialización con tu ID de Pixel, activador *Initialization – All Pages*, **sin PageView automático**.
   - Eventos estándar: `PageView` (activador `page_view`), `ViewContent` (`view_item`), `Lead` (`generate_lead`),
     `Contact` (`contact`).
   - **En todas, el campo ID de evento (`eventID`) = `{{DLV event_id}}`.** Sin esto no hay deduplicación.

No agregues datos personales a ninguna etiqueta (ver sección 9).

## 5. Contenedor de SERVIDOR (sGTM)

1. En GTM: *Crear contenedor → tipo Servidor*. Copia la **configuración del contenedor** que te muestra.
2. **Aloja el contenedor.** Opciones: **Stape.io** (administrado, planes de pago; verifica el plan gratuito
   y límites vigentes) o **Google Cloud Run / App Engine** (aprovisionamiento desde GTM; requiere facturación
   en Google Cloud y Google recomienda varias instancias en producción). Los costos varían: **verifica precios vigentes**.
3. **Dominio propio.** Crea un subdominio de tu dominio (p. ej. `sgtm.rozherseguros.com`) y apúntalo al contenedor con
   los registros DNS que indique tu proveedor. Al estar bajo el mismo dominio del sitio, las cookies de medición
   se tratan como propias y duran más. Requiere tener ya el dominio definitivo.
4. Define `NEXT_PUBLIC_SGTM_URL=https://sgtm.tudominio.com` y redespliega (solo ajusta la política de seguridad).
5. **Clientes:** deja el cliente *GA4* (viene por defecto) para recibir lo que manda la web.
6. **Etiquetas del servidor:**
   - *Google Analytics: GA4* → reenvía a tu propiedad.
   - *API de Conversiones de Meta* (plantilla de la Galería) con: ID de Pixel, **token de acceso**
     (Administrador de Eventos → Configuración → API de Conversiones → *Generar token de acceso*), origen de la acción
     `website`, y el **ID de evento tomado del parámetro `event_id`**. Mapeo:
     `page_view → PageView`, `view_item → ViewContent`, `generate_lead → Lead`, `contact → Contact`.
   - Para probar, usa el *código de evento de prueba* de Meta y quítalo al terminar.
7. Guarda el token de acceso **solo** en el contenedor de servidor. Nunca en este repositorio ni en variables `NEXT_PUBLIC_*`.

## 6. Verificación del dominio en Meta (obligatoria)

Business Manager → *Configuración del negocio* → *Seguridad de la marca* → *Dominios* → *Agregar*.
Verifica el **dominio raíz** (p. ej. `rozherseguros.com`), con el mismo negocio que es dueño del Pixel, la página de
Facebook y la cuenta publicitaria. Tres métodos, elige uno:

| Método | Cómo |
|---|---|
| **Registro TXT en el DNS** (recomendado, no toca el código) | Crea el registro TXT que Meta indica en el DNS del dominio |
| **Etiqueta meta** | Copia el token y defínelo en `NEXT_PUBLIC_META_DOMAIN_VERIFICATION`; redespliega; pulsa *Verificar* |
| Archivo HTML | Sube el archivo a `public/` del proyecto y redespliega |

## 7. Google Analytics 4

1. Crea la propiedad y un *flujo de datos web* con tu dominio. Copia el ID de medición (`G-…`) a la etiqueta de GTM.
2. En el flujo → *Medición mejorada* → engranaje → **desactiva "Cambios de página según eventos del historial del
   navegador"** (el sitio ya envía `page_view` en cada cambio de ruta; si no, cada navegación cuenta doble).
3. *Administrador → Eventos*: marca `generate_lead` como **evento clave** (y `contact` si lo usas como conversión secundaria).
4. *Configuración de datos → Retención*: 14 meses (el máximo en la versión estándar).
5. Valida con **DebugView** antes de lanzar.

**GA4 como auditor independiente:** cada lead queda registrado en tres lugares con el mismo identificador —
la hoja de Google (columna *ID de evento*), GA4 (`event_id` de `generate_lead`) y Meta (`event_id` del `Lead`).
Compara semanalmente: filas de la hoja ≈ `generate_lead` en GA4 ≈ `Lead` en Meta. Una diferencia grande indica
un problema de medición (bloqueadores, etiquetas mal configuradas, eventos duplicados).

## 8. Pruebas antes de lanzar campañas

- [ ] **GTM → Vista previa (Tag Assistant)** sobre el sitio: cada evento dispara sus etiquetas **una sola vez**.
- [ ] **Vista previa del contenedor de servidor:** llega la solicitud de GA4 y la etiqueta de Meta responde 200.
- [ ] **Meta → Administrador de eventos → Probar eventos:** aparecen eventos del navegador **y** del servidor, marcados como deduplicados.
- [ ] **Meta Pixel Helper** (extensión): un solo `PageView` por página.
- [ ] **GA4 → DebugView:** llegan `page_view`, `view_item`, `generate_lead`, `contact`.
- [ ] Envía un formulario de prueba y confirma que el mismo `event_id` está en la hoja, en GA4 y en Meta.
- [ ] A las 24–48 h, compara los totales (sección 7).

## 9. Privacidad

- Hoy **no se envía a Google ni a Meta nombre, teléfono, correo ni comentarios**. El aviso de privacidad lo afirma.
- Meta mejora la coincidencia de usuarios si recibe correo o teléfono cifrados (*coincidencia avanzada*). Si decides
  activarla: **actualiza antes el aviso de privacidad** (ya no sería cierto que no se envían) y consulta con tu abogado.
- Revisa con el área legal si tus anuncios de crédito requieren la categoría especial de anuncios de Meta en México
  y las leyendas obligatorias.

## 10. Fase de aprendizaje de Meta

El algoritmo necesita registrar **al menos 50 eventos de optimización por conjunto de anuncios en 7 días** para salir de
la fase de aprendizaje y optimizar con costos estables.

- **Elige el evento de optimización con volumen suficiente.** `Lead` (formulario) es la señal más valiosa pero la de menor
  volumen; `Contact` (clic en WhatsApp) tiene más volumen y menos calidad. Si con `Lead` no llegas a 50 por semana,
  consolida conjuntos de anuncios o prueba temporalmente con `Contact`.
- **Presupuesto mínimo por conjunto:** `50 × costo por evento = presupuesto semanal` (divídelo entre 7 para el diario).
  Calcúlalo con tu costo real; no se puede estimar desde el código.
- **No edites durante el aprendizaje** (presupuesto, segmentación, creativos): reinicia la fase.
- **Pocos conjuntos, más presupuesto cada uno:** muchos conjuntos pequeños reparten las conversiones y ninguno sale.
- **Los eventos deben fluir y deduplicarse antes de gastar en anuncios** (sección 8), porque la fase de aprendizaje usa lo que Meta recibe.
- Las conversaciones que ocurren *dentro* de WhatsApp no las ve el sitio; el sitio solo mide el clic (`Contact`) y el
  formulario (`Lead`).

## 11. Orden recomendado

1. Dominio definitivo comprado y sitio desplegado con HTTPS.
2. Verificar el dominio en Meta (sección 6).
3. Crear el contenedor web y el de servidor, con su subdominio (secciones 4 y 5).
4. Definir `NEXT_PUBLIC_GTM_ID` (y `NEXT_PUBLIC_SGTM_URL`) en el hosting y **redesplegar** (las `NEXT_PUBLIC_*` se incrustan al compilar).
5. Configurar GA4 (sección 7), probar (sección 8).
6. Lanzar campañas y esperar la fase de aprendizaje (sección 10).

## 12. Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| Cada evento llega doble a Meta | Pixel instalado dos veces (en GTM y directo). El código ya lo evita; revisa que en GTM no haya dos etiquetas de Pixel |
| `page_view` doble en GA4 | Falta `send_page_view = false` en la etiqueta de Google, o está activa la medición mejorada del historial (sección 7) |
| Meta no deduplica | Falta `event_id` en la etiqueta del navegador (`eventID`) o en la del servidor; deben ser idénticos |
| La vista previa de GTM no conecta | Algún encabezado `Cross-Origin-Opener-Policy` añadido por el hosting o una extensión. El sitio no lo envía con GTM activo |
| GTM no carga y la consola muestra "Refused to load…" | Falta un dominio en la CSP (`next.config.ts`). Revisa la consola, agrégalo y redespliega |
| Cambié `NEXT_PUBLIC_GTM_ID` y no se nota | Se incrusta al compilar: hay que redesplegar |
