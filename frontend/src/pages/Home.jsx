import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          ATS Resume Analyzer
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Get your resume scored by our advanced ATS (Applicant Tracking System) analyzer.
          Optimize your resume to pass through automated screening systems and land more interviews.
        </p>
        <Link to="/upload" className="btn-primary text-lg px-8 py-3">
          Upload Resume
        </Link>
      </div>

      {/* How ATS Works Section */}
      <div className="card max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">How ATS Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Keyword Matching</h3>
            <p className="text-gray-300">
              ATS scans for relevant keywords from the job description to determine if your resume matches the requirements.
            </p>
          </div>
          <div className="text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Format Analysis</h3>
            <p className="text-gray-300">
              Systems check for proper formatting, readable fonts, and structure that can be easily parsed by algorithms.
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Scoring System</h3>
            <p className="text-gray-300">
              Resumes are scored based on relevance, completeness, and how well they align with the job criteria.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Use Our ATS Scorer?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Shield className="h-8 w-8 text-green-400 mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Accurate Analysis</h3>
            <p className="text-gray-300">
              Our system uses industry-standard algorithms to provide reliable ATS compatibility scores.
            </p>
          </div>
          <div>
            <TrendingUp className="h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Detailed Feedback</h3>
            <p className="text-gray-300">
              Get specific recommendations on how to improve your resume's ATS performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;