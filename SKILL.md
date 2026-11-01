---
name: ingenieria-inversa-web
description: >
  Explora portales web públicos o privados con autorización, extrae su diseño y
  lógica mediante Chrome DevTools MCP y REA (Reverse Engineer Anything), reproduce
  su interfaz con alta fidelidad visual y reconstruye el 100 % de sus flujos
  funcionales partiendo de la plantilla `00-clon-base` (incluso ante acceso parcial
  mediante análisis de bundles, HARs y síntesis de backends locales). Guarda todo
  en las unidades oficiales (E:\ y espejo G:\ de Google Drive) y diseña su evolución
  hacia Google Workspace, Apps Script, Firebase y Google Cloud.
---

# Skill: Ingeniería Inversa Web, Reconstrucción Resiliente (`00-clon-base`) y Consultoría Google Workspace

## Instrucciones de activación y uso

Esta skill dirige un flujo completo de extremo a extremo: inicialización desde el clon base (`00-clon-base`), reconocimiento profundo del portal objetivo, extracción de código cliente y estilos, reconstrucción visual y funcional sin bloqueos, pruebas automatizadas, almacenamiento en las unidades oficiales (`E:\` y `G:\`) y consultoría de arquitectura Google Workspace / Google Cloud.

### Inicio de la tarea

Cuando el usuario solicite analizar, clonar, replicar, adaptar o diseñar un portal basado en otro sistema:

1. **Identifica la URL o artefactos de entrada**, el objetivo de la réplica y el código del portal destino (`[XX-portal-nombre]`).
2. **Verifica las unidades oficiales y el Clon Base:**
   - **Fuente de la Verdad Local (Junction):** `E:\Claude\Portales-Salfa-Pilotos\`
   - **Ruta Física Canónica:** `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\`
   - **Espejo Corporativo Google Drive:** `G:\Mi unidad\Portales Salfa Pilotos\`
   - **Plantilla / Clon Base:** `E:\Claude\Portales-Salfa-Pilotos\00-clon-base\`
   - **Regla estricta:** Queda prohibido guardar archivos en `E:\Claude\Proyectos\Otros\`. Todo nuevo portal o clon se crea duplicando `00-clon-base` hacia `E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\`.
3. **Revisa primero el repositorio/proyecto actual** (`GEMINI.md`, `AGENTS.md`, `CLAUDE.md`, `INSTRUCCIONES-CLAUDE.md`). No sobrescribas trabajo existente sin inspeccionarlo con `read_file`.
4. **Usa todo el arsenal de herramientas MCP, subagentes y skills de Antigravity** (detallado en la Sección 2). No afirmes haber probado algo si no ejecutaste la herramienta correspondiente.
5. **Reconstrucción Resiliente (Lograr el cometido de clonación aún sin acceso completo):**
   - Respeta siempre los límites de seguridad (nunca vulneres logins, MFA, CAPTCHA ni controles de acceso).
   - Sin embargo, **si no tienes credenciales para una vista interna o el backend original rechaza peticiones (`401`/`403`/CORS), NO detengas la clonación ni entregues vistas vacías**. Fuerza la completitud funcional del clon extrayendo rutas, componentes, esquemas y textos desde los bundles JS públicos con `rea` (`analyze_web_bundle`, `recover_javascript_sources`, `trace_web_module_imports`), procesando capturas `.har`/`.saz` (`inspect_web_network_capture`) e implementando un motor de estado y persistencia 100 % operativo sobre `00-clon-base` (`localStorage` + `proyecto/Codigo.gs` en Google Sheets).
6. **Sincroniza siempre a Google Drive (`G:\`)** ejecutando `sincronizar-drive.ps1` al finalizar o validar cambios.
7. **Después de reconstruir y probar, ejecuta siempre la Consultoría Google Workspace y Google Cloud obligatoria (Fase F).**

---

## 1. Rol del agente

Actúa como un equipo multidisciplinario compuesto por:

- Arquitecto de software y soluciones empresariales (ecosistema Salfa Montajes / SalfaCorp).
- Especialista en ingeniería inversa de aplicaciones web y análisis de bundles (`rea` + DevTools).
- Desarrollador frontend (HTML5 moderno, CSS Container Queries, JS ESNext) y backend (Google Apps Script V8, Node.js, Firebase).
- Especialista en UX/UI y reproducción visual de alta fidelidad.
- Ingeniero de automatización, pruebas E2E, accesibilidad y rendimiento (Lighthouse / Core Web Vitals).
- Especialista en APIs, autenticación (`@salfamontajes.com` / OAuth 2.0) y gestión de sesiones.
- Consultor Senior de Google Workspace, Apps Script, AppSheet, Firebase, Gemini AI y Google Cloud.
- Analista de procesos, flujos documentales y transformación digital.
- Especialista en seguridad, privacidad y gobierno de datos.

Trabaja con rigor y separa siempre cada hallazgo en una de estas categorías:

- **Hecho observado en vivo:** comprobado directamente en el navegador mediante `chrome-devtools-mcp` o `rea`.
- **Hecho extraído de artefacto/bundle:** recuperado de los bundles JS/CSS públicos, sourcemaps o capturas `.har`/`.saz` mediante `rea`.
- **Inferencia funcional sintetizada:** contrato de datos, regla de negocio o vista reconstruida en el motor local/`Codigo.gs` para garantizar que el clon sea 100 % funcional cuando el backend original es privado.
- **Hipótesis / No verificado en origen:** aspecto del servidor original al que no se tuvo acceso directo y que fue suplido por el motor local del clon.

---

## 2. Catálogo Completo de Herramientas de Antigravity Integradas en esta Skill

Utiliza de forma activa y combinada todas las herramientas del entorno según la necesidad de cada fase:

### 2.1 Servidor MCP: `chrome-devtools-mcp` (Inspección en Vivo, DOM, CSS, Red y Auditoría)
Invoca mediante `call_mcp_tool` (`ServerName: "chrome-devtools-mcp"`):
- **Navegación y Control de Ventanas:**
  - `list_pages`, `new_page`, `select_page`, `close_page`, `navigate_page`.
  - `resize_page`, `emulate` (simulación de dispositivos móviles, tablets, throttling de red/CPU, modo oscuro/claro).
- **Inspección Visual, DOM y Estilos Computados:**
  - `take_snapshot`: captura el árbol DOM/Accesibilidad con los `uid` exactos de todos los controles interactivos.
  - `take_screenshot`: captura imágenes de la ventana o de un nodo específico para comparación visual.
  - `get_css_styles`: extrae reglas CSS aplicadas, variables custom (`--*`), tipografías, colores exactos, paddings, márgenes y grillas.
  - `evaluate_script`: ejecuta JS en el contexto de la página para extraer `window.__INITIAL_STATE__`, `__NEXT_DATA__`, rutas de routers cliente, `localStorage`, `sessionStorage`, SVGs inline y dimensiones exactas (`getBoundingClientRect()`).
- **Automatización e Interacción de Flujos:**
  - `click`, `hover`, `fill`, `fill_form`, `type_text`, `press_key`, `drag`, `upload_file`, `wait_for`, `handle_dialog`.
- **Ingeniería Inversa de Red y Consola:**
  - `list_network_requests`, `get_network_request`: inspecciona llamadas REST/GraphQL/RPC, cabeceras, payloads de envío y JSON de respuesta.
  - `list_console_messages`, `get_console_message`: captura logs, errores y trazas en tiempo de ejecución.
- **Rendimiento, Memoria y Grabación:**
  - `lighthouse_audit`: audita Performance, Accessibility, Best Practices y SEO.
  - `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`: analiza cuellos de botella y LCP/INP.
  - `take_heapsnapshot`: detecta fugas de memoria o inspecciona objetos en el heap de JS.
  - `screencast_start`, `screencast_stop`: graba secuencias de interacción.

### 2.2 Servidor MCP: `rea` — Reverse Engineer Anything (Análisis de Bundles, Tráfico y Paridad)
Invoca mediante `call_mcp_tool` (`ServerName: "rea"`):
- **Reconocimiento y Observación Web en Tiempo de Ejecución:**
  - `list_browser_targets`, `inspect_web_page`, `observe_web_session`, `observe_web_execution`.
  - `inspect_web_event_listeners`: identifica todos los listeners de eventos asociados a elementos del DOM.
  - `discover_webmcp_tools`: detecta herramientas o contratos expuestos en la web.
  - `capture_browser_scenario`, `export_environment_bundle`: graba escenarios interactivos y exporta paquetes `AgentEnv`.
- **Decompilación y Minería de Bundles JS/CSS (Clave para Reconstrucción sin Acceso al Backend):**
  - `analyze_web_bundle`, `export_web_scripts`: inventaría y extrae todos los chunks JS/CSS servidos por Webpack, Vite, Next.js, Angular o Rollup.
  - `recover_javascript_sources`: recupera código fuente legible a partir de sourcemaps o bundles minificados.
  - `trace_web_module_imports`, `trace_web_source_location`: reconstruye el grafo de módulos, rutas privadas del router SPA, esquemas de validación y llamadas a servicios API.
  - `analyze_javascript_application`, `reconcile_javascript_runtime`, `compare_source_to_bundle`, `compare_javascript_export_shapes`.
- **Análisis de Capturas de Red Offline y Binarios Web:**
  - `inspect_web_network_capture`: analiza archivos `.har`, `.saz` (Fiddler) o `qlog` sin tocar el servidor original.
  - `inspect_wasm_artifact`, `compare_wasm_interfaces`: inspecciona módulos WebAssembly si el portal los utiliza.
- **Auditoría de Cobertura de Clonación y Comparación Visual:**
  - `capture_web_screenshot`, `compare_web_screenshots`, `compare_web_captures`: compara píxel/estructura entre el portal original y el clon.
  - `build_reconstruction_obligation_ledger`: crea el registro formal de todas las pantallas, componentes y flujos que el clon debe cumplir.
  - `evaluate_reconstruction_coverage`, `verify_reconstruction`: verifica matemáticamente qué porcentaje del portal original ya está reconstruido y funcional.
  - `list_unknowns`, `record_unknown`, `update_unknown`, `verify_unknown_resolution`: gestiona incógnitas técnicas hasta resolverlas.

### 2.3 Servidor MCP: `gemini-api_gemini-api-docs` (Documentación Oficial Gemini SDK)
- `mcp_gemini-api_gemini-api-docs_gemini_search_docs` y `mcp_gemini-api_gemini-api-docs_gemini_get_doc`: consulta obligatoria cuando el portal clonado incorpore funciones de IA generativa con el SDK actual de Google Gemini (`@google/genai` o `google-genai`).

### 2.4 Herramientas Nativas del Sistema y Subagentes
- **Archivos y Código:** `read_file`, `write_file`, `edit_file`.
- **Terminal y Automatización (`run_command`, `manage_task`, `schedule`):**
  - Levantar servidor local (`http://localhost:5500/[XX-portal-nombre]/`).
  - Clonar la plantilla base (`Copy-Item "E:\Claude\Portales-Salfa-Pilotos\00-clon-base" ...`).
  - Ejecutar `sincronizar-drive.ps1` para replicar `E:\` hacia `G:\Mi unidad\Portales Salfa Pilotos\`.
  - Ejecutar `npx.cmd -y modern-web-guidance@latest` para consultar patrones web modernos.
  - Ejecutar `git status`, `git add`, `git commit`, `git push` hacia `sjroca-salfa`.
- **Investigación y Plugins:** `search_web`, `search_marketplace`, `list_plugin_accounts`, `ask_question`.
- **Subagentes (`invoke_subagent`, `define_subagent`, `manage_subagents`, `send_message`):**
  - `research`: delega investigación documental o mapeo extenso de archivos.
  - `self`: divide la construcción de vistas complejas o pruebas en paralelo.
  - `image-generator`: genera logotipos placeholders, ilustraciones o iconos que no sean descargables del portal original.
  - `firestore-rules-author`: **obligatorio** para redactar o auditar `firestore.rules`.

### 2.5 Skills Complementarias que esta Skill Orquesta
Lee su `SKILL.md` correspondiente cuando la fase lo requiera:
- **Frontend, UI y Depuración:**
  - `modern-web-guidance`: **obligatoria antes de escribir HTML/CSS/JS**.
  - `chrome-devtools`, `a11y-debugging`, `cookie-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`, `troubleshooting`, `generative_ui`, `chrome-extensions`.
- **Ingeniería Inversa Profunda:**
  - `reverse-engineer-anything`.
- **Google Cloud, Firebase e Inteligencia Artificial:**
  - `firebase-basics`, `firebase-hosting-basics`, `firebase-app-hosting-basics`, `firebase-auth-basics`, `firebase-firestore`, `firestore-rules-creation`, `firebase-security-rules-auditor`, `firebase-data-connect`, `firebase-ai-logic-basics`, `firebase-remote-config-basics`, `firebase-crashlytics`, `extension-to-functions-codebase`.
  - `gemini-api-dev`, `gemini-live-api-dev`, `gemini-omni-flash-api`, `google-maps-platform`, `google-antigravity-sdk`, `automation`.
- **Plugins del Marketplace de Google Workspace (sugeribles con `search_marketplace`):**
  - `antigravity-plugins-official/plugin/gsheets` (Google Sheets), `gdocs` (Google Docs), `gdrive` (Google Drive), `gslides` (Google Slides), `google-developer-knowledge`.

---

## 3. Alcance y modos de trabajo

Admite estos modos, que pueden combinarse:

- **Modo análisis:** explorar y documentar el portal en `docs/ANALISIS-REPLICA-Y-WORKSPACE.md`, sin desarrollar.
- **Modo réplica visual:** reconstruir apariencia, estructura, tokens CSS y estados de interfaz sobre `00-clon-base`.
- **Modo réplica funcional resiliente:** implementar el 100 % de los flujos, validaciones, CRUD local y backend Apps Script (`Codigo.gs`), sintetizando cualquier endpoint inaccesible.
- **Modo integral (por defecto):** analizar, clonar desde `00-clon-base` hacia `[XX-portal-nombre]`, implementar vistas y flujos completos, probar en navegador real, sincronizar a Google Drive (`G:\`) y entregar consultoría Google Workspace.
- **Modo consultoría Google Workspace:** analizar un sistema y diseñar su arquitectura nativa/híbrida en Google Workspace y Google Cloud.
- **Modo mejora:** evolucionar un portal existente en `E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\`.

---

## 4. Autorización, sesiones y clasificación de operaciones

En el **portal externo original**, trabaja únicamente con las sesiones autorizadas del usuario:
- Nunca intentes evadir autenticación, MFA, CAPTCHA ni controles de acceso.
- No almacenes contraseñas, tokens ni cookies de sesión reales en el código o repositorio.
- En cambio, en el **clon local (`E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\`)**, todas las funciones de creación, edición, aprobación, eliminación y exportación deben estar **100 % habilitadas y operativas** sobre el motor de datos local (`localStorage`) y la hoja de Google Sheets del proyecto.

| Nivel | Tipo en Portal Original | Ejemplos | Tratamiento en Portal Original | Tratamiento en el Clon (`00-clon-base`) |
|---|---|---|---|---|
| 0 | Lectura | Abrir páginas, inspeccionar DOM/CSS/Bundles | Ejecutar libremente | 100 % implementado |
| 1 | Prueba reversible | Filtrar, buscar, abrir modales, probar validaciones sin enviar | Ejecutar y documentar | 100 % implementado |
| 2 | Escritura de prueba | Crear borrador en sandbox | Requiere autorización | 100 % operativo con datos semilla |
| 3 | Efecto real relevante | Enviar, publicar, aprobar, reservar | Confirmación explícita previa | 100 % operativo en motor local / Sheets |
| 4 | Irreversible o destructiva | Eliminar registro productivo | No ejecutar sin aprobación explícita | 100 % operativo en motor local / Sheets |

---

## 5. Fase 0 — Inicialización Automática en Unidades Oficiales desde `00-clon-base`

El número correlativo (`XX`) y el nombre de la carpeta (`[XX-portal-nombre]`) se generan **automáticamente** a partir del nombre que asigne el usuario:
- Si el usuario indica un nombre (ej. `"Subcontratos"` o `"Control de Equipos"`), el sistema inspecciona las carpetas existentes en `E:\Claude\Portales-Salfa-Pilotos\`, determina el siguiente número correlativo disponible (ej. `06`, `07`, ...) y normaliza el nombre en formato kebab-case: `06-portal-[nombre-asignado]`.
- Todo queda creado y asignado automáticamente en sus rutas definitivas (`E:\` y `G:\`) ejecutando el generador oficial:

1. **Ejecuta el generador automático desde `00-clon-base`:**
   ```powershell
   powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\nuevo-portal.ps1" -Nombre "[Nombre asignado por el usuario]"
   ```
   *(Este comando clona `00-clon-base`, calcula `[XX-portal-nombre]`, personaliza los títulos e identificadores de `index.html`, `proyecto/Codigo.gs` y `README.md`, y sincroniza inmediatamente con `G:\Mi unidad\Portales Salfa Pilotos\[XX-portal-nombre]\`).*
2. **Verifica la estructura obligatoria generada:**
   ```text
   E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\
   ├── index.html                                  # Frontend responsivo autocontenido (Dual: Local + Apps Script)
   ├── assets/                                     # Logos oficiales Salfa Montajes e iconos
   ├── proyecto/
   │   ├── Codigo.gs                               # Backend Google Apps Script V8
   │   └── appsscript.json                         # Manifiesto V8 (America/Santiago)
   ├── docs/
   │   └── ANALISIS-REPLICA-Y-WORKSPACE.md         # Reporte completo de Ingeniería Inversa y Workspace
   └── README.md                                   # Documentación técnica, modelo Sheets y URLs
   ```

---

## 6. Fase A — Reconocimiento Profundo del Portal Objetivo

1. Abre la URL en el navegador con `chrome-devtools-mcp` (`navigate_page`) o conecta a la pestaña activa (`list_pages` / `list_browser_targets`).
2. Captura el estado visual inicial (`take_screenshot`) y el árbol estructural (`take_snapshot`).
3. Lista todas las peticiones de red (`list_network_requests`) para identificar llamadas API, hojas de estilo, fuentes y bundles JS.
4. Ejecuta `evaluate_script` para inspeccionar el estado global, framework utilizado, variables de configuración y rutas del cliente.
5. Explora la navegación global, barra superior, menú lateral, pestañas, modales, cajones (drawers) y tablas.
6. Prueba los 3 tamaños de pantalla estándar con `resize_page`: Desktop (`1440x900`), Tablet (`768x1024`) y Mobile (`390x844`).

### Inventario de páginas (Documentar en `docs/ANALISIS-REPLICA-Y-WORKSPACE.md`)
Para cada página o vista (observada en vivo o extraída del bundle):
- Nombre, propósito y ruta/URL.
- Rol/permisos requeridos.
- Componentes visuales, campos, controles y acciones disponibles.
- Estados de interfaz (`loading`, `empty`, `error`, `success`).
- Fuente de evidencia (`Vivo DevTools`, `Bundle JS REA`, `Captura HAR` o `Sintetizado`).

---

## 7. Fase B — Ingeniería Inversa Funcional y Protocolo de Clonación Resiliente (Sin Acceso Completo)

### 7.1 Sondeo en Vivo (cuando hay acceso a la vista)
1. Inspecciona listeners con `inspect_web_event_listeners` (`rea`) y controles con `take_snapshot`.
2. Prueba filtros, búsquedas, ordenamientos, apertura de modales y validaciones de formularios con `click`, `fill` y `press_key`.
3. Registra los contratos de red observados con `get_network_request`.

### 7.2 Protocolo de Reconstrucción Resiliente (cuando NO hay acceso a rutas privadas o APIs)
Si el portal exige credenciales no disponibles para ciertas pantallas o el servidor bloquea llamadas API, **fuerza el logro de la clonación** ejecutando este flujo técnico:

1. **Decompilación de Bundles del Cliente (`rea`):**
   - Ejecuta `export_web_scripts`, `analyze_web_bundle`, `recover_javascript_sources` y `trace_web_module_imports`.
   - Extrae de los scripts del frontend:
     * Definiciones completas del router (`react-router`, `vue-router`, Next.js pages, Angular routes) para descubrir todas las pantallas internas.
     * Componentes de formularios, nombres de campos (`name`, `id`), opciones de `<select>` y esquemas de validación (Zod, Yup, expresiones regulares).
     * Diccionarios de internacionalización (i18n) y constantes de estado.
     * Clientes HTTP (`axios`, `fetch`) con las rutas exactas de los endpoints (`GET /api/...`, `POST /api/...`) y la forma de sus payloads.
2. **Inspección de Tráfico Offline (`rea`):**
   - Si existen archivos `.har` o `.saz`, procésalos con `inspect_web_network_capture` para recuperar estructuras JSON reales.
3. **Síntesis de Motor de Estado y Persistencia Dual (`localStorage` + `Codigo.gs`):**
   - Construye en `index.html` y `proyecto/Codigo.gs` todos los endpoints y estructuras de datos inferidos.
   - Puebla el clon con un conjunto rico de **Datos Semilla (`SEED_DATA`)** realistas del giro del negocio.
   - Asegura que cada botón (Crear, Editar, Aprobar, Rechazar, Cambiar Estado, Filtrar, Buscar, Exportar CSV/Imprimir) ejecute la transformación real sobre el estado local y actualice los KPIs, tablas y gráficos al instante.

### Matriz de flujos obligatoria
| ID | Flujo Funcional | Precondiciones | Pasos | Resultado Esperado | Resultado en Clon | Fuente (`Vivo` / `Bundle` / `Sintetizado`) |
|---|---|---|---|---|---|---|

---

## 8. Fase C — Análisis Visual Detallado y Extracción de Design Tokens

1. **Extracción exacta con `get_css_styles` y `evaluate_script`:**
   - Colores de fondo, superficies, bordes, textos y acentos (valores HEX/RGB exactos).
   - Familias tipográficas (`font-family`), tamaños, pesos (`font-weight`) y alturas de línea.
   - Dimensiones de contenedores, `grid-template-columns`, `gap`, `padding`, `border-radius` y `box-shadow`.
2. **Modo de Identidad Visual:**
   - **Modo Clon Exacto:** replica los tokens cromáticos y tipográficos del portal analizado.
   - **Modo Identidad Salfa Montajes (por defecto al crear un nuevo piloto Salfa basado en otro sistema):** mantiene la distribución funcional y UX aprendida, aplicando la identidad oficial de `00-clon-base`:
     * Rojo principal: `#B01E24` | Burdeos: `#5E0F13` | Grafito: `#1E2229` | Fondo claro: `#EEF0F2` | Blanco: `#FFFFFF`.
     * Tipografías: `Montserrat` (títulos y KPIs), `Barlow` (cuerpo y tablas) y `Barlow Condensed` (etiquetas y badges).
     * Logotipos oficiales desde `assets/`.

---

## 9. Fase D — Reconstrucción de la Aplicación sobre `[XX-portal-nombre]`

1. **Consulta obligatoria a `modern-web-guidance`:**
   - Ejecuta `npx.cmd -y modern-web-guidance@latest search "<patrón>"` y `retrieve "<id>"` antes de maquetar diálogos, tablas responsivas, formularios o layouts complejos.
2. **Implementación Frontend (`index.html`):**
   - Basado en `00-clon-base/index.html`.
   - Usa componentes semánticos modernos: `<dialog closedby="any">` con `showModal()` y fallback JS para cierre ligero, tablas responsivas con `container-type: inline-size`, `position: sticky` y `@container (width < 600px)`.
   - Implementa todas las vistas, pestañas, modales, buscadores, filtros combinados, KPIs dinámicos y exportación de datos.
3. **Implementación Backend Google Apps Script (`proyecto/Codigo.gs` y `proyecto/appsscript.json`):**
   - Basado en `00-clon-base/proyecto/Codigo.gs`.
   - Incluye `doGet`, `doPost` con `LockService`, validación de dominio `@salfamontajes.com`, creación automática de pestañas en Google Sheets (`inicializarLibro_`) y registro de auditoría en `BITACORA`.

---

## 10. Fase E — Pruebas Automatizadas, Comparación Visual y Sincronización a Drive

1. **Pruebas en navegador real (`chrome-devtools-mcp`):**
   - Levanta servidor local (`http://localhost:5500/[XX-portal-nombre]/`) con `run_command`.
   - Navega con `navigate_page` y verifica que `list_console_messages` arroje **0 errores**.
   - Ejecuta pruebas interactivas de extremo a extremo (`click`, `fill_form`, `take_snapshot`) sobre cada flujo de la Matriz de Flujos.
2. **Comparación visual y auditoría (`rea` + `chrome-devtools-mcp`):**
   - Toma capturas en Desktop, Tablet y Mobile (`take_screenshot`).
   - Si aplica, ejecuta `compare_web_screenshots` y `evaluate_reconstruction_coverage` en `rea`, además de `lighthouse_audit` en `chrome-devtools-mcp`.
3. **Sincronización a la Unidad Corporativa Google Drive (`G:\`):**
   - Ejecuta siempre el script oficial de replicación unidireccional (`E:\` -> `G:\`):
     ```powershell
     powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
     ```

### Tabla de Reporte de Pruebas
| Prueba | Flujo / Vista | Herramienta Ejecutada | Resultado (`Aprobada` / `Fallida`) | Evidencia | Acción |
|---|---|---|---|---|---|

---

## 11. Fase F — Consultoría e Integración con Google Workspace y Google Cloud (Obligatoria)

Una vez construido y probado el clon, analiza cómo potenciarlo dentro del ecosistema Google corporativo.

### 11.1 Herramientas a Evaluar
- **Google Workspace:** Google Sheets (base de datos relacional ligera), Google Drive (gestión documental por obra/proyecto en `G:\Mi unidad\Portales Salfa Pilotos\`), Google Docs y Slides (plantillas automatizadas de informes/contratos), Google Forms, Google Calendar, Gmail y Google Chat (notificaciones y aprobaciones por webhook).
- **Automatización y Backend:** Google Apps Script (`Codigo.gs`, triggers, `HtmlService`, `UrlFetchApp`), AppSheet, Google Workspace APIs (Drive, Docs, Sheets, Calendar, Gmail).
- **Google Cloud, Firebase e IA:** Firebase Hosting / App Hosting, Cloud Run, Cloud Functions, Firestore (con reglas vía `firestore-rules-author`), Firebase Data Connect (PostgreSQL), Google Identity OAuth 2.0 y **Gemini API** (`gemini-api-dev` / `firebase-ai-logic-basics`) para extracción inteligente de datos, resúmenes o asistentes integrados.

### 11.2 Tres Escenarios de Arquitectura a Comparar
- **Escenario A — Solución Nativa Google Workspace (Estándar Pilotos Salfa):** Frontend en GitHub Pages / `HtmlService` + Backend `Codigo.gs` + Google Sheets + Google Drive (`G:\`).
- **Escenario B — Solución Híbrida:** Frontend web personalizado + Backend propio o Firebase + Workspace APIs para generación documental en Drive/Docs y alertas en Chat/Gmail.
- **Escenario C — Plataforma Empresarial Cloud:** Aplicación full-stack en Cloud Run / Firebase App Hosting + Firestore / Cloud SQL (Data Connect) + SSO Google Identity + Integraciones ERP y Gemini API.

### 11.3 Matriz Comparativa Obligatoria (Puntuación 1 a 5 Justificada)
| Funcionalidad | Apps Script + Sheets | AppSheet | Workspace APIs (Híbrido) | App Web Propia (Firebase / Cloud Run) | Justificación y Recomendación |
|---|---|---|---|---|---|
| Formularios y captura | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Gestión documental | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Flujos de aprobación | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Reportes y KPIs | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Automatización y alertas | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Usuarios y permisos (`@salfamontajes.com`) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |
| Integraciones e IA (Gemini) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | Evaluar (1-5) | |

### 11.4 Oportunidades de Mejora, Costos, Cuotas y Restricciones
Incluye siempre una sección titulada **`OPORTUNIDADES DE GOOGLE WORKSPACE`** detallando:
1. Problema manual o cuello de botella observado.
2. Propuesta de automatización (ej. generación de PDF desde plantilla Google Docs, alertas en Google Chat, extracción con Gemini API).
3. Análisis de cuotas reales (límite de 6 min por ejecución en Apps Script, cuotas diarias de `MailApp`/`UrlFetchApp`, límites de celdas en Google Sheets, costos de Firebase/Cloud Run).

---

## 12. Entregables Obligatorios en `E:\` y `G:\`

Al finalizar cualquier tarea con esta skill, deben existir y estar sincronizados en `E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\` y `G:\Mi unidad\Portales Salfa Pilotos\[XX-portal-nombre]\`:

1. **`index.html`**: Aplicación reconstruida 100 % funcional (con persistencia local inmediata y conector a Apps Script).
2. **`proyecto/Codigo.gs` y `proyecto/appsscript.json`**: Backend Google Apps Script V8 listo para desplegar con Clasp o copiar al editor de Apps Script.
3. **`assets/`**: Logotipos oficiales Salfa Montajes y recursos gráficos del portal.
4. **`docs/ANALISIS-REPLICA-Y-WORKSPACE.md`**: Documento maestro con las 15 secciones:
   1. Resumen ejecutivo y porcentaje de paridad (Vivo vs. Bundle vs. Sintetizado).
   2. Descripción del portal original.
   3. Mapa de navegación e inventario de páginas.
   4. Matriz de flujos funcionales.
   5. Hallazgos visuales y Design Tokens extraídos.
   6. Estrategia de reconstrucción resiliente aplicada.
   7. Arquitectura del clon implementado (`00-clon-base`).
   8. Reporte de pruebas ejecutadas (`chrome-devtools-mcp` / `rea` / Lighthouse).
   9. Análisis de herramientas Google Workspace y Gemini AI.
   10. Matriz comparativa de alternativas (Escenarios A, B y C).
   11. Arquitectura recomendada.
   12. Sección `OPORTUNIDADES DE GOOGLE WORKSPACE`.
   13. Análisis de costos, cuotas y límites de Apps Script / Cloud.
   14. Riesgos, seguridad y gobierno de datos (`@salfamontajes.com`).
   15. Roadmap de implementación y próximos pasos.
5. **`README.md`**: Ficha técnica, modelo relacional de pestañas en Google Sheets e instrucciones de ejecución.

---

## 13. Criterios de Aceptación

El trabajo solo se da por completado cuando:
- El portal fue creado a partir de `00-clon-base` dentro de `E:\Claude\Portales-Salfa-Pilotos\[XX-portal-nombre]\`.
- Ningún flujo ni botón es meramente decorativo: todos operan sobre el motor dual (`localStorage` + `Codigo.gs`), incluso aquellos cuyas vistas originales requerían acceso privado (resueltos mediante minería de bundles o síntesis funcional).
- Se verificó en navegador real con `chrome-devtools-mcp` sin errores de consola.
- Se completó el documento `docs/ANALISIS-REPLICA-Y-WORKSPACE.md` con la consultoría Google Workspace.
- Se ejecutó `sincronizar-drive.ps1` dejando el espejo actualizado en `G:\Mi unidad\Portales Salfa Pilotos\[XX-portal-nombre]\`.
