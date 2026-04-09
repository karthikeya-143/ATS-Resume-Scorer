import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, AlertCircle, Loader } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResume(file);
        setError('');
      } else {
        setError('Only PDF and DOCX files are allowed');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResume(file);
        setError('');
      } else {
        setError('Only PDF and DOCX files are allowed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resume) {
      setError('Please select a resume file');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('job_description', jobDescription);

      const response = await axios.post('/api/analyze/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to results page with data
      navigate('/results', { state: { analysisData: response.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ATS Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Upload your resume and job description to get instant matching analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-white/80 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Alert */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-slideIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Resume Upload Section */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800">Resume Upload</label>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-input"
                  disabled={loading}
                />

                <label htmlFor="resume-input" className="flex flex-col items-center gap-3 cursor-pointer">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {resume ? resume.name : 'Drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-600">or click to browse (PDF, DOCX)</p>
                  </div>
                </label>

                {resume && (
                  <button
                    type="button"
                    onClick={() => setResume(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>

              {resume && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  <span className="text-lg">✓</span>
                  <span className="font-medium">{resume.name} selected</span>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="space-y-4">
              <label htmlFor="jobDesc" className="text-lg font-semibold text-gray-800">
                Job Description
              </label>
              <textarea
                id="jobDesc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. Include key requirements, skills, and qualifications..."
                rows={8}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-gray-700 placeholder-gray-400 disabled:opacity-50"
              />
              <p className="text-sm text-gray-500">
                {jobDescription.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !resume || !jobDescription.trim()}
                className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading || !resume || !jobDescription.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>Analyze Resume</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Section */}
            <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">50+</div>
                <p className="text-sm text-gray-600">Skills Recognized</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">AI-Powered</div>
                <p className="text-sm text-gray-600">TF-IDF Analysis</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">Instant</div>
                <p className="text-sm text-gray-600">Results</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}