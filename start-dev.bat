@echo off
echo ========================================================
echo   Starting Tomorrow-Me-AI (Local Backend + Frontend)
echo ========================================================

start "Tomorrow-Me Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

start "Tomorrow-Me Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both services launched!
echo - Backend API:  http://localhost:8000/docs
echo - Frontend UI:  http://localhost:3000
pause
