@echo off
chcp 65001 > nul
title Pure PDF - USB Stick Kopiertool
color 0A

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           PURE PDF VIEWER - USB STICK KOPIERTOOL           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Dieses Tool kopiert die kompilierte Pure PDF App auf USB-Sticks
echo für den Vertrieb und Verkauf.
echo.
echo ══════════════════════════════════════════════════════════════
echo.

:check_build
if not exist "dist" (
    echo [!] FEHLER: Kein 'dist' Ordner gefunden!
    echo.
    echo     Bitte erst die App kompilieren:
    echo     npm run build:win
    echo.
    pause
    exit /b 1
)

echo [✓] Build-Ordner gefunden.
echo.

:select_drive
echo Verfügbare Laufwerke:
echo.
wmic logicaldisk get caption,volumename,size,freespace
echo.
echo ══════════════════════════════════════════════════════════════
echo.

set /p "usb_drive=Gib den Laufwerksbuchstaben des USB-Sticks ein (z.B. E): "

if not exist "%usb_drive%:\" (
    echo.
    echo [!] Laufwerk %usb_drive%: nicht gefunden!
    echo.
    goto select_drive
)

echo.
echo [✓] Laufwerk %usb_drive%: gefunden.
echo.

:confirm
echo ══════════════════════════════════════════════════════════════
echo.
echo     WARNUNG: Der folgende Ordner wird erstellt/überschrieben:
echo     %usb_drive%:\Pure-PDF-Viewer\
echo.
echo ══════════════════════════════════════════════════════════════
echo.
set /p "confirm=Fortfahren? (J/N): "

if /i not "%confirm%"=="J" (
    echo.
    echo [!] Vorgang abgebrochen.
    echo.
    pause
    exit /b 0
)

:copy_files
echo.
echo [►] Kopiere Dateien...
echo.

REM Erstelle Zielordner
if not exist "%usb_drive%:\Pure-PDF-Viewer\" mkdir "%usb_drive%:\Pure-PDF-Viewer\"

REM Kopiere Windows Build
echo [►] Kopiere Windows Installer...
xcopy "dist\*.exe" "%usb_drive%:\Pure-PDF-Viewer\" /Y /I

REM Kopiere Setup-Tool
echo [►] Kopiere Setup-Tool...
copy "setup-tool.html" "%usb_drive%:\Pure-PDF-Viewer\" /Y
copy "setup-tool.js" "%usb_drive%:\Pure-PDF-Viewer\" /Y

REM Kopiere Dokumentation
echo [►] Kopiere Dokumentation...
if exist "README.md" copy "README.md" "%usb_drive%:\Pure-PDF-Viewer\" /Y
if exist "INSTALLATION.md" copy "INSTALLATION.md" "%usb_drive%:\Pure-PDF-Viewer\" /Y
if exist "LICENSE.txt" copy "LICENSE.txt" "%usb_drive%:\Pure-PDF-Viewer\" /Y

REM Erstelle AUTORUN.INF
echo [►] Erstelle Autorun-Datei...
(
echo [autorun]
echo icon=icon.ico
echo label=Pure PDF Viewer
echo action=Pure PDF Viewer installieren
echo shellexecute=INSTALLATION.html
) > "%usb_drive%:\Pure-PDF-Viewer\AUTORUN.INF"

REM Erstelle README für USB
echo [►] Erstelle README...
(
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║                   PURE PDF VIEWER v1.0.0                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Installation:
echo.
echo 1. Führe die .exe Datei aus
echo 2. Folge den Installationsanweisungen
echo 3. Starte Pure PDF Viewer nach der Installation
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo Support: support@yourcompany.com
echo Website: www.yourcompany.com
echo.
echo © 2025 Your Company. Alle Rechte vorbehalten.
) > "%usb_drive%:\Pure-PDF-Viewer\README.txt"

echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo [✓] Kopiervorgang abgeschlossen!
echo.
echo     Die Pure PDF App wurde erfolgreich kopiert nach:
echo     %usb_drive%:\Pure-PDF-Viewer\
echo.
echo     Dateien:
dir /B "%usb_drive%:\Pure-PDF-Viewer\"
echo.
echo ══════════════════════════════════════════════════════════════
echo.

:open_folder
set /p "open=Möchtest du den USB-Ordner öffnen? (J/N): "

if /i "%open%"=="J" (
    explorer "%usb_drive%:\Pure-PDF-Viewer\"
)

echo.
echo [✓] Fertig! Du kannst den USB-Stick jetzt sicher entfernen.
echo.
pause
