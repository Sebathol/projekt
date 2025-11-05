@echo off
REM ============================================================
REM API Master - Schnelles Kopier-Skript
REM Erstelle dieses Skript auf D:\ und fuehre es aus
REM ============================================================

echo.
echo ============================================================
echo   API Master - Multi-API Management Platform
echo   Kopiere nach D:\claudeapps\multi api management plattform
echo ============================================================
echo.

REM Erstelle Zielverzeichnis
if not exist "D:\claudeapps\" (
    echo Erstelle D:\claudeapps\...
    mkdir "D:\claudeapps"
)

if not exist "D:\claudeapps\multi api management plattform\" (
    echo Erstelle D:\claudeapps\multi api management plattform...
    mkdir "D:\claudeapps\multi api management plattform"
)

REM Prüfe ob Quellverzeichnis existiert
set "SOURCE_DIR=%~dp0api-master"

if not exist "%SOURCE_DIR%" (
    echo.
    echo FEHLER: api-master Ordner nicht gefunden!
    echo.
    echo Bitte stellen Sie sicher, dass dieses Skript im Hauptverzeichnis
    echo liegt, das den api-master Ordner enthaelt.
    echo.
    echo Aktueller Pfad: %~dp0
    echo Suche nach: %SOURCE_DIR%
    echo.
    pause
    exit /b 1
)

echo.
echo Kopiere von: %SOURCE_DIR%
echo Nach: D:\claudeapps\multi api management plattform
echo.
pause

set "TARGET=D:\claudeapps\multi api management plattform"

echo [1/7] Kopiere Backend...
xcopy /E /I /Y "%SOURCE_DIR%\backend" "%TARGET%\backend\"

echo [2/7] Kopiere Frontend...
xcopy /E /I /Y "%SOURCE_DIR%\frontend" "%TARGET%\frontend\"

echo [3/7] Kopiere Desktop App...
xcopy /E /I /Y "%SOURCE_DIR%\desktop" "%TARGET%\desktop\"

echo [4/7] Kopiere Mobile App...
xcopy /E /I /Y "%SOURCE_DIR%\mobile" "%TARGET%\mobile\"

echo [5/7] Kopiere Templates...
xcopy /E /I /Y "%SOURCE_DIR%\templates" "%TARGET%\templates\"

echo [6/7] Kopiere Store-Assets...
xcopy /E /I /Y "%SOURCE_DIR%\store-assets" "%TARGET%\store-assets\"

echo [7/7] Kopiere Dokumentation...
copy /Y "%SOURCE_DIR%\*.md" "%TARGET%\"
copy /Y "%SOURCE_DIR%\.gitignore" "%TARGET%\" 2>nul

echo.
echo ============================================================
echo   KOPIEREN ABGESCHLOSSEN!
echo ============================================================
echo.
echo Projekt wurde kopiert nach:
echo D:\claudeapps\multi api management plattform
echo.
echo Naechste Schritte:
echo 1. cd "D:\claudeapps\multi api management plattform\backend"
echo 2. npm install
echo 3. Konfiguriere .env Datei
echo 4. npm start
echo.
pause
