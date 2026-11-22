@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "PYTHONPATH=%PROJECT_ROOT%;%PYTHONPATH%"

set "PY_EXE=%LOCALAPPDATA%\rubimind\tools\python-3.14.9+20261021-win32-x64\python.exe"
if not exist "%PY_EXE%" set "PY_EXE=%LOCALAPPDATA%\hermes\tools\python-3.14.9+20261021-win32-x64\python.exe"
if not exist "%PY_EXE%" set "PY_EXE=python"

"%PY_EXE%" -m hermes_cli.main %*
endlocal
