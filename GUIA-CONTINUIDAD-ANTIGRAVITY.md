# GUÍA DE CONTINUIDAD · ECOSISTEMA PORTALES SALFA PILOTOS
> **DOCUMENTO MAESTRO PARA AGENTES ANTIGRAVITY / CLAUDE CODE**  
> *Fecha de actualización: 2 de Noviembre de 2026*  
> *Autor / Administrador General: Sebastián Roca (`sjroca@salfamontajes.com`)*

Este documento contiene **toda la información operativa, credenciales, enlaces públicos, repositorios, arquitectura técnica y reglas maestras** necesarias para retomar y continuar el desarrollo de este ecosistema desde cualquier cuenta de Google Antigravity o Claude Code sin fricciones.

---

## 1. REGLA DE ORO DE DIRECTORIOS Y ALMACENAMIENTO

> [!IMPORTANT]
> **UBICACIÓN FÍSICA CANÓNICA DE DESARROLLO:**
> * **Ruta en Disco (Workspace):** `E:\Claude\Portales-Salfa-Pilotos\`  
>   *(Ruta física subyacente: `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\`)*
> * **Prohibición:** NUNCA crear ni editar código de este ecosistema en `E:\Claude\Proyectos\Otros\` ni en carpetas temporales.
> 
> **ESPEJO OFICIAL EN GOOGLE DRIVE:**
> * **Ruta en la Nube:** `G:\Mi unidad\Portales Salfa Pilotos\`
> * **Comando de Sincronización:** Cada vez que se realicen cambios, se DEBE ejecutar en PowerShell:
>   ```powershell
>   powershell -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
>   ```

---

## 2. CREDENCIALES Y AUTENTICACIÓN

| Parámetro | Detalle / Valor |
| :--- | :--- |
| **Correo Administrador** | `sjroca@salfamontajes.com` |
| **Contraseña Maestra** | `REDACTED-ROTATED` *(o `admin` en entorno local)* |
| **Bypass de Acceso** | Si el campo de contraseña se deja vacío al ingresar con `sjroca@salfamontajes.com`, el sistema asume automáticamente `REDACTED-ROTATED`. |
| **Rol Global** | `Administrador del Sistema` (Nivel 3 con control irrestricto de todos los portales y panel admin). |
| **Dominio Requerido** | Exclusivamente `@salfamontajes.com`. |
| **Estructura LocalStorage** | `salfa_auth_session` *(sesión activa)*, `salfa_corp_db_v2` *(BD local segura)*, `salfa_recordar` (`'1'`), `salfa_recordar_email`. |

---

## 3. CATÁLOGO DE PORTALES Y ENLACES EN VIVO

| ID | Portal / Piloto | Carpeta Local | Repositorio GitHub | URL Pública (GitHub Pages) |
| :-: | :--- | :--- | :--- | :--- |
| **00** | **Hub Principal de Accesos** | `00-portal-hub\` | [sjroca-salfa/salfa-pilotos](https://github.com/sjroca-salfa/salfa-pilotos) | [https://sjroca-salfa.github.io/salfa-pilotos/](https://sjroca-salfa.github.io/salfa-pilotos/) |
| **—** | **Consola de Administración** | `00-portal-hub\admin.html` | [sjroca-salfa/salfa-pilotos](https://github.com/sjroca-salfa/salfa-pilotos) | [https://sjroca-salfa.github.io/salfa-pilotos/admin.html](https://sjroca-salfa.github.io/salfa-pilotos/admin.html) |
| **01** | **Mapa de Procesos** | `01-portal-mapa-procesos\` | [sjroca-salfa/portal-mapa-procesos](https://github.com/sjroca-salfa/portal-mapa-procesos) | [https://sjroca-salfa.github.io/portal-mapa-procesos/](https://sjroca-salfa.github.io/portal-mapa-procesos/) |
| **02** | **Control de CV y Competencias** | `00-portal-hub\02-portal-cv\` | Incluido en `salfa-pilotos` | [https://sjroca-salfa.github.io/salfa-pilotos/02-portal-cv/index.html](https://sjroca-salfa.github.io/salfa-pilotos/02-portal-cv/index.html) |
| **05** | **Gestión de la Información** | `05-portal-gestion-informacion\` | [sjroca-salfa/portal-gestion-informacion](https://github.com/sjroca-salfa/portal-gestion-informacion) | [https://sjroca-salfa.github.io/portal-gestion-informacion/](https://sjroca-salfa.github.io/portal-gestion-informacion/) |
| **06** | **Salfa Flow · Work Management** | `00-portal-hub\06-portal-salfa-flow\` | [sjroca-salfa/portal-salfa-flow](https://github.com/sjroca-salfa/portal-salfa-flow) | [https://sjroca-salfa.github.io/salfa-pilotos/06-portal-salfa-flow/index.html](https://sjroca-salfa.github.io/salfa-pilotos/06-portal-salfa-flow/index.html) |
| **07** | **Autodesk Construction Cloud (ACC)** | `00-portal-hub\07-portal-autodesk-construction-cloud-acc\` | Incluido en `salfa-pilotos` | [https://sjroca-salfa.github.io/salfa-pilotos/07-portal-autodesk-construction-cloud-acc/index.html](https://sjroca-salfa.github.io/salfa-pilotos/07-portal-autodesk-construction-cloud-acc/index.html) |
| **08** | **Agente AWP · Metodología CII** | `00-portal-hub\08-portal-agente-awp\` | Incluido en `salfa-pilotos` | [https://sjroca-salfa.github.io/salfa-pilotos/08-portal-agente-awp/index.html](https://sjroca-salfa.github.io/salfa-pilotos/08-portal-agente-awp/index.html) |
| **09** | **Salfagi Modeler · BPMN 2.0** | `00-portal-hub\09-portal-salfagi-modeler\` | Incluido en `salfa-pilotos` | [https://sjroca-salfa.github.io/salfa-pilotos/09-portal-salfagi-modeler/index.html](https://sjroca-salfa.github.io/salfa-pilotos/09-portal-salfagi-modeler/index.html) |

---

## 4. BACKEND CORPORATIVO (GOOGLE APPS SCRIPT)

* **Carpeta Local:** `E:\Claude\Portales-Salfa-Pilotos\hub-accesos\`
* **Repositorio GitHub:** [github.com/sjroca-salfa/hub-accesos](https://github.com/sjroca-salfa/hub-accesos)
* **Script ID Apps Script:** `17c_DQtpVsCsoewdSSFLBSDxltGdnwZSVAX-wEloQEauW_06hoihXs3GJ`
* **Editor Web Apps Script:** [Abrir Editor Hub](https://script.google.com/d/17c_DQtpVsCsoewdSSFLBSDxltGdnwZSVAX-wEloQEauW_06hoihXs3GJ/edit)
* **Web App Endpoint URL (CORS / POST):**  
  `https://script.google.com/macros/s/AKfycbyOmwXlEljtQDHhJP-bnAwnao4Q8QtmmqSnKTF_5FaHW1xX_NiOf11Vhvv1csuh2zXz/exec`
* **Planilla Google Sheets vinculada:**  
  [Accesos Portales Salfa Pilotos](https://docs.google.com/spreadsheets/d/1pCh60ugRfFNbYCqyH9dsNBf0GnwQL0b5JxcOE-x8hwA/edit)  
  *(Contiene hojas: `Accesos`, `Sesiones`, `Registro`, `Contactos`, `Credenciales`)*
* **Despliegue y actualización con `clasp`:**  
  * Para subir cambios de código a Apps Script:
    ```powershell
    cd "E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\hub-accesos"
    clasp push -f
    clasp deploy -i "AKfycbyOmwXlEljtQDHhJP-bnAwnao4Q8QtmmqSnKTF_5FaHW1xX_NiOf11Vhvv1csuh2zXz" -d "Descripción de versión"
    ```

---

## 5. REGLAS MAESTRAS DE DISEÑO Y FRONTEND

### 1. Barra Superior Corporativa (Universal Topbar 48px)
* **Altura:** Exactamente `48px` (`min-height: 48px; max-height: 48px`).
* **Fondo:** `#1E2229` con filete inferior rojo institucional `#B01E24` de `3px`.
* **Animación del Logo:** Brillo pop / shimmer corporativo en el logo SVG `SALFAMONTAJES ®`.
* **Títulos:** En mayúsculas **SIN prefijo numérico** (ej. `MAPA DE PROCESOS` y nunca `01 · MAPA DE PROCESOS`).
* **Navegación:** Los enlaces hacia el Hub y entre portales se abren siempre en la **misma pestaña** (`window.location.href`), nunca en `_blank`.
* **Semáforo de Inactividad:** Chip con punto verde (`#3ddc84`), amarillo (`#f59e0b` al faltar 3 min) y rojo (`#ef4444` al desconectar tras 15 min de inactividad).

### 2. Responsividad Móvil (Viewport 360px – 430px)
* En pantallas `< 820px`, ocultar elementos secundarios del topbar (saludo, email largo) y mantener compactos:
  `[<- Hub] | [SALFAMONTAJES ®] | [Portales] [Tiempo] [En línea] [Avatar SR]`.
* Los paneles de herramientas y menús laterales deben comportarse como **drawer deslizable lateral** (`position: fixed; left: 0; width: 290px; transform: translateX(-100%);`) con un telón semitransparente (*backdrop* `rgba(15,17,19,0.65)`).
* El contenido principal / mapa debe ocupar el **100% del ancho disponible** en móviles, permitiendo paneo y zoom táctil.

### 3. Sistema de Invitaciones Granulares por Portal
* Desde el Hub (`index.html`) o desde la Consola Admin (`admin.html`), al invitar o editar un colaborador:
  * Cada portal tiene una casilla `[✓]` para **habilitar o deshabilitar** individualmente el acceso.
  * Cada portal tiene un `<select>` de rol (`Visualizador`, `Colaborador`, `Editor`, `Revisor`, `Administrador`).
  * Al guardar, se genera una plantilla de correo corporativo personalizada con la tabla de portales asignados y sus permisos.
  * Opciones de entrega: despacho automático por servidor vía `MailApp.sendEmail`, botón **[ ✉ Abrir en Gmail ]** con datos pre-rellenados y botón **[ 📋 Copiar correo al portapapeles ]**.

---

## 6. COMANDOS ÚTILES PARA EL AGENTE

* **Comprobar sintaxis JS sin abrir navegador:**
  ```powershell
  node -e "const vm=require('vm'), fs=require('fs'); new vm.Script(fs.readFileSync('00-portal-hub/index.html','utf8').match(/<script(?![^>]*\bsrc)[^>]*>([\s\S]*?)<\/script>/i)[1]); console.log('Syntax OK');"
  ```
* **Compromiso y Push Git en Hub:**
  ```powershell
  cd "E:\Claude\Portales-Salfa-Pilotos\00-portal-hub"
  git add .
  git commit -m "feat(...): descripcion del cambio"
  git push origin main
  ```
* **Sincronización hacia Google Drive:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
  ```
