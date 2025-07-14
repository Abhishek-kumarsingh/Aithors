import mongoose from 'mongoose';

// Enhanced Question Bank Item Interface
export interface IEnhancedQuestionBankItem extends mongoose.Document {
  title: string;
  question: string;
  type: 'mcq' | 'subjective' | 'coding' | 'bug-fix' | 'system-design';
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Domain and categorization
  domain: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'data-science' | 'ai-ml' | 'system-design' | 'general';
  subDomain?: string;
  tags: string[];
  skills: string[];
  
  // Question content
  content: {
    description?: string;
    constraints?: string[];
    examples?: {
      input?: string;
      output?: string;
      explanation?: string;
    }[];
    hints?: string[];
  };
  
  // MCQ specific fields
  mcqData?: {
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  
  // Coding specific fields
  codingData?: {
    language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript' | 'go' | 'rust';
    starterCode?: string;
    solution?: string;
    testCases: {
      input: string;
      expectedOutput: string;
      isHidden: boolean;
      explanation?: string;
    }[];
    timeLimit?: number; // in seconds
    memoryLimit?: number; // in MB
  };
  
  // Bug fix specific fields
  bugFixData?: {
    buggyCode: string;
    language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
    bugDescription: string;
    fixedCode: string;
    explanation: string;
    commonMistakes?: string[];
  };
  
  // Question statistics
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number; // in seconds
    averageScore: number;
    difficultyRating: number; // user-rated difficulty 1-10
    qualityRating: number; // user-rated quality 1-10
  };
  
  // Question metadata
  metadata: {
    source: 'user_generated' | 'ai_generated' | 'imported' | 'curated';
    createdBy?: mongoose.Types.ObjectId;
    isVerified: boolean;
    isPublic: boolean;
    companyTags?: string[]; // Companies that ask this question
    estimatedTime: number; // in minutes
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// User Question Attempt Interface
export interface IQuestionAttempt extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  
  // Attempt data
  attempt: {
    answer?: string;
    code?: string;
    selectedOption?: number;
    timeSpent: number; // in seconds
    isCorrect: boolean;
    score: number; // 0-100
    submittedAt: Date;
  };
  
  // Execution results (for coding questions)
  executionResult?: {
    output: string;
    error?: string;
    testCaseResults: {
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
      executionTime: number;
      memoryUsed: number;
    }[];
    totalTestCases: number;
    passedTestCases: number;
  };
  
  // User feedback on question
  questionFeedback?: {
    difficulty: number; // 1-10
    quality: number; // 1-10
    comment?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Question Bank Schema
const enhancedQuestionBankSchema = new mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'subjective', 'coding', 'bug-fix', 'system-design'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  
  domain: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data-science', 'ai-ml', 'system-design', 'general'],
    required: true
  },
  subDomain: String,
  tags: [String],
  skills: [String],
  
  content: {
    description: String,
    constraints: [String],
    examples: [{
      input: String,
      output: String,
      explanation: String
    }],
    hints: [String]
  },
  
  mcqData: {
    options: [String],
    correctAnswer: { type: Number, min: 0 },
    explanation: String
  },
  
  codingData: {
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'rust']
    },
    starterCode: String,
    solution: String,
    testCases: [{
      input: String,
      expectedOutput: String,
      isHidden: { type: Boolean, default: false },
      explanation: String
    }],
    timeLimit: { type: Number, default: 30 },
    memoryLimit: { type: Number, default: 256 }
  },
  
  bugFixData: {
    buggyCode: String,
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript']
    },
    bugDescription: String,
    fixedCode: String,
    explanation: String,
    commonMistakes: [String]
  },
  
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    difficultyRating: { type: Number, default: 5, min: 1, max: 10 },
    qualityRating: { type: Number, default: 5, min: 1, max: 10 }
  },
  
  metadata: {
    source: {
      type: String,
      enum: ['user_generated', 'ai_generated', 'imported', 'curated'],
      default: 'ai_generated'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isVerified: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    companyTags: [String],
    estimatedTime: { type: Number, default: 15 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Question Attempt Schema
const questionAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnhancedQuestionBank',
    required: true
  },
  
  attempt: {
    answer: String,
    code: String,
    selectedOption: Number,
    timeSpent: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  
  executionResult: {
    output: String,
    error: String,
    testCaseResults: [{
      passed: Boolean,
      input: String,
      expectedOutput: String,
      actualOutput: String,
      executionTime: Number,
      memoryUsed: Number
    }],
    totalTestCases: Number,
    passedTestCases: Number
  },
  
  questionFeedback: {
    difficulty: { type: Number, min: 1, max: 10 },
    quality: { type: Number, min: 1, max: 10 },
    comment: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
enhancedQuestionBankSchema.index({ domain: 1, difficulty: 1 });
enhancedQuestionBankSchema.index({ type: 1 });
enhancedQuestionBankSchema.index({ tags: 1 });
enhancedQuestionBankSchema.index({ 'metadata.isPublic': 1, 'metadata.isVerified': 1 });
enhancedQuestionBankSchema.index({ 'stats.qualityRating': -1 });

questionAttemptSchema.index({ userId: 1, createdAt: -1 });
questionAttemptSchema.index({ questionId: 1 });
questionAttemptSchema.index({ 'attempt.isCorrect': 1 });

// Virtual for success rate
enhancedQuestionBankSchema.virtual('successRate').get(function() {
  return this.stats && this.stats.totalAttempts > 0 ?
    (this.stats.correctAttempts / this.stats.totalAttempts) * 100 : 0;
});

const EnhancedQuestionBankModel = mongoose.models.EnhancedQuestionBank || 
  mongoose.model<IEnhancedQuestionBankItem>('EnhancedQuestionBank', enhancedQuestionBankSchema);

const QuestionAttemptModel = mongoose.models.QuestionAttempt || 
  mongoose.model<IQuestionAttempt>('QuestionAttempt', questionAttemptSchema);

export default EnhancedQuestionBankModel;
export { EnhancedQuestionBankModel, QuestionAttemptModel };
