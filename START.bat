@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          VON DER IDEE ZUM PROTOTYP - STARTER                  ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [1] App starten (index.html)
echo [2] Landing Page öffnen (landing.html)
echo [3] Icons generieren (generate-icons.html)
echo [4] Anleitung lesen (START_ANLEITUNG.txt)
echo [5] API Setup Guide (API_SETUP_GUIDE.md)
echo [6] PWA Guide (PWA_GUIDE.md)
echo [0] Beenden
echo.
set /p choice="Wähle eine Option: "

if "%choice%"=="1" start index.html
if "%choice%"=="2" start landing.html
if "%choice%"=="3" start generate-icons.html
if "%choice%"=="4" start START_ANLEITUNG.txt
if "%choice%"=="5" start API_SETUP_GUIDE.md
if "%choice%"=="6" start PWA_GUIDE.md
if "%choice%"=="0" exit

pause
