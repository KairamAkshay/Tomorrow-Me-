@echo off
echo ========================================================
echo   Starting MongoDB Windows Service
echo ========================================================
echo.
net start MongoDB
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] MongoDB Server is now running on port 27017!
    echo You can now connect with MongoDB Compass:
    echo   mongodb://127.0.0.1:27017
) else (
    echo.
    echo [ERROR] Failed to start service.
    echo Please make sure you Right-Click this file and choose:
    echo   "Run as administrator"
)
echo.
pause
