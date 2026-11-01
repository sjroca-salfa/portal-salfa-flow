# APLICACIÓN MÓVIL ANDROID · SALFA FLOW (PORTAL 06)
**Ecosistema: Portales Salfa Pilotos · Salfa Montajes / SalfaCorp**  
*Fecha: Octubre 2026 | Arquitectura: PWA + Android Nativo Studio (WebView Hardware Accelerated + FileProvider)*

---

## 1. Visión General y Propósito
Esta aplicación para dispositivos móviles Android (`com.salfamontajes.flow`) traslada la plataforma **Salfa Flow** (Portal 06) al terreno, permitiendo a supervisores, jefes de obra, ingenieros de montaje y cuadrillas en faena:

1. **Monitoreo y Actualización de Tareas en Obra:** Acceso directo a listas de tareas pendientes, entregables y asignaciones con interfaz táctil optimizada estilo Asana Mobile.
2. **Captura Directa de Fotos en Terreno:** Integración con la cámara del dispositivo móvil mediante `FileProvider` seguro (`MediaStore.ACTION_IMAGE_CAPTURE`), registrando evidencia fotográfica de inspecciones y avances con fecha, hora y metadatos de obra.
3. **Operatividad Sin Conexión (Modo Terreno Offline):** Persistencia en `localStorage` combinada con el `Service Worker` PWA (`sw.js`). Las tareas creadas o marcadas offline en faena se almacenan en cola local y se sincronizan automáticamente con Google Sheets / Apps Script al reestablecer cobertura 4G/5G o WiFi.
4. **Navegación Móvil de Alto Rendimiento:**
   - **Bottom Navigation Bar (5 accesos directos):** `Inicio`, `Mis Tareas`, `Botón Flotante Central FAB (+)` para acciones rápidas en faena, `Bandeja de Entrada` con badge de novedades, y `Proyectos`.
   - **Hoja de Acciones Rápidas (Action Sheet):** Menú flotante emergente para crear tareas, tomar fotos de obra, dictar minutas de voz o crear proyectos.
   - **Task Drawer Táctil (Bottom Sheet):** Cajón de tareas que se desliza desde la parte inferior de la pantalla con asa táctil y controles optimizados para uso con guantes o en terreno.
   - **Respuesta Háptica:** Vibración nativa Android (`SalfaWebAppInterface.vibrate()`) al completar tareas o interactuar con controles críticos.
   - **Gesto Nativo Pull-to-Refresh:** Deslizar hacia abajo con `SwipeRefreshLayout` para forzar la actualización de datos desde Google Sheets.

---

## 2. Estructura del Proyecto Android

```text
06-portal-salfa-flow/android/
├── settings.gradle                         # Configuración de repositorios y módulos
├── build.gradle                            # Gradle raíz
├── gradle.properties                       # Parámetros JVM y soporte AndroidX
├── compilar-android.ps1                    # Script PowerShell de validación y compilación
├── compilar-android.bat                    # Acceso rápido en Windows
├── README.md                               # Documentación técnica
└── app/
    ├── build.gradle                        # Configuración de compilación, dependencias y SDK 34
    └── src/
        └── main/
            ├── AndroidManifest.xml         # Permisos (Cámara, Red, Vibración) y FileProvider
            ├── java/
            │   └── com/salfamontajes/flow/
            │       ├── MainActivity.kt     # Actividad Android principal con WebView y soporte de cámara
            │       └── SalfaWebAppInterface.kt # Puente de comunicación JavaScript - Android Nativo
            └── res/
                ├── values/
                │   ├── strings.xml         # Textos y nombres corporativos
                │   ├── colors.xml          # Paleta oficial Salfa Montajes (#B01E24, #161616, etc.)
                │   └── themes.xml          # Tema FullScreen sin ActionBar y Splash Screen
                ├── xml/
                │   ├── file_paths.xml      # Rutas seguras para compartir fotos de la cámara
                │   ├── data_extraction_rules.xml
                │   └── backup_rules.xml
                ├── drawable/
                │   ├── ic_salfa_logo.xml   # Logotipo Salfa Montajes en vectores XML
                │   └── splash_background.xml # Splash screen de inicio corporativo
                └── mipmap-*/               # Iconos de la aplicación en todas las densidades
```

---

## 3. Instrucciones de Compilación y Generación de APK

### Opción A: Compilación y Ejecución en Android Studio (Recomendada)
1. Abrir **Android Studio**.
2. Seleccionar **File -> Open...** y navegar hasta la carpeta:
   `E:\Claude\Portales-Salfa-Pilotos\06-portal-salfa-flow\android\`
3. Esperar la sincronización de Gradle (*Gradle Sync*).
4. Para ejecutar en el emulador o en tu celular conectado por USB:
   - Presionar **Run 'app'** (`Shift + F10`).
5. Para generar el archivo APK instalable:
   - Ir al menú **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
   - El APK resultante quedará disponible en:
     `06-portal-salfa-flow/android/app/build/outputs/apk/debug/app-debug.apk`

### Opción B: Compilación Rápida por Consola
En una consola PowerShell en esta carpeta:
```powershell
.\compilar-android.ps1
```
O ejecutando el archivo por lotes `compilar-android.bat`.

---

## 4. Instalación del APK en el Teléfono Celular
1. Conectar el teléfono Android al computador mediante cable USB.
2. Asegurarse de tener activada la **Depuración USB** en *Opciones de Desarrollador*.
3. Ejecutar mediante el comando `adb`:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```
4. Alternativamente, copiar el archivo `app-debug.apk` a la memoria interna del teléfono (o enviarlo por Google Drive / WhatsApp) y abrirlo para instalarlo directamente.

---

## 5. Modo PWA Alternativo (Sin Instalar APK)
Si no se desea instalar el APK nativo, cualquier colaborador puede ingresar desde Chrome en su teléfono Android a la URL del portal:
1. Abrir `http://localhost:5500/06-portal-salfa-flow/index.html` (o la URL de GitHub Pages / Google Apps Script).
2. Tocar el menú de opciones de Chrome (tres puntos verticales `⋮`).
3. Seleccionar **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
4. Se instalará automáticamente con el icono oficial de Salfa Montajes, pantalla de inicio independiente y funcionalidad offline completa gracias a `manifest.webmanifest` y `sw.js`.
