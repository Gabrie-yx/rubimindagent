@echo off
setlocal
set "RUBIMIND_ROOT=%~dp0"
set "PYTHONPATH=%RUBIMIND_ROOT%;%PYTHONPATH%"
python -m rubimind_cli.main %*
endlocal
