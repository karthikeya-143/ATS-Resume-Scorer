@echo off
REM ATS Resume Scorer - Start All Services (Windows)

echo.
echo ========================================
echo ATS Resume Scorer - Startup Script
echo ========================================
echo.

REM Check if all directories exist
if not exist ml_service (
    echo Error: ml_service directory not found
    exit /b 1
)
if not exist backend (
    echo Error: backend directory not found
    exit /b 1
)
if not exist frontend (
    echo Error: frontend directory not found
    exit /b 1
)

REM Start ML Service
echo.
echo [1/3] Starting ML Service (FastAPI)...
cd ml_service
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt > nul 2>&1
start "ATS ML Service" cmd /k python main.py
cd ..

REM Wait a moment for ML service to start
timeout /t 3 /nobreak

REM Start Backend
echo.
echo [2/3] Starting Backend (Node.js)...
cd backend
if not exist node_modules (
    echo Installing Node dependencies...
    npm install > nul 2>&1
)
start "ATS Backend" cmd /k npm run dev
cd ..

REM Wait for backend to start
timeout /t 2 /nobreak

REM Start Frontend
echo.
echo [3/3] Starting Frontend (React)...
cd frontend
if not exist node_modules (
    echo Installing Node dependencies...
    npm install > nul 2>&1
)
start "ATS Frontend" cmd /k npm run dev
cd ..

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Services:
echo   - ML Service:  http://localhost:8000
echo   - Backend:     http://localhost:5000
echo   - Frontend:    http://localhost:5173
echo.
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C in any window to stop that service.
echo ========================================
echo.

timeout /t 5
