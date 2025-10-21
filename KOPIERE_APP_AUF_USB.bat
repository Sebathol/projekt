@echo off
echo ========================================
echo   KOPIERE WEATHER APP AUF USB-STICK
echo ========================================
echo.

REM Pfad zum WSL-Projekt
set "QUELLE=\\wsl.localhost\Ubuntu\home\user\projekt"
set "ZIEL=D:\simple-weather-app"

echo Kopiere von: %QUELLE%
echo Nach:        %ZIEL%
echo.

REM Erstelle Zielordner
if not exist "%ZIEL%" (
    echo Erstelle Ordner auf USB-Stick...
    mkdir "%ZIEL%"
)

REM Kopiere ZIP-Datei
echo.
echo Kopiere SIMPLE-WEATHER-APP-KOMPLETT.zip...
copy "%QUELLE%\SIMPLE-WEATHER-APP-KOMPLETT.zip" "%ZIEL%\" /Y

REM Kopiere Anleitung
echo Kopiere SO_FINDEN_SIE_DIE_DATEIEN.txt...
copy "%QUELLE%\SO_FINDEN_SIE_DIE_DATEIEN.txt" "%ZIEL%\" /Y

echo.
echo ========================================
echo   FERTIG!
echo ========================================
echo.
echo Die Dateien sind jetzt auf Ihrem USB-Stick:
echo %ZIEL%\
echo.
echo - SIMPLE-WEATHER-APP-KOMPLETT.zip
echo - SO_FINDEN_SIE_DIE_DATEIEN.txt
echo.

REM Öffne USB-Stick im Explorer
echo Oeffne USB-Stick...
explorer "%ZIEL%"

echo.
pause
