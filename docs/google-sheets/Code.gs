/**
 * RECEPTOR DE LEADS — Rozher Seguros
 * ---------------------------------------------------------------------------
 * Este script vive DENTRO de tu hoja de Google (Extensiones → Apps Script) y
 * guarda cada lead que envía la página web como una fila nueva en la pestaña
 * "Leads". Instrucciones completas: sección 7 del README del proyecto.
 *
 * ANTES DE IMPLEMENTAR: reemplaza SECRETO por un texto largo y aleatorio
 * (20+ caracteres) y usa EXACTAMENTE el mismo valor en la variable
 * LEADS_WEBHOOK_SECRET de la página. Sin coincidencia, no se guarda nada.
 */
var SECRETO = 'CAMBIA_ESTE_TEXTO_POR_UN_SECRETO_LARGO';

var NOMBRE_PESTANA = 'Leads';
var ENCABEZADOS = [
  'Fecha y hora (México)',
  'Nombre',
  'Teléfono',
  'Correo',
  'Producto',
  'Comentarios',
  'Origen',
  'ID de evento'
];

/** Recibe un lead (POST desde el servidor de la página). */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);

    // Rechaza todo lo que no traiga el secreto correcto (o si no se cambió el valor por defecto).
    if (SECRETO === 'CAMBIA_ESTE_TEXTO_POR_UN_SECRETO_LARGO' || data.secret !== SECRETO) {
      return respuesta_({ ok: false, error: 'unauthorized' });
    }

    lock.waitLock(15000); // evita que dos leads simultáneos se pisen

    var hoja = obtenerHoja_();
    var fecha = Utilities.formatDate(
      data.receivedAt ? new Date(data.receivedAt) : new Date(),
      'America/Mexico_City',
      'yyyy-MM-dd HH:mm:ss'
    );

    var fila = [
      fecha,
      data.name,
      data.phone,
      data.email,
      data.productName || data.productSlug,
      data.comments,
      data.source,
      data.eventId
    ].map(function (v) {
      return v === null || v === undefined ? '' : String(v).substring(0, 1000);
    });

    // Formato de texto plano: evita que un valor que empiece con "=", "+", "-" o "@"
    // se interprete como fórmula (inyección de fórmulas) y conserva el "+" de los teléfonos.
    var destino = hoja.getRange(hoja.getLastRow() + 1, 1, 1, fila.length);
    destino.setNumberFormat('@');
    destino.setValues([fila]);

    return respuesta_({ ok: true });
  } catch (err) {
    return respuesta_({ ok: false, error: 'error' });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignorar) {}
  }
}

/** Permite comprobar desde el navegador que la implementación está activa. */
function doGet() {
  return respuesta_({ ok: true, service: 'leads-rozher' });
}

function obtenerHoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_PESTANA) || libro.insertSheet(NOMBRE_PESTANA);
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setValues([ENCABEZADOS]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function respuesta_(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON
  );
}
