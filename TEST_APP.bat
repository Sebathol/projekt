@echo off
chcp 65001 >nul
echo ══════════════════════════════════════════════════════════════
echo    SIMPLE WEATHER APP - TEST SERVER
echo ══════════════════════════════════════════════════════════════
echo.

echo 🚀 Starte lokalen Web-Server...
echo.
echo 📱 Die App wird im Browser geöffnet:
echo    http://localhost:8000
echo.
echo 💡 HINWEISE:
echo    - Service Worker funktioniert nur über HTTPS oder localhost
echo    - Die Demo-API funktioniert ohne API-Key
echo    - Für echte Wetterdaten: setup-tool.html öffnen
echo.
echo ⚠️  Drücken Sie STRG+C zum Beenden
echo.

REM Öffne Browser
start http://localhost:8000

REM Versuche Python Server
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Starte Python Server...
    python -m http.server 8000
    goto ende
)

REM Versuche Python3
where python3 >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Starte Python3 Server...
    python3 -m http.server 8000
    goto ende
)

REM Versuche PHP
where php >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Starte PHP Server...
    php -S localhost:8000
    goto ende
)

REM Versuche Node.js http-server
where http-server >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Starte Node.js http-server...
    http-server -p 8000
    goto ende
)

REM Kein Server gefunden
echo.
echo ❌ KEIN WEB-SERVER GEFUNDEN!
echo.
echo Bitte installieren Sie einen der folgenden:
echo.
echo   1. Python: https://www.python.org/downloads/
echo   2. PHP: https://windows.php.net/download/
echo   3. Node.js mit http-server: npm install -g http-server
echo.
echo ODER: Öffnen Sie index.html direkt im Browser
echo       (Service Worker funktioniert dann nicht)
echo.

REM Öffne index.html als Fallback
echo Öffne index.html im Browser...
start index.html

:ende
pause
