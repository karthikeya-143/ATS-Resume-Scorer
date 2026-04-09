# Setup Guide - ATS Resume Scorer

Complete step-by-step guide to set up and run the entire ATS Resume Scorer application.

## Prerequisites

Before starting, ensure you have installed:

1. **Python 3.8+** - Download from https://www.python.org/downloads/
2. **Node.js 16+** - Download from https://nodejs.org/
3. **MongoDB** - Download from https://www.mongodb.com/try/download/community
   - Alternative: Use MongoDB Atlas (cloud version) or Docker

## Installation Steps

### Step 1: Clone/Setup Project

```bash
# Navigate to project directory
cd ATS-Resume-Scorer
```

### Step 2: Setup ML Service (FastAPI)

```bash
# Navigate to ml_service directory
cd ml_service

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Check .env file (should be already configured)
type .env  # Windows: type, macOS/Linux: cat
```

### Step 3: Setup Backend (Node.js + Express)

```bash
# Navigate to backend directory
cd ../backend

# Install Node dependencies
npm install

# Create .env file from example
copy .env.example .env  # Windows
# or
cp .env.example .env  # macOS/Linux

# Edit .env file with your settings
# Make sure ML_SERVICE_URL points to your ML service
# ML_SERVICE_URL=http://localhost:8000
# MONGODB_URI=mongodb://localhost:27017/ats-resume-scorer
```

### Step 4: Setup Frontend (React + Vite)

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node dependencies
npm install

# Create .env file if needed
copy .env.example .env  # Windows (if exists)
# or
cp .env.example .env    # macOS/Linux (if exists)
```

## Running the Application

### Terminal 1: Start ML Service

```bash
cd ml_service

# Activate virtual environment (if not already active)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start FastAPI server
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Terminal 2: Start Backend

```bash
cd backend

# Start Node.js server
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected successfully
```

### Terminal 3: Start Frontend

```bash
cd frontend

# Start React development server
npm run dev
```

Expected output:
```
VITE v4.5.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Testing the API

### 1. Test ML Service Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ATS Resume Analyzer ML"
}
```

### 2. Test Backend Health

```bash
curl http://localhost:5000/api/analyze/health
```

### 3. Test Resume Analysis

Using cURL:
```bash
curl -X POST http://localhost:8000/analyze \
  -F "resume=@/path/to/resume.pdf" \
  -F "job_description=Python developer with 5 years experience required"
```

Using Postman:
1. Open Postman
2. Create POST request to `http://localhost:5000/api/analyze/resume`
3. In Body section, select "form-data"
4. Add field "resume" (type: File) and select your resume
5. Add field "job_description" (type: Text) and enter job description
6. Send request

## User Workflow

1. **Create Account**
   - Navigate to Register page
   - Enter email and password
   - Click Register

2. **Login**
   - Navigate to Login page
   - Enter email and password
   - Click Login

3. **Analyze Resume**
   - Click "Analyze" in navigation
   - Upload resume (PDF/DOCX) via drag-and-drop or file picker
   - Paste job description
   - Click "Analyze Resume"

4. **View Results**
   - See match score with animation
   - View skills chart
   - Review matched and missing skills
   - Navigate back to analyze another resume

## Sample Test Data

### Sample Resume Text
```
John Doe
Full Stack Developer

SKILLS:
- Java, Python, JavaScript
- React, Angular, Node.js
- MongoDB, PostgreSQL, MySQL
- AWS, Docker, Kubernetes
- Git, Jenkins, CI/CD

EXPERIENCE:
Senior Developer - Tech Corp (2020-2024)
- Built microservices using Spring Boot
- Developed React frontend applications
- Managed Kubernetes deployments
- Improved code quality with 95% test coverage

Junior Developer - StartupXYZ (2018-2020)
- Developed Node.js APIs
- Created Angular single page applications
```

### Sample Job Description
```
We are looking for a Senior Full Stack Developer

Required Skills & Experience:
- 5+ years experience with Java and Python
- Strong React and Angular expertise
- MongoDB and PostgreSQL experience
- AWS and Docker knowledge
- CI/CD pipeline experience
- Git version control
- REST API design

Nice to Have:
- Kubernetes experience
- Microservices architecture knowledge
- Agile methodology experience
```

Expected Score: ~85-90 (Excellent match)

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Find process using port
lsof -i :8000  # Linux/macOS
netstat -ano | findstr :8000  # Windows

# Kill process (replace PID)
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
# Start MongoDB (if installed locally)
mongod

# For MongoDB Atlas, update connection string in .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Python Dependencies Error

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check installed packages
pip list
```

### ML Service Connection Error

Ensure:
1. ML service is running on correct port (8000)
2. Backend .env has correct ML_SERVICE_URL
3. No firewall blocking localhost:8000
4. Try accessing http://localhost:8000/health in browser

### React Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules  # Linux/macOS
rmdir /s node_modules  # Windows

npm install
npm run dev
```

## Environment Configuration

### ML Service (.env)
```
ML_SERVICE_PORT=8000
ML_SERVICE_RELOAD=true
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ats-resume-scorer
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Frontend Configuration
The frontend connects to backend at `http://localhost:5000` by default. If you need to change this, update the axios default base URL in the API calls.

## Debugging

### Enable Verbose Logging

**ML Service:**
```python
# In main.py, add:
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Backend:**
```bash
# Set debug environment
DEBUG=* npm run dev
```

## Performance Tips

1. **Use local MongoDB** instead of Atlas for development (faster)
2. **Cache ML model** initialization for faster analysis
3. **Enable frontend optimization** in production build
4. **Use development versions** of libraries during testing

## Next Steps

1. ✅ Everything is now running locally
2. Customize resume requirements in `./ml_service/utils/skill_matcher.py`
3. Add more skills to the database
4. Implement user preferences and saved analyses
5. Deploy to cloud (AWS, Azure, Heroku)

## Support Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- MongoDB Docs: https://docs.mongodb.com/
- Tailwind CSS: https://tailwindcss.com/

## Common Commands

```bash
# ML Service
cd ml_service
python main.py

# Backend
cd backend
npm install
npm run dev
npm start

# Frontend
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

## File Upload Limits

- Max file size: 50MB
- Supported formats: PDF, DOCX
- Max job description: No limit (but perform well with 200-2000 words)

---

**Setup Complete!** You should now have the full ATS Resume Scorer running locally with all three services (ML, Backend, Frontend) communicating successfully.
