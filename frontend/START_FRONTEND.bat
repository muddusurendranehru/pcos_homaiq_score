@echo off
echo ========================================
echo   Starting PCOS Frontend on Port 3038
echo ========================================
echo.
cd /d "%~dp0"
set PORT=3038
npm start
pause

