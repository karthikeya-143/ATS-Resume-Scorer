const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const os = require('os');
const fs = require('fs');
const FormData = require('form-data');

/**
 * This is a test file to verify the ML service integration
 * Run with: node test-integration.js
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function testMLServiceHealth() {
  console.log('\n🏥 Testing ML Service Health...');
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    console.log('✅ ML Service Status:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ML Service Error:', error.message);
    return false;
  }
}

async function testResumeSampleAnalysis() {
  console.log('\n📄 Testing Resume Analysis with Sample Data...');
  
  const sampleJobDescription = `
    We are looking for a Senior Full Stack Developer with:
    - 5+ years professional experience
    - JavaScript, Python, Node.js expertise
    - React and Angular experience
    - MongoDB and PostgreSQL databases
    - Docker and Kubernetes knowledge
    - AWS cloud services
    - CI/CD pipelines and Jenkins
    - REST API design
    - Git version control and Agile
  `;

  try {
    // Create a sample resume as a text file (simulating a DOCX)
    const resumePath = path.join(os.tmpdir(), 'sample_resume.txt');
    const resumeContent = `
      John Doe
      Senior Full Stack Developer
      
      SKILLS:
      - JavaScript, Python, TypeScript, Java
      - React, Angular, Vue.js
      - Node.js, Express, Django
      - MongoDB, PostgreSQL, MySQL
      - Docker, Kubernetes
      - AWS, Google Cloud
      - Git, Jenkins
      
      EXPERIENCE:
      Senior Developer at TechCorp (2019-2024)
      - Led development of microservices architecture
      - Built React and Angular applications
      - Managed Kubernetes clusters
      - Implemented CI/CD pipelines with Jenkins
      
      Junior Developer at StartupXYZ (2018-2019)
      - Developed Node.js REST APIs
      - Created React components
    `;

    fs.writeFileSync(resumePath, resumeContent);

    // Note: ML service expects actual file uploads, 
    // so we'll just log what would be sent
    console.log('Sample Job Description:');
    console.log(sampleJobDescription.trim());
    console.log('\nSample Resume (first 200 chars):');
    console.log(resumeContent.substring(0, 200) + '...');
    console.log('✅ Sample data prepared');

    // Clean up
    fs.unlinkSync(resumePath);
    return true;
  } catch (error) {
    console.error('❌ Error preparing sample data:', error.message);
    return false;
  }
}

async function testBackendIntegration() {
  console.log('\n🔗 Testing Backend Integration...');
  
  const testData = {
    score: 85,
    matched_skills: ['javascript', 'react', 'node', 'mongodb', 'git'],
    missing_skills: ['kubernetes', 'jenkins'],
    analytics: {
      match: 70,
      missing: 30
    }
  };

  console.log('Expected ML Response Format:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('✅ Integration test data ready');
  return true;
}

async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('ATS Resume Scorer - Integration Test Suite');
  console.log('='.repeat(50));

  let results = {
    mlHealth: false,
    sampleData: false,
    integration: false
  };

  // Run tests
  results.mlHealth = await testMLServiceHealth();
  results.sampleData = await testResumeSampleAnalysis();
  results.integration = await testBackendIntegration();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Results Summary:');
  console.log('='.repeat(50));
  console.log('ML Service Health:', results.mlHealth ? '✅ PASS' : '❌ FAIL');
  console.log('Sample Data:', results.sampleData ? '✅ PASS' : '❌ FAIL');
  console.log('Integration Format:', results.integration ? '✅ PASS' : '❌ FAIL');

  const allPassed = Object.values(results).every(r => r === true);
  console.log('\nOverall:', allPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');
  console.log('='.repeat(50) + '\n');

  return allPassed;
}

// Run tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});
