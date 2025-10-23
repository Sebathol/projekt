@echo off
REM ============================================================
REM API Master - Kopier-Skript nach D:\claudeapps\
REM Für: Ai Storm Create (Sebastian Beyer)
REM ============================================================

echo.
echo ============================================================
echo   API Master - Multi-API Management Platform
echo   Kopiere nach D:\claudeapps\multi api management plattform
echo ============================================================
echo.

REM Zielpfad definieren
set "TARGET_DIR=D:\claudeapps\multi api management plattform"

REM Prüfe ob Zielverzeichnis existiert
if not exist "D:\claudeapps\" (
    echo FEHLER: D:\claudeapps\ existiert nicht!
    echo Bitte erstellen Sie zuerst das Verzeichnis D:\claudeapps\
    pause
    exit /b 1
)

REM Erstelle Zielverzeichnis falls nicht vorhanden
if not exist "%TARGET_DIR%\" (
    echo Erstelle Verzeichnis: %TARGET_DIR%
    mkdir "%TARGET_DIR%"
)

echo.
echo Kopiere API Master Projekt...
echo.

REM Kopiere api-master Ordner
echo [1/6] Kopiere Backend...
xcopy /E /I /Y "api-master\backend" "%TARGET_DIR%\backend\"

echo [2/6] Kopiere Frontend...
xcopy /E /I /Y "api-master\frontend" "%TARGET_DIR%\frontend\"

echo [3/6] Kopiere Desktop App...
xcopy /E /I /Y "api-master\desktop" "%TARGET_DIR%\desktop\"

echo [4/6] Kopiere Mobile App...
xcopy /E /I /Y "api-master\mobile" "%TARGET_DIR%\mobile\"

echo [5/7] Kopiere Templates...
xcopy /E /I /Y "api-master\templates" "%TARGET_DIR%\templates\"

echo [6/7] Kopiere Store-Assets...
xcopy /E /I /Y "api-master\store-assets" "%TARGET_DIR%\store-assets\"

echo [7/7] Kopiere Dokumentation...
copy /Y "api-master\README.md" "%TARGET_DIR%\"
copy /Y "api-master\USER_GUIDE.md" "%TARGET_DIR%\"
copy /Y "api-master\TEST_SETUP.md" "%TARGET_DIR%\"
copy /Y "api-master\DEPLOYMENT.md" "%TARGET_DIR%\"
copy /Y "api-master\MARKETING_PLAN.md" "%TARGET_DIR%\"
copy /Y "api-master\INFLUENCER_OUTREACH.md" "%TARGET_DIR%\"
copy /Y "api-master\STORE_PUBLISHING.md" "%TARGET_DIR%\"
copy /Y "api-master\COMPLIANCE_GUIDE.md" "%TARGET_DIR%\"
copy /Y "api-master\LAUNCH_PLAN_4_PLATFORMS.md" "%TARGET_DIR%\"
copy /Y "api-master\VERCEL_DEPLOY_GUIDE.md" "%TARGET_DIR%\"
copy /Y "api-master\.gitignore" "%TARGET_DIR%\"

echo.
echo ============================================================
echo   KOPIEREN ABGESCHLOSSEN!
echo ============================================================
echo.
echo Projekt wurde kopiert nach:
echo %TARGET_DIR%
echo.
echo Naechste Schritte:
echo 1. cd "%TARGET_DIR%\backend"
echo 2. npm install
echo 3. Konfiguriere .env Datei
echo 4. npm start
echo.
echo Weitere Informationen: README.md im Zielverzeichnis
echo.
pause
