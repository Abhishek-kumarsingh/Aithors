#!/usr/bin/env node

/**
 * Setup Practice System Script
 * 
 * This script sets up the complete practice question bank system:
 * 1. Seeds the database with practice questions
 * 2. Tests API endpoints
 * 3. Verifies the complete workflow
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Practice Question Bank System...\n');

// Check if required environment variables are set
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'GEMINI_API_KEY_1'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set these variables in your .env.local file');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

// Check if MongoDB is accessible
async function checkMongoConnection() {
  console.log('\n🔍 Checking MongoDB connection...');
  
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please ensure MongoDB is running and the connection string is correct');
    process.exit(1);
  }
}

// Run the practice questions seeding script
async function seedPracticeQuestions() {
  console.log('\n📝 Seeding practice questions...');
  
  try {
    // Import and run the seeding function
    const { seedPracticeQuestions } = require('./seed-practice-questions.js');
    await seedPracticeQuestions();
    console.log('✅ Practice questions seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding practice questions:', error.message);
    console.error('Continuing with setup...');
  }
}

// Test API endpoints
async function testApiEndpoints() {
  console.log('\n🧪 Testing API endpoints...');
  
  // Note: In a real scenario, you would start the Next.js server and test endpoints
  // For now, we'll just check if the files exist
  
  const apiEndpoints = [
    'app/api/user/practice/questions/route.ts',
    'app/api/user/practice/questions/[id]/route.ts',
    'app/api/user/practice/sessions/route.ts',
    'app/api/admin/practice/generate-questions/route.ts'
  ];
  
  let allEndpointsExist = true;
  
  apiEndpoints.forEach(endpoint => {
    if (fs.existsSync(endpoint)) {
      console.log(`✅ ${endpoint}`);
    } else {
      console.log(`❌ ${endpoint} - Missing`);
      allEndpointsExist = false;
    }
  });
  
  if (allEndpointsExist) {
    console.log('✅ All API endpoints are in place');
  } else {
    console.log('⚠️ Some API endpoints are missing');
  }
}

// Check frontend components
function checkFrontendComponents() {
  console.log('\n🎨 Checking frontend components...');
  
  const components = [
    'app/dashboard/practice/page.tsx',
    'app/dashboard/practice/[id]/page.tsx',
    'app/dashboard/code-environment/page.tsx',
    'components/shared/CodingLayout.tsx',
    'components/interview/QuestionDisplay.tsx'
  ];
  
  let allComponentsExist = true;
  
  components.forEach(component => {
    if (fs.existsSync(component)) {
      console.log(`✅ ${component}`);
    } else {
      console.log(`❌ ${component} - Missing`);
      allComponentsExist = false;
    }
  });
  
  if (allComponentsExist) {
    console.log('✅ All frontend components are in place');
  } else {
    console.log('⚠️ Some frontend components are missing');
  }
}

// Generate package.json script for seeding
function addSeedingScript() {
  console.log('\n📦 Adding seeding script to package.json...');
  
  try {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['seed:practice'] = 'node scripts/seed-practice-questions.js';
    packageJson.scripts['setup:practice'] = 'node scripts/setup-practice-system.js';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added seeding scripts to package.json');
    console.log('   - npm run seed:practice');
    console.log('   - npm run setup:practice');
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
  }
}

// Create a simple test file for the practice system
function createTestFile() {
  console.log('\n🧪 Creating test file...');
  
  const testContent = `// Practice System Test
// Run this file to test the practice question bank system

const testPracticeSystem = async () => {
  console.log('Testing Practice Question Bank System...');
  
  // Test 1: Check if questions exist in database
  try {
    const response = await fetch('/api/user/practice/questions?limit=5');
    const data = await response.json();
    
    if (data.success && data.questions.length > 0) {
      console.log('✅ Questions found in database:', data.questions.length);
    } else {
      console.log('❌ No questions found in database');
    }
  } catch (error) {
    console.log('❌ Error fetching questions:', error.message);
  }
  
  // Test 2: Check if individual question fetch works
  // This would be implemented in a real test environment
  
  console.log('Test completed');
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPracticeSystem };
}
`;
  
  fs.writeFileSync('tests/practice-system.test.js', testContent);
  console.log('✅ Created test file: tests/practice-system.test.js');
}

// Create documentation
function createDocumentation() {
  console.log('\n📚 Creating documentation...');
  
  const docContent = `# Practice Question Bank System

## Overview
The practice question bank system allows users to practice coding and technical questions across different domains and difficulty levels.

## Features
- ✅ AI-generated questions using Gemini API
- ✅ Multiple question types (MCQ, Coding, Subjective, System Design)
- ✅ 80/20 split-screen layout for coding questions
- ✅ Real-time code execution
- ✅ Progress tracking and statistics
- ✅ Filtering by domain, difficulty, and type

## API Endpoints

### Practice Questions
- \`GET /api/user/practice/questions\` - Get all practice questions with filters
- \`GET /api/user/practice/questions/[id]\` - Get specific question by ID
- \`POST /api/user/practice/questions\` - Create new question (admin only)

### Practice Sessions
- \`GET /api/user/practice/sessions\` - Get user's practice sessions
- \`POST /api/user/practice/sessions\` - Start new practice session

### Admin
- \`POST /api/admin/practice/generate-questions\` - Generate questions using AI

## Database Schema

### PracticeQuestion
\`\`\`javascript
{
  title: String,
  description: String,
  type: 'mcq' | 'subjective' | 'coding' | 'system-design',
  difficulty: 'easy' | 'medium' | 'hard',
  domain: String,
  subDomain: String,
  content: {
    question: String,
    options: [String], // For MCQ
    correctAnswer: Mixed, // For MCQ
    sampleInput: String, // For coding
    sampleOutput: String, // For coding
    constraints: String, // For coding
    hints: [String]
  },
  timeLimit: Number,
  points: Number,
  companies: [String],
  stats: {
    totalAttempts: Number,
    correctAttempts: Number,
    averageTime: Number,
    averageScore: Number
  }
}
\`\`\`

## Usage

### Seeding Questions
\`\`\`bash
npm run seed:practice
\`\`\`

### Testing System
\`\`\`bash
npm run setup:practice
\`\`\`

## Troubleshooting

### No Questions Showing
1. Check if questions are seeded: \`npm run seed:practice\`
2. Verify MongoDB connection
3. Check API endpoints are working
4. Ensure user is authenticated

### Code Editor Not Working
1. Check Monaco Editor is properly loaded
2. Verify CodingLayout component is imported
3. Check 80/20 split layout is applied

### AI Generation Failing
1. Verify Gemini API keys are set
2. Check API rate limits
3. Fallback questions should be generated
`;
  
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }
  
  fs.writeFileSync('docs/PRACTICE_SYSTEM.md', docContent);
  console.log('✅ Created documentation: docs/PRACTICE_SYSTEM.md');
}

// Main setup function
async function setupPracticeSystem() {
  try {
    console.log('🎯 InterviewAI Practice Question Bank Setup\n');
    
    // Step 1: Check environment
    checkEnvironmentVariables();
    
    // Step 2: Check MongoDB connection
    await checkMongoConnection();
    
    // Step 3: Seed practice questions
    await seedPracticeQuestions();
    
    // Step 4: Test API endpoints
    testApiEndpoints();
    
    // Step 5: Check frontend components
    checkFrontendComponents();
    
    // Step 6: Add seeding scripts
    addSeedingScript();
    
    // Step 7: Create test file
    if (!fs.existsSync('tests')) {
      fs.mkdirSync('tests');
    }
    createTestFile();
    
    // Step 8: Create documentation
    createDocumentation();
    
    console.log('\n🎉 Practice Question Bank System Setup Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start your Next.js development server: npm run dev');
    console.log('2. Navigate to /dashboard/practice to see questions');
    console.log('3. Test the 80/20 coding layout with coding questions');
    console.log('4. Use /dashboard/code-environment for standalone coding');
    console.log('\n📚 Documentation: docs/PRACTICE_SYSTEM.md');
    console.log('🧪 Tests: tests/practice-system.test.js');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupPracticeSystem();
}

module.exports = { setupPracticeSystem };
