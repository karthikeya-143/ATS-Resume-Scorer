#!/bin/bash

# ATS Resume Scorer - Start All Services (Unix/macOS/Linux)

echo ""
echo "========================================"
echo "ATS Resume Scorer - Startup Script"
echo "========================================"
echo ""

# Check if all directories exist
if [ ! -d "ml_service" ]; then
    echo "Error: ml_service directory not found"
    exit 1
fi
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found"
    exit 1
fi
if [ ! -d "frontend" ]; then
    echo "Error: frontend directory not found"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    echo "All services stopped."
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Start ML Service
echo ""
echo "[1/3] Starting ML Service (FastAPI)..."
cd ml_service

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -q -r requirements.txt

# Start ML service in background
python main.py &
ML_PID=$!
echo "ML Service started (PID: $ML_PID)"

cd ..

# Wait for ML service to start
sleep 3

# Start Backend
echo ""
echo "[2/3] Starting Backend (Node.js)..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install > /dev/null 2>&1
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo ""
echo "[3/3] Starting Frontend (React)..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install > /dev/null 2>&1
fi

# Start frontend in terminal (will stay in foreground)
cd ..

echo ""
echo "========================================"
echo "All services started!"
echo "========================================"
echo ""
echo "Services:"
echo "  - ML Service:  http://localhost:8000"
echo "  - Backend:     http://localhost:5000"
echo "  - Frontend:    http://localhost:5173"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Starting Frontend (this will stay in foreground)..."
echo "Press Ctrl+C to stop all services."
echo "========================================"
echo ""

cd frontend
npm run dev
