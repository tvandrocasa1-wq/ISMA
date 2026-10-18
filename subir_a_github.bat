@echo off
title Subir Cinta Transportadora a GitHub
cd /d "%~dp0"
echo ================================================================
echo   ASISTENTE DE SUBIDA AUTOMATICA A GITHUB
echo ================================================================
echo.
echo PASO 1: Creacion del repositorio en GitHub
echo Se abrira https://github.com/new en tu navegador.
echo - En Repository name escribe exactamente: cinta-transportadora-web
echo - Dejalo en "Public"
echo - NO marques README ni .gitignore
echo - Haz clic en el boton verde "Create repository"
echo.
echo Pulsa una tecla cuando estes listo para abrir GitHub...
pause >nul
start https://github.com/new

echo.
set /p GH_USER="Introduce tu nombre de usuario de GitHub (por ejemplo: tatof): "
if "%GH_USER%"=="" (
    echo Nombre de usuario vacio. Operacion cancelada.
    pause
    exit /b
)

set REPO_URL=https://github.com/%GH_USER%/cinta-transportadora-web.git
echo.
echo Vinculando con: %REPO_URL%
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Subiendo archivos a la rama main...
echo (Si es la primera vez, se abrira una ventana para iniciar sesion en GitHub)
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo   ENHORABUENA! Archivos subidos con exito a GitHub.
    echo.
    echo   PASO 2: Activar GitHub Pages (Web online publica)
    echo   1. En la pagina que se va a abrir ahora mismo:
    echo   2. En "Source", deja "Deploy from a branch"
    echo   3. En "Branch", selecciona "main" y carpeta "/ (root)"
    echo   4. Pulsa "Save"
    echo.
    echo   En 1 minuto tu web estara publicada y accesible en:
    echo   https://%GH_USER%.github.io/cinta-transportadora-web/
    echo ================================================================
    start https://github.com/%GH_USER%/cinta-transportadora-web/settings/pages
) else (
    echo.
    echo ================================================================
    echo Hubo un problema al subir a GitHub.
    echo Verifica que:
    echo 1. Hayas creado el repositorio 'cinta-transportadora-web' en GitHub.
    echo 2. Tu nombre de usuario este bien escrito.
    echo ================================================================
)
pause
