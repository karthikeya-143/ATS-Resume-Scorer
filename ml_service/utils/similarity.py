"""
Module for calculating similarity between resume and job description
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_similarity_score(resume_text, job_description):
    """
    Calculate similarity score between resume and job description using TF-IDF and cosine similarity
    
    Args:
        resume_text: Resume text content
        job_description: Job description text content
    
    Returns:
        float: Similarity score (0-100)
    """
    try:
        # Create TF-IDF vectorizer
        vectorizer = TfidfVectorizer(
            max_features=500,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1,
            max_df=0.95
        )
        
        # Combine texts for vectorization
        texts = [resume_text, job_description]
        
        # Fit and transform
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Calculate cosine similarity between resume and job description
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        
        # Convert to percentage (0-100)
        similarity_score = float(similarity_matrix[0][0]) * 100
        
        return round(similarity_score, 2)
        
    except Exception as e:
        raise Exception(f"Error calculating similarity: {str(e)}")
