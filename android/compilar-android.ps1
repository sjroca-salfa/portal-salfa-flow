# ==============================================================================
# SCRIPT DE COMPILACIÓN AUTOMATIZADA · SALFA FLOW ANDROID
# Ecosistema: Portales Salfa Pilotos · Salfa Montajes
# ==============================================================================

param(
    [string]$Task = "assembleDebug"
)

Write-Host "==========================================================" -ForegroundColor Red
Write-Host "  SALFA FLOW · COMPILADOR DE APLICACIÓN ANDROID" -ForegroundColor White
Write-Host "  Salfa Montajes / SalfaCorp" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Red

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

# Verificar Java
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if (-not $javaCmd) {
    Write-Host "[!] Java (JDK 17+) no se detectó en el PATH de Windows." -ForegroundColor Yellow
    Write-Host "    Para compilar de forma nativa por consola, instala JDK 17 o abre esta carpeta en Android Studio." -ForegroundColor Cyan
} else {
    Write-Host "[OK] Java detectado: $(java -version 2>&1 | Select-Object -First 1)" -ForegroundColor Green
}

# Verificar Android SDK
$androidSdk = $env:ANDROID_HOME
if (-not $androidSdk) {
    $defaultSdk = "$env:LOCALAPPDATA\Android\Sdk"
    if (Test-Path $defaultSdk) {
        $env:ANDROID_HOME = $defaultSdk
        Write-Host "[OK] Android SDK localizado en: $defaultSdk" -ForegroundColor Green
    } else {
        Write-Host "[i] No se detectó ANDROID_HOME en variables de entorno." -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] ANDROID_HOME configurado en: $androidSdk" -ForegroundColor Green
}

# Ejecución de Gradle
if (Test-Path ".\gradlew.bat") {
    Write-Host "Ejecutando .\gradlew.bat $Task..." -ForegroundColor Cyan
    cmd.exe /c "gradlew.bat $Task"
} elseif (Get-Command gradle -ErrorAction SilentlyContinue) {
    Write-Host "Ejecutando gradle $Task..." -ForegroundColor Cyan
    gradle $Task
} else {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  PROYECTO ANDROID ESTRUCTURADO Y LISTO" -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "1. Abre Android Studio." -ForegroundColor White
    Write-Host "2. Selecciona 'Open' y apunta a:" -ForegroundColor White
    Write-Host "   $ScriptDir" -ForegroundColor Yellow
    Write-Host "3. Presiona 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'" -ForegroundColor White
    Write-Host "4. El APK generado quedará en:" -ForegroundColor White
    Write-Host "   $ScriptDir\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Green
}
