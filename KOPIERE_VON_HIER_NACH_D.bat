@echo off
chcp 65001 >nul
echo ══════════════════════════════════════════════════════════════
echo    KOPIERE NACH D:\Claudeapps\Simple Weather App\
echo ══════════════════════════════════════════════════════════════
echo.

set "QUELLE=%~dp0"
set "ZIEL=D:\Claudeapps\Simple Weather App"

echo 📂 Von:  %QUELLE%
echo 📁 Nach: %ZIEL%
echo.

REM Erstelle Ordner
if not exist "D:\Claudeapps" mkdir "D:\Claudeapps"
if not exist "%ZIEL%" mkdir "%ZIEL%"

echo 📥 Kopiere alle Dateien...
echo.

REM Kopiere alle Dateien
xcopy "%QUELLE%*.*" "%ZIEL%\" /E /I /H /Y /EXCLUDE:%QUELLE%.git\

echo.
echo ══════════════════════════════════════════════════════════════
echo    ✅ FERTIG!
echo ══════════════════════════════════════════════════════════════
echo.
echo Ihre App ist jetzt auf: %ZIEL%
echo.

explorer "%ZIEL%"
pause
