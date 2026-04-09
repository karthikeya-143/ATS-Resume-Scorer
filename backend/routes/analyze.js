const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const os = require('os');
const fs = require('fs');
const FormData = require('form-data');

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(os.tmpdir(), 'ats-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, timestamp + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.docx', '.doc'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Health check for ML service
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json({
      status: 'healthy',
      ml_service: response.data,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'ML service is not available',
      details: error.message,
    });
  }
});

/**
 * Analyze resume against job description
 * POST /api/analyze/resume
 * Body:
 *   - resume: File (PDF/DOCX)
 *   - job_description: String
 */
router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const jobDescription = req.body.job_description;
    if (!jobDescription || !jobDescription.trim()) {
      // Clean up uploaded file
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Prepare form data for ML service
    const formData = new FormData();
    const fileStream = fs.createReadStream(req.file.path);
    formData.append('resume', fileStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('job_description', jobDescription);

    // Send to ML service
    const response = await axios.post(
      `${ML_SERVICE_URL}/analyze`,
      formData,
      {
        headers: formData.getHeaders?.() || {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Clean up uploaded file
    fs.unlink(req.file.path, () => {});

    // Return ML service response
    res.json(response.data);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        error: error.response.data?.detail || 'Invalid request to ML service',
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'ML service is not available. Please ensure the FastAPI service is running on ' + ML_SERVICE_URL,
      });
    }

    res.status(500).json({
      error: 'Error analyzing resume',
      details: error.message,
    });
  }
});

module.exports = router;
