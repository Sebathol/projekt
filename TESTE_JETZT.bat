@echo off
echo.
echo ========================================
echo   GROW MASTER APP - SCHNELLSTART
echo ========================================
echo.
echo Starte Web-Server...
echo.
cd grow-master-app\www
python -m http.server 8000
pause
