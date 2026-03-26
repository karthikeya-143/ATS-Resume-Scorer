import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, X } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first');
      return;
    }
    // For now, just show an alert. ML processing will be added later.
    alert(`File "${file.name}" uploaded successfully! ML processing will be implemented soon.`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Upload Your Resume</h1>

          <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-white/30 hover:border-white/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-12 w-12 text-blue-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-300 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 transition duration-200"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <UploadIcon className="h-16 w-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-white text-lg font-medium mb-2">
                      Drag and drop your resume here
                    </p>
                    <p className="text-gray-300 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports PDF and DOCX files (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6 text-lg py-3"
              disabled={!file}
            >
              Analyze Resume
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Your resume will be analyzed for ATS compatibility, keyword optimization, and formatting best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;