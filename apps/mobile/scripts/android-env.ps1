# Ejecutar con dot-sourcing: . ./scripts/android-env.ps1
$ErrorActionPreference = 'Stop'

if (-not $env:ANDROID_HOME) {
    $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
}
foreach ($androidTool in @('platform-tools\adb.exe', 'emulator\emulator.exe')) {
    if (-not (Test-Path -LiteralPath (Join-Path $env:ANDROID_HOME $androidTool))) {
        throw "Falta $androidTool en $env:ANDROID_HOME. Revisar SDK Manager."
    }
}
if (-not $env:JAVA_HOME -or -not (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    throw 'Configura JAVA_HOME con un JDK 17 antes de iniciar el proyecto.'
}
$androidJavaVersion = (& (Join-Path $env:JAVA_HOME 'bin\java.exe') -version 2>&1 | Out-String)
if ($androidJavaVersion -notmatch 'version "17\.') {
    throw "Se requiere Java 17. JAVA_HOME actual: $env:JAVA_HOME"
}
$androidToolDirectories = @(
    (Join-Path $env:JAVA_HOME 'bin'),
    (Join-Path $env:ANDROID_HOME 'platform-tools'),
    (Join-Path $env:ANDROID_HOME 'emulator')
)
$env:PATH = (($androidToolDirectories + ($env:PATH -split ';')) | Select-Object -Unique) -join ';'
$env:EXPO_NO_TELEMETRY = '1'
$env:EXPO_PACKAGER_PROXY_URL = 'http://127.0.0.1:8081'
# ADB reverse usa IPv4: evitar que Node enlace localhost solo a ::1 en Windows.
if ($env:NODE_OPTIONS -notmatch '--dns-result-order=') {
    $env:NODE_OPTIONS = ($env:NODE_OPTIONS + ' --dns-result-order=ipv4first').Trim()
}
Write-Host "Android SDK: $env:ANDROID_HOME"
Write-Host "Java 17: $env:JAVA_HOME"
