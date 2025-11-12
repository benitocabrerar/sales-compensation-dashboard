@echo off
echo ========================================
echo Sales Compensation Dashboard
echo Full Stack Application Launcher
echo ========================================
echo.
echo This will start both backend and frontend servers
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.
pause

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm install && npm start"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo.
echo Backend API: http://localhost:3001/api/health
echo Frontend App: http://localhost:3000
echo.
echo Check the separate terminal windows for server logs
echo ========================================
