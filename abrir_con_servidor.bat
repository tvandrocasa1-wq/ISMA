@echo off
title Servidor Web - Cinta transportadora
cd /d "%~dp0"
echo ================================================================
echo   Iniciando servidor local para la cinta transportadora...
echo   Abriendo el navegador en http://localhost:8000
echo   (Para cerrar el servidor, simplemente cierra esta ventana)
echo ================================================================
start http://localhost:8000/
python -m http.server 8000
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Probando con 'py' en lugar de 'python'...
    py -m http.server 8000
)
pause
