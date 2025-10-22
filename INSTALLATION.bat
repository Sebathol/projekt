@echo off
chcp 65001 >nul
echo ══════════════════════════════════════════════════════════════
echo    SIMPLE WEATHER APP - INSTALLATION
echo ══════════════════════════════════════════════════════════════
echo.

REM Prüfe ob Git installiert ist
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ FEHLER: Git ist nicht installiert!
    echo.
    echo Bitte installieren Sie Git von: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git gefunden
echo.

REM Setze Repository URL (BITTE ANPASSEN!)
set "REPO_URL=https://github.com/Sebathol/projekt.git"
set "BRANCH=claude/fix-weather-app-011CUK3ejTvamsHndDe3YDJZ"
set "ZIEL_ORDNER=simple-weather-app"

echo 📦 Repository: %REPO_URL%
echo 🌿 Branch: %BRANCH%
echo 📁 Ziel: %ZIEL_ORDNER%
echo.

REM Prüfe ob Ordner bereits existiert
if exist "%ZIEL_ORDNER%" (
    echo ⚠️  Ordner "%ZIEL_ORDNER%" existiert bereits!
    echo.
    choice /C JN /M "Moechten Sie den Ordner loeschen und neu klonen"
    if errorlevel 2 (
        echo Abgebrochen.
        pause
        exit /b 0
    )
    echo.
    echo 🗑️  Loesche alten Ordner...
    rmdir /s /q "%ZIEL_ORDNER%"
)

echo.
echo 📥 Clone Repository...
echo ──────────────────────────────────────────────────────────────
git clone -b %BRANCH% %REPO_URL% %ZIEL_ORDNER%

if %errorlevel% neq 0 (
    echo.
    echo ❌ FEHLER beim Klonen!
    echo.
    echo Versuche Standard-Branch...
    git clone %REPO_URL% %ZIEL_ORDNER%

    if %errorlevel% neq 0 (
        echo ❌ Klonen fehlgeschlagen!
        pause
        exit /b 1
    )
)

cd %ZIEL_ORDNER%

echo.
echo ══════════════════════════════════════════════════════════════
echo    ✅ INSTALLATION ERFOLGREICH!
echo ══════════════════════════════════════════════════════════════
echo.
echo 📂 App befindet sich in: %cd%
echo.
echo 🚀 NÄCHSTE SCHRITTE:
echo.
echo    1. Zum Testen: Fuehren Sie TEST_APP.bat aus
echo    2. API einrichten: Oeffnen Sie setup-tool.html
echo       Passwort: JoHanna268219$
echo.

REM Erstelle TEST_APP.bat im neuen Ordner
echo @echo off > TEST_APP.bat
echo chcp 65001 ^>nul >> TEST_APP.bat
echo echo ══════════════════════════════════════════════════════════════ >> TEST_APP.bat
echo echo    SIMPLE WEATHER APP - TEST SERVER >> TEST_APP.bat
echo echo ══════════════════════════════════════════════════════════════ >> TEST_APP.bat
echo echo. >> TEST_APP.bat
echo echo 🚀 Starte lokalen Web-Server... >> TEST_APP.bat
echo echo. >> TEST_APP.bat
echo echo 📱 Die App wird im Browser geoeffnet: >> TEST_APP.bat
echo echo    http://localhost:8000 >> TEST_APP.bat
echo echo. >> TEST_APP.bat
echo echo ⚠️  Druecken Sie STRG+C zum Beenden >> TEST_APP.bat
echo echo. >> TEST_APP.bat
echo start http://localhost:8000 >> TEST_APP.bat
echo python -m http.server 8000 2^>nul >> TEST_APP.bat
echo if %%errorlevel%% neq 0 ( >> TEST_APP.bat
echo     echo ❌ Python nicht gefunden! Versuche php... >> TEST_APP.bat
echo     php -S localhost:8000 2^>nul >> TEST_APP.bat
echo     if %%errorlevel%% neq 0 ( >> TEST_APP.bat
echo         echo ❌ Kein Web-Server gefunden! >> TEST_APP.bat
echo         echo. >> TEST_APP.bat
echo         echo Bitte oeffnen Sie index.html manuell im Browser. >> TEST_APP.bat
echo         echo. >> TEST_APP.bat
echo         pause >> TEST_APP.bat
echo         exit /b 1 >> TEST_APP.bat
echo     ) >> TEST_APP.bat
echo ) >> TEST_APP.bat

echo ✅ TEST_APP.bat wurde erstellt
echo.

choice /C JN /M "Moechten Sie die App jetzt testen"
if errorlevel 2 goto ende

echo.
echo 🚀 Starte Test-Server...
call TEST_APP.bat

:ende
echo.
pause
