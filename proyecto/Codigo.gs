/**
 * PORTAL 06 · SALFA FLOW — GESTIÓN DE PROYECTOS Y TAREAS (SALFA MONTAJES)
 * Backend Google Apps Script (V8)
 *
 * Ubicación Local:  E:\Claude\Portales-Salfa-Pilotos\06-portal-salfa-flow\proyecto\Codigo.gs
 * Espejo en Drive:  G:\Mi unidad\Portales Salfa Pilotos\06-portal-salfa-flow\proyecto\Codigo.gs
 * Administrador:    sjroca@salfamontajes.com
 * Dominio oficial:  @salfamontajes.com
 */

var DOMINIO_SALFA = '@salfamontajes.com';
var HOJA_TAREAS = 'TAREAS';
var HOJA_PROYECTOS = 'PROYECTOS';
var HOJA_SUBTAREAS = 'SUBTAREAS';
var HOJA_COMENTARIOS = 'COMENTARIOS';
var HOJA_BITACORA = 'BITACORA';
var HOJA_CONFIG = 'CONFIG';

function getProp_(k) {
  return PropertiesService.getScriptProperties().getProperty(k) || '';
}

function getAdmins_() {
  var raw = getProp_('ADMINS');
  if (!raw) return ['sjroca@salfamontajes.com', 'sroca@salfamontajes.com'];
  return raw.split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
}

function getSs_() {
  var id = getProp_('SPREADSHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function validarAcceso_(correo) {
  if (!correo) return false;
  var c = String(correo).trim().toLowerCase();
  if (getAdmins_().indexOf(c) !== -1) return true;
  return c.indexOf(DOMINIO_SALFA) !== -1;
}

/**
 * Punto de entrada WebApp (doGet)
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.api) {
    return handleApiGet_(params);
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Portal 06 · Salfa Flow — Salfa Montajes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/**
 * Punto de entrada API REST/RPC (doPost) con LockService
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse_({ ok: false, error: 'Servidor ocupado. Intenta nuevamente.' });
  }

  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch (ex) { payload = {}; }
    }

    var accion = payload.accion || '';
    var usuario = payload.usuario || 'sjroca@salfamontajes.com';

    if (!validarAcceso_(usuario)) {
      return jsonResponse_({ ok: false, error: 'Acceso restringido a cuentas corporativas @salfamontajes.com' });
    }

    var res = { ok: true };
    switch (accion) {
      case 'inicializar':
        res.data = inicializarLibro_();
        break;
      case 'sincronizar':
      case 'sincronizarDatos':
        res.data = sincronizarDatos_(payload.datos || {}, usuario);
        break;
      case 'listarTareas':
        res.data = listarTareas_();
        break;
      case 'guardarTarea':
        res.data = guardarTarea_(payload.tarea || {}, usuario);
        break;
      case 'guardarProyecto':
        res.data = guardarProyecto_(payload.proyecto || {}, usuario);
        break;
      case 'eliminarTarea':
        res.data = eliminarTarea_(payload.id || '', usuario);
        break;
      case 'cambiarEstadoTarea':
        res.data = cambiarEstadoTarea_(payload.id, payload.nuevoEstado, payload.completada, usuario);
        break;
      case 'obtenerEstadoCompleto':
        res.data = { tareas: listarTareas_(), proyectos: listarProyectos_() };
        break;
      default:
        res = { ok: false, error: 'Acción no reconocida: ' + accion };
    }
    return jsonResponse_(res);
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

function handleApiGet_(params) {
  try {
    var tipo = params.tipo || 'tareas';
    if (tipo === 'proyectos') {
      return jsonResponse_({ ok: true, data: listarProyectos_() });
    }
    return jsonResponse_({ ok: true, data: listarTareas_() });
  } catch (e) {
    return jsonResponse_({ ok: false, error: e.message });
  }
}

/**
 * Inicializa pestañas y cabeceras si no existen
 */
function inicializarLibro_() {
  var ss = getSs_();
  var hojasRequeridas = [
    {
      nombre: HOJA_TAREAS,
      cabeceras: ['ID', 'TITULO', 'PROYECTO_ID', 'PROYECTO_NOMBRE', 'SECCION', 'RESPONSABLE', 'FECHA_ENTREGA', 'ESTADO', 'PRIORIDAD', 'AREA', 'DESCRIPCION', 'COMPLETADA', 'FECHA_CREACION', 'ULTIMA_MODIFICACION']
    },
    {
      nombre: HOJA_PROYECTOS,
      cabeceras: ['ID', 'NOMBRE', 'ICONO', 'ESTADO', 'DESCRIPCION', 'FECHA_CREACION']
    },
    {
      nombre: HOJA_SUBTAREAS,
      cabeceras: ['ID', 'TAREA_ID', 'TITULO', 'COMPLETADA']
    },
    {
      nombre: HOJA_COMENTARIOS,
      cabeceras: ['ID', 'TAREA_ID', 'AUTOR', 'FECHA', 'TEXTO']
    },
    {
      nombre: HOJA_BITACORA,
      cabeceras: ['TIMESTAMP', 'USUARIO', 'ACCION', 'ID_ELEMENTO', 'DETALLE']
    }
  ];

  var creadas = [];
  hojasRequeridas.forEach(function(def) {
    var hoja = ss.getSheetByName(def.nombre);
    if (!hoja) {
      hoja = ss.insertSheet(def.nombre);
      hoja.appendRow(def.cabeceras);
      hoja.getRange(1, 1, 1, def.cabeceras.length).setBackground('#B01E24').setFontColor('#FFFFFF').setFontWeight('bold');
      hoja.setFrozenRows(1);
      creadas.push(def.nombre);
    }
  });

  return { creadas: creadas, totalHojas: ss.getSheets().length };
}

/**
 * Sincroniza el estado completo enviado desde el cliente
 */
function sincronizarDatos(appState) {
  var usuario = Session.getActiveUser().getEmail() || 'sjroca@salfamontajes.com';
  return sincronizarDatos_(appState, usuario);
}

function sincronizarDatos_(appState, usuario) {
  var ss = getSs_();
  inicializarLibro_();

  if (appState.tasks && appState.tasks.length > 0) {
    var hojaTareas = ss.getSheetByName(HOJA_TAREAS);
    var lastRow = hojaTareas.getLastRow();
    if (lastRow > 1) {
      hojaTareas.deleteRows(2, lastRow - 1);
    }

    var filasTareas = appState.tasks.map(function(t) {
      return [
        t.id || '',
        t.title || '',
        t.projectId || '',
        t.projectName || t.project || '',
        t.section || 'Pendientes activos',
        t.assignee || 'SEBASTIAN',
        t.dueDate || t.due || '',
        t.status || 'En progreso',
        t.priority || 'Media',
        t.area || '',
        t.desc || '',
        (t.completed || t.tab === 'finalizadas' || t.status === 'Completado') ? 'SI' : 'NO',
        t.createdAt || new Date().toISOString(),
        new Date().toISOString()
      ];
    });

    if (filasTareas.length > 0) {
      hojaTareas.getRange(2, 1, filasTareas.length, filasTareas[0].length).setValues(filasTareas);
    }
  }

  registrarBitacora_(usuario, 'SINCRONIZAR_TODO', 'GLOBAL', 'Sincronizadas ' + (appState.tasks ? appState.tasks.length : 0) + ' tareas');
  return { ok: true, timestamp: new Date().toISOString() };
}

/**
 * Guarda o actualiza una tarea en la hoja TAREAS
 */
function guardarTarea_(tarea, usuario) {
  if (!tarea || !tarea.title) {
    throw new Error('La tarea debe contener al menos un título.');
  }
  var ss = getSs_();
  inicializarLibro_();
  var hoja = ss.getSheetByName(HOJA_TAREAS);
  var id = tarea.id || ('t_' + new Date().getTime());
  var lastRow = hoja.getLastRow();
  var rowIndex = -1;

  if (lastRow > 1) {
    var ids = hoja.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id)) {
        rowIndex = i + 2;
        break;
      }
    }
  }

  var ahora = new Date().toISOString();
  var fila = [
    id,
    tarea.title || '',
    tarea.projectId || '',
    tarea.projectName || tarea.project || '',
    tarea.section || 'Pendientes activos',
    tarea.assignee || 'SEBASTIAN',
    tarea.dueDate || tarea.due || '',
    tarea.status || 'En progreso',
    tarea.priority || 'Media',
    tarea.area || '',
    tarea.desc || '',
    (tarea.completed || tarea.tab === 'finalizadas' || tarea.status === 'Completado') ? 'SI' : 'NO',
    tarea.createdAt || ahora,
    ahora
  ];

  if (rowIndex > 1) {
    hoja.getRange(rowIndex, 1, 1, fila.length).setValues([fila]);
    registrarBitacora_(usuario, 'ACTUALIZAR_TAREA', id, 'Tarea "' + tarea.title + '" actualizada');
  } else {
    hoja.appendRow(fila);
    registrarBitacora_(usuario, 'CREAR_TAREA', id, 'Tarea "' + tarea.title + '" creada');
  }

  return { ok: true, id: id, tarea: tarea, timestamp: ahora };
}

/**
 * Guarda o actualiza un proyecto en la hoja PROYECTOS
 */
function guardarProyecto_(proyecto, usuario) {
  if (!proyecto || !proyecto.name) {
    throw new Error('El proyecto debe contener un nombre.');
  }
  var ss = getSs_();
  inicializarLibro_();
  var hoja = ss.getSheetByName(HOJA_PROYECTOS);
  var id = proyecto.id || ('p_' + new Date().getTime());
  var lastRow = hoja.getLastRow();
  var rowIndex = -1;

  if (lastRow > 1) {
    var ids = hoja.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id) || String(ids[i][1]) === String(proyecto.name)) {
        rowIndex = i + 2;
        break;
      }
    }
  }

  var ahora = new Date().toISOString();
  var fila = [
    id,
    proyecto.name,
    proyecto.icon || 'list',
    proyecto.status || 'En curso',
    proyecto.desc || '',
    proyecto.createdAt || ahora
  ];

  if (rowIndex > 1) {
    hoja.getRange(rowIndex, 1, 1, fila.length).setValues([fila]);
    registrarBitacora_(usuario, 'ACTUALIZAR_PROYECTO', id, 'Proyecto "' + proyecto.name + '" actualizado');
  } else {
    hoja.appendRow(fila);
    registrarBitacora_(usuario, 'CREAR_PROYECTO', id, 'Proyecto "' + proyecto.name + '" creado');
  }

  return { ok: true, id: id, proyecto: proyecto, timestamp: ahora };
}

/**
 * Elimina una tarea por ID
 */
function eliminarTarea_(id, usuario) {
  var ss = getSs_();
  var hoja = ss.getSheetByName(HOJA_TAREAS);
  if (!hoja || hoja.getLastRow() <= 1) return { ok: false, error: 'No hay tareas' };

  var ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      hoja.deleteRow(i + 2);
      registrarBitacora_(usuario, 'ELIMINAR_TAREA', id, 'Tarea eliminada');
      return { ok: true, id: id };
    }
  }
  return { ok: false, error: 'Tarea no encontrada' };
}

/**
 * Cambia el estado de una tarea
 */
function cambiarEstadoTarea_(id, nuevoEstado, completada, usuario) {
  var ss = getSs_();
  var hoja = ss.getSheetByName(HOJA_TAREAS);
  if (!hoja || hoja.getLastRow() <= 1) return { ok: false, error: 'No hay tareas' };

  var ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      var row = i + 2;
      hoja.getRange(row, 8).setValue(nuevoEstado);
      hoja.getRange(row, 12).setValue(completada ? 'SI' : 'NO');
      hoja.getRange(row, 14).setValue(new Date().toISOString());
      registrarBitacora_(usuario, 'CAMBIAR_ESTADO', id, 'Nuevo estado: ' + nuevoEstado + ' (Completada: ' + (completada ? 'SI' : 'NO') + ')');
      return { ok: true, id: id, nuevoEstado: nuevoEstado, completada: completada };
    }
  }
  return { ok: false, error: 'Tarea no encontrada' };
}

function listarTareas_() {
  var ss = getSs_();
  var hoja = ss.getSheetByName(HOJA_TAREAS);
  if (!hoja || hoja.getLastRow() <= 1) return [];

  var data = hoja.getRange(2, 1, hoja.getLastRow() - 1, 14).getValues();
  return data.map(function(r) {
    return {
      id: r[0],
      title: r[1],
      projectId: r[2],
      projectName: r[3],
      section: r[4],
      assignee: r[5],
      dueDate: r[6] ? (r[6] instanceof Date ? Utilities.formatDate(r[6], 'America/Santiago', 'yyyy-MM-dd') : String(r[6])) : '',
      status: r[7],
      priority: r[8],
      area: r[9],
      desc: r[10],
      completed: r[11] === 'SI'
    };
  });
}

function listarProyectos_() {
  var ss = getSs_();
  var hoja = ss.getSheetByName(HOJA_PROYECTOS);
  if (!hoja || hoja.getLastRow() <= 1) return [];

  var data = hoja.getRange(2, 1, hoja.getLastRow() - 1, 6).getValues();
  return data.map(function(r) {
    return {
      id: r[0],
      name: r[1],
      icon: r[2],
      status: r[3],
      desc: r[4]
    };
  });
}

function registrarBitacora_(usuario, accion, idElemento, detalle) {
  try {
    var ss = getSs_();
    var hoja = ss.getSheetByName(HOJA_BITACORA);
    if (!hoja) return;
    hoja.appendRow([
      new Date().toISOString(),
      usuario,
      accion,
      idElemento,
      detalle
    ]);
  } catch (e) {
    console.error('Error registrando bitácora', e);
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// FUNCIONES PÚBLICAS EXPUESTAS A GOOGLE.SCRIPT.RUN PARA EL CLIENTE HTML
// =========================================================================

function guardarTarea(tarea) {
  var usuario = Session.getActiveUser().getEmail() || 'sjroca@salfamontajes.com';
  return guardarTarea_(tarea, usuario);
}

function guardarProyecto(proyecto) {
  var usuario = Session.getActiveUser().getEmail() || 'sjroca@salfamontajes.com';
  return guardarProyecto_(proyecto, usuario);
}

function eliminarTarea(id) {
  var usuario = Session.getActiveUser().getEmail() || 'sjroca@salfamontajes.com';
  return eliminarTarea_(id, usuario);
}

function cambiarEstadoTarea(id, nuevoEstado, completada) {
  var usuario = Session.getActiveUser().getEmail() || 'sjroca@salfamontajes.com';
  return cambiarEstadoTarea_(id, nuevoEstado, completada, usuario);
}

function listarTareas() {
  return listarTareas_();
}

function listarProyectos() {
  return listarProyectos_();
}

function obtenerEstadoCompleto() {
  return {
    tareas: listarTareas_(),
    proyectos: listarProyectos_(),
    timestamp: new Date().toISOString()
  };
}
