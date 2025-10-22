@echo off

REM ===========================================================
REM  Ejecutar ATS Advisor (versión TFM - Carlos Emilio López)
REM  Ruta del proyecto:
REM  C:\Users\Probook\OneDrive\Documentos\ProyectosSoftware\prototipo-empleabilidad
REM ===========================================================

REM Ir a la carpeta del script
cd /d "C:\Users\Probook\OneDrive\Documentos\ProyectosSoftware\prototipo-empleabilidad"

REM Activar UTF-8 en la consola
chcp 65001 > nul

echo.
echo Iniciando ATS Advisor...
echo ========================

REM Intentar activar entorno Conda
if exist "%USERPROFILE%\anaconda3\Scripts\activate.bat" (
    call "%USERPROFILE%\anaconda3\Scripts\activate.bat" ats-advisor
) else if exist "%USERPROFILE%\miniconda3\Scripts\activate.bat" (
    call "%USERPROFILE%\miniconda3\Scripts\activate.bat" ats-advisor
) else (
    echo ⚠️ No se encontró activate.bat de Conda.
    echo Abre manualmente "Anaconda Prompt" y ejecuta:
    echo     conda activate ats-advisor
    echo     cd "C:\Users\Probook\OneDrive\Documentos\ProyectosSoftware\prototipo-empleabilidad"
    echo     python -X utf8 main.py
    pause
    exit /b 1
)


REM Lanzar la aplicación principal
set PYTHONUTF8=1
"%CONDA_PREFIX%\python.exe" -X utf8 main.py

echo.
pause
