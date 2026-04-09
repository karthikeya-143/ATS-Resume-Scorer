# Quick Start Guide - 5 Minutes to Running

Get the ATS Resume Analyzer running in under 5 minutes.

## Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- Git

## Option 1: Run with Scripts (Easiest)

### Windows
```bash
# Double-click start.bat
# or run from command line:
start.bat
```

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

**That's it!** All three services will start automatically.

---

## Option 2: Manual Setup (3 Steps)

### Step 1: ML Service (Terminal 1)
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```
✅ Done! ML service running on http://localhost:8000

### Step 2: Backend (Terminal 2)
```bash
cd backend
npm install
npm run dev
```
✅ Done! Backend running on http://localhost:5000

### Step 3: Frontend (Terminal 3)
```bash
cd frontend
npm install
npm run dev
```
✅ Done! Frontend running on http://localhost:5173

---

## Access the Application

Open your browser:
```
http://localhost:5173
```

## Test It Out

1. **Register** - Create an account
2. **Login** - Sign in with your credentials
3. **Upload** - Drag-and-drop your resume (PDF/DOCX)
4. **Analyze** - Paste a job description
5. **View Results** - See your match score and skills

## API Documentation

Swagger UI available at: http://localhost:8000/docs

## Troubleshooting

**Port in use?**
```bash
# Find and kill process on port 8000
lsof -i :8000          # macOS/Linux
netstat -ano | find :8000  # Windows

kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows
```

**MongoDB error?**
- Ensure MongoDB is running locally with `mongod`
- Or update .env with MongoDB Atlas connection string

**Module not found?**
```bash
# Reinstall dependencies
pip install -r requirements.txt  # Python
npm install                       # Node
```

## Demo Workflow

### Sample Resume Text
```
Full Stack Developer - 5 years experience
Skills: Python, JavaScript, React, Node.js, MongoDB, AWS, Docker
Experience: Built microservices, REST APIs, React frontends
```

### Sample Job Description
```
Senior Full Stack Developer needed
Required: 5+ years, Python, JavaScript, React, Node.js, MongoDB, AWS, Docker
```

**Expected Score**: ~80-90 (Excellent match)

---

## Next Steps

1. ✅ Services running locally
2. 📚 Read full [README.md](README.md) for complete documentation
3. 🔧 Read [SETUP.md](SETUP.md) for detailed setup guide
4. 🚀 Deploy to production (see README.md)
5. 🎨 Customize UI and skills database

## Services Overview

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend | 5173 | http://localhost:5173 | React UI |
| Backend | 5000 | http://localhost:5000 | Node.js API |
| ML Service | 8000 | http://localhost:8000 | FastAPI Analysis |

---

## Commands Cheat Sheet

```bash
# Start all (Windows)
start.bat

# Start all (macOS/Linux)
./start.sh

# Start ML service
cd ml_service && python main.py

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Run tests
cd ml_service && python test_api.py
cd backend && node test-integration.js

# Build for production
cd frontend && npm run build
```

---

**Happy analyzing!** 🚀

For issues, check [SETUP.md](SETUP.md) troubleshooting section.
