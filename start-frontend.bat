@echo off
echo ========================================
echo Starting Sales Compensation Frontend
echo ========================================
echo.

cd frontend
echo Installing dependencies...
call npm install

echo.
echo Starting frontend development server on port 3000...
call npm run dev
