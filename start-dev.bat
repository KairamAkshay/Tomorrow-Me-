@echo off
echo ========================================================
echo   Starting Tomorrow-Me-AI (Local Backend + Frontend)
echo ========================================================
echo.
echo Launching Backend on http://localhost:8000 ...
start "Tomorrow-Me Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Launching Frontend on http://localhost:3000 ...
start "Tomorrow-Me Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Both services are starting!
echo   - Backend Docs:  http://localhost:8000/docs
echo   - Frontend App:  http://localhost:3000
echo ========================================================
echo.
pause
