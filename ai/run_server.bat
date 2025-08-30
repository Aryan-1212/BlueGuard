@echo off
echo Starting Crisis Monitoring Flask Server...
cd /d "%~dp0"
call venv\Scripts\activate.bat
python working_server.py
pause
