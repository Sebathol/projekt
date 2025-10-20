@echo off
echo ========================================
echo Simple Weather App - USB Stick Kopieren
echo ========================================
echo.
echo Ziel: D:\simple-weather-app\
echo.

REM Erstelle Zielordner
echo [1/3] Erstelle Ordner auf USB-Stick...
if not exist "D:\simple-weather-app\" mkdir "D:\simple-weather-app"

REM Kopiere alle Dateien
echo [2/3] Kopiere alle Dateien...
xcopy "%~dp0*.*" "D:\simple-weather-app\" /E /I /H /Y /EXCLUDE:%~dp0.gitignore

REM Kopiere Unterordner
echo [3/3] Kopiere Unterordner...
if exist "%~dp0store-listings" xcopy "%~dp0store-listings\*.*" "D:\simple-weather-app\store-listings\" /E /I /Y

echo.
echo ========================================
echo FERTIG! Alle Dateien kopiert!
echo ========================================
echo.
echo Dateien befinden sich jetzt auf:
echo D:\simple-weather-app\
echo.
echo Offne: D:\simple-weather-app\README.md
echo.
pause
