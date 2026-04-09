import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [animatedScore, setAnimatedScore] = useState(0);
  const analysisData = location.state?.analysisData;

  // Redirect to upload if no data
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Analysis Data</h1>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back to Upload
          </button>
        </div>
      </div>
    );
  }

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = analysisData.score / 50;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= analysisData.score) {
          setAnimatedScore(analysisData.score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current * 10) / 10);
        }
      }, 30);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [analysisData.score]);

  // Chart data
  const chartData = [
    { name: 'Matched Skills', value: analysisData.analytics.match, fill: '#4F46E5' },
    { name: 'Missing Skills', value: analysisData.analytics.missing, fill: '#F87171' },
  ];

  // Score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-indigo-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  const scoreBadge = getScoreBadge(animatedScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analysis Results
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Score and Main Metrics */}
          <div className="space-y-8">
            {/* Score Card */}
            <div className="backdrop-blur-2xl bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                {/* Animated Score Circle */}
                <div className={`relative w-48 h-48 mx-auto`}>
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="75"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="75"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(animatedScore / 100) * 471} 471`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 0.3s ease' }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-800">{Math.round(animatedScore)}</div>
                    <div className="text-gray-600">/ 100</div>
                  </div>
                </div>

                {/* Badge */}
                <div className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${scoreBadge.color}`}>
                  {scoreBadge.label}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  {animatedScore >= 80 &&
                    'Excellent match! Your resume aligns well with the job requirements.'}
                  {animatedScore >= 60 && animatedScore < 80 &&
                    'Good match! Consider adding a few more relevant skills.'}
                  {animatedScore >= 40 && animatedScore < 60 &&
                    'Fair match. Look into acquiring some of the missing skills.'}
                  {animatedScore < 40 &&
                    'Needs attention. Review the missing skills and update your resume accordingly.'}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-2xl bg-white/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    {analysisData.matched_skills.length}
                  </div>
                  <p className="text-gray-600 mt-2">Matched Skills</p>
                </div>
              </div>
              <div className="backdrop-blur-2xl bg-white/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {analysisData.missing_skills.length}
                  </div>
                  <p className="text-gray-600 mt-2">Missing Skills</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Details */}
          <div className="space-y-8">
            {/* Pie Chart */}
            <div className="backdrop-blur-2xl bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Skills Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                  <span className="text-gray-700">{analysisData.analytics.match}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <span className="text-gray-700">{analysisData.analytics.missing}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Details */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Matched Skills */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">
                Matched Skills ({analysisData.matched_skills.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisData.matched_skills.length > 0 ? (
                analysisData.matched_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium text-sm hover:bg-green-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No matched skills found</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">
                Missing Skills ({analysisData.missing_skills.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisData.missing_skills.length > 0 ? (
                analysisData.missing_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-medium text-sm hover:bg-red-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">All required skills are matched!</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate('/upload')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Analyze Another Resume
          </button>
        </div>
      </div>
    </div>
  );
}
