@echo off
title Subiendo proyecto a https://github.com/tvandrocasa1-wq/ISMA
cd /d "%~dp0"

echo ================================================================
echo   SUBIENDO PROYECTO A TU REPOSITORIO DE GITHUB:
echo   https://github.com/tvandrocasa1-wq/ISMA
echo ================================================================
echo.
echo Los siguientes archivos estan preparados y comprometidos:
echo   - index.html (Aplicacion Web)
echo   - styles.css (Estilos y formato)
echo   - script.js (Motor de calculo y Canvas)
echo   - materiales.json (Base de datos de materiales)
echo   - Readme.txt (Manual y ejemplo resuelto)
echo   - abrir_con_servidor.bat (Lanzador local)
echo   - Guia_Defensa_y_Memoria_Cintas.docx (Memoria y guia de 10 min)
echo   - dimensionamiento_cinta_transportadora.zip (Archivo para Studium)
echo.
echo Conectando con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/tvandrocasa1-wq/ISMA.git
git branch -M main

echo.
echo Enviando archivos a la rama main...
echo (Si tu navegador abre una ventana de inicio de sesion de GitHub, pulsa "Authorize")
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo   TODO SUBIDO CON EXITO A TU REPOSITORIO!
    echo   Puedes comprobarlo en: https://github.com/tvandrocasa1-wq/ISMA
    echo.
    echo   Ahora se abrira GitHub Pages para activarlo:
    echo   1. En "Branch", selecciona "main" y "/ (root)"
    echo   2. Pulsa "Save"
    echo   3. Tu web estara online en:
    echo      https://tvandrocasa1-wq.github.io/ISMA/
    echo ================================================================
    start https://github.com/tvandrocasa1-wq/ISMA/settings/pages
) else (
    echo.
    echo ================================================================
    echo Si no te permite subir por consola o pide token, puedes
    echo subir los archivos directamente arrastrandolos en la web:
    echo https://github.com/tvandrocasa1-wq/ISMA/upload/main
    echo ================================================================
    start https://github.com/tvandrocasa1-wq/ISMA/upload/main
)

pause
