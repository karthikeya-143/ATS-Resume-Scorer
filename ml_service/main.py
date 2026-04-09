from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from utils.text_extractor import extract_text_from_file
from utils.skill_matcher import SkillMatcher
from utils.similarity import calculate_similarity_score
import io

load_dotenv()

app = FastAPI(
    title="ATS Resume Analyzer ML Service",
    description="ML service for analyzing resumes against job descriptions",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize skill matcher
skill_matcher = SkillMatcher()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ATS Resume Analyzer ML"}

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Analyze resume against job description
    
    Parameters:
    - resume: PDF or DOCX file
    - job_description: Job description text
    
    Returns:
    - score: Overall match score (0-100)
    - matched_skills: List of skills found in both resume and job description
    - missing_skills: List of skills in job description but not in resume
    - analytics: Match and missing percentages
    """
    try:
        # Validate file type
        allowed_extensions = {'pdf', 'docx', 'doc'}
        file_extension = resume.filename.split('.')[-1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        if not job_description.strip():
            raise HTTPException(
                status_code=400,
                detail="Job description cannot be empty"
            )
        
        # Read file content
        file_content = await resume.read()
        
        # Extract text from resume
        resume_text = extract_text_from_file(io.BytesIO(file_content), file_extension)
        
        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from the resume"
            )
        
        # Calculate similarity score
        similarity_score = calculate_similarity_score(resume_text, job_description)
        
        # Extract and match skills
        resume_skills = skill_matcher.extract_skills(resume_text)
        job_skills = skill_matcher.extract_skills(job_description)
        
        matched_skills = list(set(resume_skills) & set(job_skills))
        missing_skills = list(set(job_skills) - set(resume_skills))
        
        # Calculate analytics
        total_job_skills = len(job_skills) if job_skills else 1
        match_percentage = round((len(matched_skills) / total_job_skills) * 100, 2) if job_skills else 0
        missing_percentage = round(100 - match_percentage, 2)
        
        # Combine scores (60% similarity + 40% skills match)
        final_score = round((similarity_score * 0.6) + (match_percentage * 0.4), 2)
        
        return {
            "score": final_score,
            "matched_skills": sorted(matched_skills),
            "missing_skills": sorted(missing_skills),
            "analytics": {
                "match": match_percentage,
                "missing": missing_percentage
            },
            "debug": {
                "similarity_score": similarity_score,
                "resume_skills_count": len(resume_skills),
                "job_skills_count": len(job_skills)
            }
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("ML_SERVICE_PORT", 8000)),
        reload=os.getenv("ML_SERVICE_RELOAD", "true").lower() == "true"
    )
