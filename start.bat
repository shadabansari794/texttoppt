@echo off
echo Starting Text to PowerPoint Converter...
echo.

rem Start the backend (in a new terminal window)
echo Starting FastAPI backend...
start cmd /k "cd backend && python -m uvicorn main:app --reload"

rem Allow backend to initialize
timeout /t 3 /nobreak > nul

rem Start the frontend (in a new terminal window)
echo Starting React frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend URL: http://localhost:8000
echo Frontend URL: http://localhost:5173 (default)
echo.
echo Press any key to exit this window (services will continue running)...
pause > nul
