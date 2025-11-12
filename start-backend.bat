@echo off
echo ========================================
echo Starting Sales Compensation Backend
echo ========================================
echo.

cd backend
echo Installing dependencies...
call npm install

echo.
echo Starting backend server on port 3001...
call npm start
