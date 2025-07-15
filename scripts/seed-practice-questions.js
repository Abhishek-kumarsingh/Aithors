const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewai';

// Gemini API setup with load balancing
const geminiApiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5
].filter(Boolean);

let currentKeyIndex = 0;

function getNextApiKey() {
  const key = geminiApiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % geminiApiKeys.length;
  return key;
}

// Practice Question Schema
const practiceQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'subjective', 'coding', 'system-design'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  domain: { type: String, required: true },
  subDomain: { type: String },
  tags: [{ type: String, trim: true }],
  content: {
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: mongoose.Schema.Types.Mixed,
    sampleInput: String,
    sampleOutput: String,
    constraints: String,
    hints: [String],
    explanation: String
  },
  timeLimit: { type: Number, default: 30 },
  points: { type: Number, default: 10 },
  companies: [{ type: String, trim: true }],
  frequency: { type: Number, default: 0 },
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  solution: {
    approach: String,
    code: String,
    explanation: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// User Schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const PracticeQuestion = mongoose.models.PracticeQuestion || mongoose.model('PracticeQuestion', practiceQuestionSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Question generation configurations
const questionConfigs = [
  // Frontend Questions
  { domain: 'frontend', subDomain: 'react', type: 'mcq', difficulty: 'easy', count: 10 },
  { domain: 'frontend', subDomain: 'react', type: 'mcq', difficulty: 'medium', count: 10 },
  { domain: 'frontend', subDomain: 'react', type: 'coding', difficulty: 'easy', count: 5 },
  { domain: 'frontend', subDomain: 'react', type: 'coding', difficulty: 'medium', count: 5 },
  { domain: 'frontend', subDomain: 'javascript', type: 'mcq', difficulty: 'easy', count: 15 },
  { domain: 'frontend', subDomain: 'javascript', type: 'coding', difficulty: 'easy', count: 10 },
  { domain: 'frontend', subDomain: 'javascript', type: 'coding', difficulty: 'medium', count: 8 },
  
  // Backend Questions
  { domain: 'backend', subDomain: 'nodejs', type: 'mcq', difficulty: 'easy', count: 10 },
  { domain: 'backend', subDomain: 'nodejs', type: 'coding', difficulty: 'easy', count: 8 },
  { domain: 'backend', subDomain: 'nodejs', type: 'coding', difficulty: 'medium', count: 6 },
  { domain: 'backend', subDomain: 'python', type: 'mcq', difficulty: 'easy', count: 12 },
  { domain: 'backend', subDomain: 'python', type: 'coding', difficulty: 'easy', count: 10 },
  { domain: 'backend', subDomain: 'databases', type: 'mcq', difficulty: 'medium', count: 8 },
  
  // Full Stack Questions
  { domain: 'fullstack', subDomain: 'mern', type: 'subjective', difficulty: 'medium', count: 5 },
  { domain: 'fullstack', subDomain: 'system-design', type: 'system-design', difficulty: 'medium', count: 3 },
  { domain: 'fullstack', subDomain: 'system-design', type: 'system-design', difficulty: 'hard', count: 2 },
  
  // Data Structures & Algorithms
  { domain: 'algorithms', subDomain: 'arrays', type: 'coding', difficulty: 'easy', count: 15 },
  { domain: 'algorithms', subDomain: 'arrays', type: 'coding', difficulty: 'medium', count: 10 },
  { domain: 'algorithms', subDomain: 'strings', type: 'coding', difficulty: 'easy', count: 12 },
  { domain: 'algorithms', subDomain: 'trees', type: 'coding', difficulty: 'medium', count: 8 },
  { domain: 'algorithms', subDomain: 'graphs', type: 'coding', difficulty: 'hard', count: 5 }
];

async function generateQuestionsWithAI(config) {
  try {
    const apiKey = getNextApiKey();
    if (!apiKey) {
      console.log('No Gemini API key available, using fallback questions');
      return generateFallbackQuestions(config);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = createQuestionGenerationPrompt(config);
    console.log(`Generating ${config.count} ${config.type} questions for ${config.domain}/${config.subDomain}...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleanedText);

    return Array.isArray(questions) ? questions : [questions];
  } catch (error) {
    console.error(`Error generating questions for ${config.domain}/${config.subDomain}:`, error.message);
    return generateFallbackQuestions(config);
  }
}

function createQuestionGenerationPrompt(config) {
  const typeInstructions = {
    mcq: 'multiple-choice questions with 4 options and one correct answer',
    coding: 'coding problems with clear problem statements, examples, and constraints',
    subjective: 'open-ended questions that require detailed explanations',
    'system-design': 'system design questions focusing on architecture and scalability'
  };

  return `Generate exactly ${config.count} ${config.difficulty} level ${typeInstructions[config.type]} for ${config.domain} - ${config.subDomain}.

Requirements:
- Each question should be relevant to ${config.domain} and specifically ${config.subDomain}
- Difficulty level: ${config.difficulty}
- Question type: ${config.type}
- Make questions practical and interview-relevant

Format your response as a JSON array:
[
  {
    "title": "Question title",
    "content": {
      "question": "Detailed question text",
      ${config.type === 'mcq' ? '"options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "correctAnswer": 0,' : ''}
      ${config.type === 'coding' ? '"sampleInput": "Example input", "sampleOutput": "Expected output", "constraints": "Problem constraints", "hints": ["Hint 1", "Hint 2"],' : ''}
      "explanation": "Detailed explanation"
    },
    "tags": ["${config.subDomain}", "${config.difficulty}"],
    "companies": ["Google", "Microsoft", "Amazon"]
  }
]

Ensure the response is valid JSON.`;
}

function generateFallbackQuestions(config) {
  const fallbackQuestions = [];
  
  for (let i = 0; i < config.count; i++) {
    const question = {
      title: `${config.domain} ${config.subDomain} ${config.type} Question ${i + 1}`,
      content: {
        question: `This is a ${config.difficulty} level ${config.type} question for ${config.domain} - ${config.subDomain}.`,
        ...(config.type === 'mcq' && {
          options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
          correctAnswer: 0
        }),
        ...(config.type === 'coding' && {
          sampleInput: 'Sample input',
          sampleOutput: 'Expected output',
          constraints: 'Problem constraints',
          hints: ['Think about the problem step by step']
        }),
        explanation: 'This is a fallback question.'
      },
      tags: [config.subDomain, config.difficulty],
      companies: ['Google', 'Microsoft', 'Amazon']
    };
    
    fallbackQuestions.push(question);
  }
  
  return fallbackQuestions;
}

function getTimeLimit(difficulty, type) {
  const baseTime = {
    mcq: { easy: 5, medium: 10, hard: 15 },
    coding: { easy: 30, medium: 45, hard: 60 },
    subjective: { easy: 15, medium: 25, hard: 35 },
    'system-design': { easy: 30, medium: 45, hard: 60 }
  };
  
  return baseTime[type]?.[difficulty] || 30;
}

function getPoints(difficulty) {
  const points = { easy: 10, medium: 20, hard: 30 };
  return points[difficulty] || 20;
}

async function seedPracticeQuestions() {
  try {
    console.log('🚀 Starting practice questions seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'alpsingh03@gmail.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'alpsingh03@gmail.com',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Created admin user');
    }

    // Clear existing practice questions
    await PracticeQuestion.deleteMany({});
    console.log('🗑️ Cleared existing practice questions');

    let totalGenerated = 0;
    let totalSaved = 0;

    // Generate questions for each configuration
    for (const config of questionConfigs) {
      try {
        const generatedQuestions = await generateQuestionsWithAI(config);
        totalGenerated += generatedQuestions.length;

        // Save questions to database
        for (const questionData of generatedQuestions) {
          try {
            const practiceQuestion = new PracticeQuestion({
              title: questionData.title,
              description: questionData.title,
              difficulty: config.difficulty,
              domain: config.domain,
              subDomain: config.subDomain,
              category: config.subDomain,
              tags: questionData.tags || [config.subDomain, config.difficulty],
              type: config.type,
              timeLimit: getTimeLimit(config.difficulty, config.type),
              points: getPoints(config.difficulty),
              content: questionData.content,
              companies: questionData.companies || ['Google', 'Microsoft', 'Amazon'],
              createdBy: adminUser._id,
              isActive: true,
              stats: {
                totalAttempts: 0,
                correctAttempts: 0,
                averageScore: 0,
                averageTime: 0
              }
            });

            await practiceQuestion.save();
            totalSaved++;
          } catch (error) {
            console.error(`Error saving question: ${error.message}`);
          }
        }

        console.log(`✅ Generated ${generatedQuestions.length} questions for ${config.domain}/${config.subDomain} (${config.type})`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing config ${config.domain}/${config.subDomain}:`, error.message);
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`📊 Total questions generated: ${totalGenerated}`);
    console.log(`💾 Total questions saved: ${totalSaved}`);
    
    // Display summary by domain
    const summary = await PracticeQuestion.aggregate([
      { $group: { _id: { domain: '$domain', type: '$type', difficulty: '$difficulty' }, count: { $sum: 1 } } },
      { $sort: { '_id.domain': 1, '_id.type': 1, '_id.difficulty': 1 } }
    ]);
    
    console.log('\n📈 Questions by category:');
    summary.forEach(item => {
      console.log(`   ${item._id.domain}/${item._id.type}/${item._id.difficulty}: ${item.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error seeding practice questions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding script
if (require.main === module) {
  seedPracticeQuestions();
}

module.exports = { seedPracticeQuestions };
