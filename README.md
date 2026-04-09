# ATS Resume Scorer - AI-Powered Resume Analysis Platform

A comprehensive full-stack application for analyzing and scoring resumes against job descriptions using AI/ML techniques. Built with React, Node.js, Express, and FastAPI, this platform provides detailed resume-job matching analysis with visualizations.

## 🎯 Key Features

### ML-Powered Analysis
- **TF-IDF & Cosine Similarity**: Calculates resume-job description match score
- **Skill Extraction**: Recognizes 50+ technical skills from resumes and job descriptions
- **Competency Matching**: Identifies matched and missing skills
- **Analytics Dashboard**: Visual representation of match percentages

### Smart Resume Processing
- **Multi-Format Support**: Accepts PDF and DOCX resume files
- **Text Extraction**: Advanced text parsing using pdfminer and python-docx
- **Comprehensive Skill Database**: Recognizes programming languages, frameworks, tools, and more

### Beautiful User Interface
- **Modern Design**: Glassmorphism cards with gradient backgrounds
- **Animated Results**: Smooth score animations and chart visualizations
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Interactive Charts**: Pie charts showing skill match distribution using Recharts

### Authentication & Security
- **User Management**: Registration and login system
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt password hashing
- **Protected Routes**: Authenticated access to analysis features

## 📋 System Architecture

```
ATS-Resume-Scorer/
├── ml_service/                 # FastAPI ML Service
│   ├── main.py                # FastAPI application
│   ├── utils/
│   │   ├── text_extractor.py  # PDF/DOCX text extraction
│   │   ├── skill_matcher.py   # Skill recognition & matching
│   │   └── similarity.py      # TF-IDF similarity calculation
│   ├── requirements.txt
│   ├── .env
│   └── README.md
│
├── backend/                    # Node.js Express Backend
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   └── analyze.js        # Resume analysis endpoints
│   ├── models/
│   │   └── User.js           # User database model
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── server.js             # Express server
│   ├── package.json
│   ├── .env.example
│   └── .env
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx      # Landing page
    │   │   ├── Login.jsx     # Login page
    │   │   ├── Register.jsx  # Registration page
    │   │   ├── Upload.jsx    # Resume upload page
    │   │   └── Results.jsx   # Analysis results page
    │   ├── components/
    │   │   └── Navbar.jsx    # Navigation bar
    │   ├── context/
    │   │   └── AuthContext.jsx # Authentication context
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── vite.config.js
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── .env
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for ML service)
- Node.js 16+ (for backend and frontend)
- MongoDB 4.0+ (for database)
- npm or yarn

### 1. Setup ML Service (FastAPI)

```bash
cd ml_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

The ML service will run on `http://localhost:8000`

### 2. Setup Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and settings

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📊 API Endpoints

### ML Service (FastAPI)

#### Health Check
```
GET /health
Response: { "status": "healthy", "service": "ATS Resume Analyzer ML" }
```

#### Analyze Resume
```
POST /analyze
Content-Type: multipart/form-data

Parameters:
- resume: File (PDF/DOCX)
- job_description: String

Response:
{
  "score": 85.5,
  "matched_skills": ["python", "react", "node"],
  "missing_skills": ["docker", "kubernetes"],
  "analytics": {
    "match": 75,
    "missing": 25
  }
}
```

### Backend (Node.js)

#### Health Check
```
GET /api/analyze/health
Response: { "status": "healthy", "ml_service": {...} }
```

#### Analyze Resume
```
POST /api/analyze/resume
Content-Type: multipart/form-data
Authorization: Bearer <token>

Parameters:
- resume: File (PDF/DOCX)
- job_description: String
```

#### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

## 🎓 Skill Recognition

The system recognizes 50+ skills across multiple categories:

**Programming Languages**: Python, JavaScript, TypeScript, Java, C#, C++, Go, Rust, etc.

**Frontend**: React, Angular, Vue, Svelte, HTML5, CSS3, Tailwind, Bootstrap, etc.

**Backend**: Node.js, Express, Django, Flask, FastAPI, Spring Boot, ASP.NET, etc.

**Databases**: MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch, Firebase, DynamoDB, etc.

**Cloud & DevOps**: AWS, Azure, GCP, Docker, Kubernetes, Jenkins, CI/CD, Terraform, etc.

**Testing**: Jest, Pytest, Cypress, Selenium, JUnit, etc.

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed with bcrypt
3. User logs in and receives JWT token
4. Token is stored in browser storage
5. Protected routes validate token on each request
6. Token is included in all API requests via Authorization header

## 📈 Analysis Algorithm

### Matching Score Calculation
```
Final Score = (60% × Similarity Score) + (40% × Skills Match %)
```

Where:
- **Similarity Score**: TF-IDF based cosine similarity (0-100)
- **Skills Match %**: Percentage of job required skills found in resume

### TF-IDF Vector Processing
1. Tokenize both resume and job description
2. Compute TF-IDF vectors with bigrams
3. Calculate cosine similarity between vectors
4. Scale to 0-100 percentage range

### Skill Matching
1. Extract skills from both texts using regex patterns
2. Match against predefined skill database
3. Calculate overlap percentage
4. Identify matched and missing skills

## 🎨 UI Components

### Upload Page
- Modern gradient background with animated blobs
- Drag-and-drop resume upload area
- Job description text editor
- Real-time character counter
- Form validation with error messages
- Loading states and animations

### Results Page
- Animated score display with circular progress
- Color-coded score badges (Excellent/Good/Fair/Needs Work)
- Interactive pie chart for skill distribution
- Matched and missing skills visualization
- Navigation back to upload

## 🔧 Environment Variables

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

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📦 Dependencies

### ML Service
- fastapi: Web framework
- uvicorn: ASGI server
- scikit-learn: TF-IDF and cosine similarity
- pdfminer.six: PDF text extraction
- python-docx: DOCX file processing
- python-dotenv: Environment variables

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jwt: Token authentication
- bcryptjs: Password hashing
- multer: File uploads
- axios: HTTP requests
- cors: Cross-origin requests

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- recharts: Data visualization
- lucide-react: Icons
- tailwindcss: Styling

## 🧪 Testing

### Test ML Service
```bash
# Using cURL
curl -X POST "http://localhost:8000/analyze" \
  -F "resume=@sample.pdf" \
  -F "job_description=Python developer with React experience"

# Using Python
import requests
with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/analyze',
        files={'resume': f},
        data={'job_description': 'Your job description'}
    )
    print(response.json())
```

### Access API Documentation
- **FastAPI Swagger UI**: http://localhost:8000/docs
- **Postman Collection**: Available in project root

## 🐛 Troubleshooting

### ML Service Not Responding
```bash
# Check if service is running
curl http://localhost:8000/health

# Ensure Python dependencies are installed
pip install -r requirements.txt

# Check port 8000 is not in use
netstat -tuln | grep 8000
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
mongosh

# Check connection string in .env
# Update MONGODB_URI if necessary
```

### File Upload Errors
- Ensure file size is under 50MB
- File format must be PDF or DOCX
- Check file permissions
- Verify /tmp directory exists (Linux/Mac) or temp directory (Windows)

## 📝 Example Usage Flow

1. **Register/Login**
   - Navigate to register page
   - Create account with email and password
   - Login with credentials

2. **Upload Resume**
   - Click "Analyze" in navigation
   - Drag and drop or select resume file (PDF/DOCX)
   - Paste job description
   - Click "Analyze Resume"

3. **View Results**
   - See overall match score with animated counter
   - View skills distribution pie chart
   - Review matched and missing skills
   - Get recommendations based on score

4. **Iterate**
   - Update resume with missing skills
   - Analyze again for new score
   - Track progress over time

## 🚀 Deployment

### ml_service (Production)
```bash
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### backend (Production)
```bash
npm run build  # If applicable
NODE_ENV=production npm start
```

### frontend (Production)
```bash
npm run build
# Deploy dist/ directory to static hosting
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review API docs at /docs (ML service)

## 🎉 Features Roadmap

- [ ] Resume formatting analysis
- [ ] Experience level matching
- [ ] Keyword density analysis
- [ ] ATS compliance scoring
- [ ] Resume download/export
- [ ] Job alerts and notifications
- [ ] Resume history and tracking
- [ ] Advanced NER for skill extraction
- [ ] Multi-language support
- [ ] Resume templates and tips
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Upload.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster and database
   - Get your connection string from the Atlas dashboard
   - Replace `<db_password>` in the connection string with your actual password

4. Create a `.env` file in the backend directory and add your environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_actual_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here_use_a_long_random_string
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and return JWT token
- `GET /api/auth/profile` - Get user profile (protected route)

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## Future Enhancements

- ML-based resume scoring algorithm
- Detailed ATS compatibility analysis
- Resume optimization suggestions
- User dashboard with analysis history
- Admin panel for managing users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
