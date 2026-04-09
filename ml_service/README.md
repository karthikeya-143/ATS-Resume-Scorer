# ATS Resume Analyzer ML Service

FastAPI-based machine learning service for analyzing and scoring resumes against job descriptions.

## Features

- **Resume Text Extraction**: Parse PDF and DOCX files to extract text
- **TF-IDF & Cosine Similarity**: Calculate resume-job description match score
- **Skill Extraction**: Identify and match skills from resume vs job description
- **Analytics**: Generate detailed match percentages and missing skills analysis

## Setup

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

1. Navigate to the ml_service directory:
```bash
cd ml_service
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

### Development Mode
```bash
python main.py
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The service will be available at http://localhost:8000

## API Endpoints

### Health Check
**GET** `/health`

Returns service health status.

### Analyze Resume
**POST** `/analyze`

Analyze a resume against a job description.

**Parameters:**
- `resume` (File): PDF or DOCX file
- `job_description` (string): Job description text

**Response:**
```json
{
  "score": 85,
  "matched_skills": ["python", "react", "node"],
  "missing_skills": ["docker", "kubernetes"],
  "analytics": {
    "match": 70,
    "missing": 30
  }
}
```

## Testing

You can test the API using:

1. **cURL**:
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "resume=@resume.pdf" \
  -F "job_description=We are looking for a Python developer with React experience"
```

2. **FastAPI Swagger UI**:
Visit http://localhost:8000/docs

3. **Python Requests**:
```python
import requests

with open('resume.pdf', 'rb') as f:
    files = {'resume': f}
    data = {'job_description': 'Your job description here'}
    response = requests.post('http://localhost:8000/analyze', files=files, data=data)
    print(response.json())
```

## Skill List

The service recognizes 50+ skills including:
- Programming Languages: Python, JavaScript, Java, C#, Go, Rust, etc.
- Frontend: React, Angular, Vue, Svelte, Tailwind, etc.
- Backend: Node, Express, Django, Flask, FastAPI, Spring Boot, etc.
- Databases: MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch, etc.
- Cloud & DevOps: AWS, Azure, GCP, Docker, Kubernetes, Jenkins, etc.
- Testing: Jest, Pytest, Cypress, Selenium, etc.

## Architecture

```
ml_service/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env                   # Environment configuration
└── utils/
    ├── text_extractor.py  # Extract text from PDF/DOCX
    ├── skill_matcher.py   # Skill extraction and matching
    └── similarity.py      # TF-IDF and cosine similarity
```

## Error Handling

The service provides detailed error messages for:
- Invalid file types
- Empty job descriptions
- Text extraction failures
- Processing errors

## Performance

- **Processing Time**: ~1-2 seconds per resume (excluding upload)
- **Max File Size**: Typically 50MB (configurable)
- **Concurrent Requests**: Can handle multiple requests simultaneously

## Future Enhancements

- Named Entity Recognition (NER) for advanced skill extraction
- Resume formatting analysis
- Experience level matching
- Keyword frequency analysis
- Resume ATS compliance scoring
