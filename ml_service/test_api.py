"""
Test script for the ATS Resume Analyzer ML Service
Run this to test the API endpoints
"""

import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n🏥 Testing Health Endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_analyze(resume_path=None, job_description=None):
    """Test resume analysis endpoint"""
    print("\n📄 Testing Resume Analysis Endpoint...")
    
    # Default test data
    if job_description is None:
        job_description = """
        We are looking for a Senior Full Stack Developer with the following requirements:
        - 5+ years of professional experience
        - Strong Python and JavaScript expertise
        - React and Node.js experience
        - MongoDB and PostgreSQL databases
        - Docker and Kubernetes
        - AWS cloud services
        - Git version control
        - REST API design
        - Microservices architecture
        - CI/CD pipelines
        """
    
    # Check if test resume exists
    if resume_path is None:
        # Try to find a sample resume
        test_files = list(Path(".").glob("*.pdf")) + list(Path(".").glob("*.docx"))
        if test_files:
            resume_path = test_files[0]
            print(f"Using test file: {resume_path}")
        else:
            print("❌ No resume file found. Please provide a PDF or DOCX file.")
            return False
    
    try:
        with open(resume_path, 'rb') as f:
            files = {'resume': f}
            data = {'job_description': job_description}
            
            response = requests.post(
                f"{BASE_URL}/analyze",
                files=files,
                data=data,
                timeout=30
            )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response:")
        print(json.dumps(result, indent=2))
        
        # Print summary
        if response.status_code == 200:
            print(f"\n📊 Analysis Summary:")
            print(f"  Overall Score: {result['score']}/100")
            print(f"  Matched Skills: {len(result['matched_skills'])}")
            print(f"  Missing Skills: {len(result['missing_skills'])}")
            print(f"  Match Percentage: {result['analytics']['match']}%")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 ATS Resume Analyzer ML Service - Test Suite")
    print("=" * 50)
    
    # Test health
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ ML Service is not responding. Ensure it's running on http://localhost:8000")
        print("Start it with: python main.py")
        return
    
    print("\n✅ ML Service is running!")
    
    # Test analysis
    analyze_ok = test_analyze()
    
    print("\n" + "=" * 50)
    if health_ok and analyze_ok:
        print("✅ All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
