# PORTAL 06 · SALFA FLOW — GESTIÓN DE PROYECTOS Y TAREAS CORPORATIVAS
**Ecosistema: Portales Salfa Pilotos · Salfa Montajes / SalfaCorp**  
*Clon Autónomo y Personalizado de Asana (`https://app.asana.com/`) adaptado a Google Workspace, Google Cloud y Dispositivos Android*

---

## 1. Ubicaciones Oficiales Asignadas
- **Carpeta Local (Fuente de la Verdad):** `E:\Claude\Portales-Salfa-Pilotos\06-portal-salfa-flow\`
- **Espejo en Google Drive Corporativo:** `G:\Mi unidad\Portales Salfa Pilotos\06-portal-salfa-flow\`
- **URL de Prueba Local:** `http://localhost:5500/06-portal-salfa-flow/index.html`
- **Proyecto Android Nativo:** `E:\Claude\Portales-Salfa-Pilotos\06-portal-salfa-flow\android\`

---

## 2. Estructura de Archivos del Portal
```text
06-portal-salfa-flow/
├── index.html                                  # Frontend SPA responsivo y móvil (Motor Dual LocalStorage + Apps Script)
├── manifest.webmanifest                        # Manifiesto PWA para instalación nativa en Android
├── sw.js                                       # Service Worker para Modo Terreno Offline en faena
├── assets/                                     # Logotipos corporativos e iconos oficiales Salfa Montajes
├── android/                                    # Proyecto Nativo Android Studio (compilable a APK)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml                 # Permisos de cámara, red, FileProvider
│   │   ├── java/com/salfamontajes/flow/
│   │   │   ├── MainActivity.kt                 # WebView acelerado por hardware con soporte de cámara
│   │   │   └── SalfaWebAppInterface.kt         # Puente JavaScript-Android (vibración háptica, toasts)
│   │   └── res/                                # Iconos mipmap, temas oscuros y splash screen Salfa
│   ├── build.gradle                            # Configuración de compilación Android
│   ├── compilar-android.ps1                    # Script PowerShell de compilación rápida
│   ├── compilar-android.bat                    # Acceso rápido en Windows
│   └── README.md                               # Guía de despliegue en celulares Android
├── proyecto/
│   ├── Codigo.gs                               # Backend Google Apps Script V8 (doGet, doPost, LockService)
│   ├── appsscript.json                         # Manifiesto V8 con zona horaria America/Santiago
│   └── index.html                              # Copia espejo lista para despliegue con Clasp / Apps Script
├── docs/
│   └── ANALISIS-REPLICA-Y-WORKSPACE.md         # Documento Maestro de Ingeniería Inversa y Consultoría
└── README.md                                   # Ficha técnica
```

---

## 3. Modelo Relacional de Datos en Google Sheets
Cuando se conecta con Google Apps Script, el libro de Google Sheets se estructura automáticamente en 5 pestañas:

1. **`TAREAS`**:
   `[ID, TITULO, PROYECTO_ID, PROYECTO_NOMBRE, SECCION, RESPONSABLE, FECHA_ENTREGA, ESTADO, PRIORIDAD, AREA, DESCRIPCION, COMPLETADA, FECHA_CREACION, ULTIMA_MODIFICACION]`
2. **`PROYECTOS`**:
   `[ID, NOMBRE, ICONO, ESTADO, DESCRIPCION, FECHA_CREACION]`
3. **`SUBTAREAS`**:
   `[ID, TAREA_ID, TITULO, COMPLETADA]`
4. **`COMENTARIOS`**:
   `[ID, TAREA_ID, AUTOR, FECHA, TEXTO]`
5. **`BITACORA`**:
   `[TIMESTAMP, USUARIO, ACCION, ID_ELEMENTO, DETALLE]`

---

## 4. Funcionalidades Destacadas en Escritorio y Terreno
- **Navegación Multivista:** Lista responsiva con Container Queries, Tablero Kanban de arrastre/cambio rápido, Cronograma Gantt de barras, Calendario mensual, Panel con KPIs numéricos y gráficos de barras, Archivos vinculados a Google Drive (`G:\`).
- **Task Drawer Lateral y Bottom Sheet Móvil:** Edición en tiempo real de títulos, fechas, asignados y áreas; botones de aprobación corporativa Salfa (Aprobar, Pedir Cambios, Rechazar); lista de subtareas interactivas y feed de comentarios.
- **Asistente Salfa Dash IA (Gemini API):** Resumen de tareas complejas, sugerencia automática de subtareas para montaje industrial y redacción de actualizaciones para minutas e informes de obra.
- **Modo Terreno Offline en Faena:** Almacenamiento en caché con Service Worker (`sw.js`) y cola de sincronización para operar en túneles, minas y faenas sin cobertura 4G/5G.
- **Captura Fotográfica de Obra:** Integración con la cámara nativa del celular para registrar evidencia fotográfica de inspecciones directamente en la tarea.
- **Navegación Táctil Android:** Bottom Navigation Bar con 5 accesos rápidos (`Inicio`, `Mis Tareas`, `FAB Central (+)`, `Bandeja`, `Proyectos`) y respuesta háptica por vibración.

---

## 5. Aplicación Móvil Android
El portal cuenta con un proyecto Android Studio nativo en `android/`:
1. **Abrir en Android Studio:** Abrir la carpeta `android/` y ejecutar en el celular o emulador.
2. **Compilar APK:** Ejecutar `compilar-android.bat` o `./gradlew assembleDebug` para generar `app-debug.apk`.
3. **Instalación:** Ejecutar `adb install app/build/outputs/apk/debug/app-debug.apk` o transferir directamente al dispositivo.

---

## 6. Instrucciones de Ejecución y Sincronización
1. **Prueba en Navegador Local:**
   Abre en el navegador:
   `http://localhost:5500/06-portal-salfa-flow/index.html`
2. **Sincronización con Google Drive:**
   Ejecuta en PowerShell:
   ```powershell
   powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
   ```
3. **Despliegue en Google Apps Script:**
   - Abre un nuevo proyecto en [script.google.com](https://script.google.com).
   - Copia el contenido de `proyecto/Codigo.gs` y `proyecto/appsscript.json`.
   - Crea un archivo HTML llamado `index.html` y pega el código de `index.html`.
   - Despliega como Web App (`Ejecutar como: Usuario que accede`, `Acceso: Cualquier usuario con cuenta Salfa Montajes`).
