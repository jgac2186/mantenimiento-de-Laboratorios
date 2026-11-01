@echo off
title Servidor Local MantoLab
echo Iniciando servidor local para MantoLab PWA...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
