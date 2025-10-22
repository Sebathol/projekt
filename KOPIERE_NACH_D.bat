@echo off
chcp 65001 >nul
echo ══════════════════════════════════════════════════════════════
echo    SIMPLE WEATHER APP → D:\Claudeapps\Simple Weather App\
echo ══════════════════════════════════════════════════════════════
echo.

set "QUELLE=\\wsl.localhost\Ubuntu\home\user\projekt"
set "ZIEL=D:\Claudeapps\Simple Weather App"

echo 📂 Quelle: %QUELLE%
echo 📁 Ziel:   %ZIEL%
echo.

REM Erstelle Zielordner
if not exist "D:\Claudeapps" (
    echo Erstelle D:\Claudeapps...
    mkdir "D:\Claudeapps"
)

if not exist "%ZIEL%" (
    echo Erstelle "%ZIEL%"...
    mkdir "%ZIEL%"
)

echo.
echo 📥 Kopiere alle Dateien...
echo ──────────────────────────────────────────────────────────────

REM Kopiere mit xcopy (alle Dateien und Unterordner, außer .git)
xcopy "%QUELLE%\*.*" "%ZIEL%\" /E /I /H /Y /EXCLUDE:%QUELLE%\.git

echo.
echo ══════════════════════════════════════════════════════════════
echo    ✅ KOPIEREN ERFOLGREICH!
echo ══════════════════════════════════════════════════════════════
echo.
echo Ihre App befindet sich jetzt auf:
echo %ZIEL%
echo.

REM Öffne Zielordner
echo Öffne Ordner im Explorer...
explorer "%ZIEL%"

echo.
pause
