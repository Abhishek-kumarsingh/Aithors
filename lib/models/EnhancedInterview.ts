import mongoose from 'mongoose';

// Enhanced Interview Question Interface
export interface IEnhancedQuestion {
  id: string;
  type: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string;
  subDomain?: string;
  
  // MCQ specific fields
  options?: string[];
  correctAnswer?: number;
  
  // Coding specific fields
  codeSnippet?: string;
  language?: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
  expectedOutput?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
  
  // Bug fix specific fields
  buggyCode?: string;
  fixedCode?: string;
  bugDescription?: string;
  
  // User response
  userAnswer?: string;
  userCode?: string;
  executionResult?: {
    output: string;
    error?: string;
    executionTime: number;
    memoryUsed: number;
  };
  
  // AI feedback
  feedback?: string;
  score?: number;
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    codeQuality?: number;
    efficiency?: number;
    correctness?: number;
  };
  
  timeSpent?: number; // in seconds
  attempts?: number;
  isCorrect?: boolean;
  createdAt: Date;
  answeredAt?: Date;
}

// Enhanced Interview Interface
export interface IEnhancedInterview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  
  // Interview configuration
  type: 'technical' | 'behavioral' | 'system_design' | 'coding' | 'mixed' | 'resume_based';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  domain: string;
  subDomain?: string;
  
  // Question configuration
  questionConfig: {
    totalQuestions: number;
    questionTypes: {
      mcq: number;
      subjective: number;
      coding: number;
      bugFix: number;
    };
    timeLimit: number; // in minutes
    voiceEnabled: boolean;
  };
  
  // Resume-based configuration
  resumeAnalysis?: {
    skills: string[];
    experience: string;
    projects: string[];
    technologies: string[];
    aiSummary: string;
  };
  
  // Questions and responses
  questions: IEnhancedQuestion[];
  
  // Interview session data
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
  startTime?: Date;
  endTime?: Date;
  pausedTime?: number; // total paused time in seconds
  actualDuration?: number; // in minutes
  
  // Performance metrics
  performance: {
    overallScore: number;
    categoryScores: {
      mcq: number;
      subjective: number;
      coding: number;
      bugFix: number;
    };
    timeEfficiency: number; // percentage of time used effectively
    accuracyRate: number;
    completionRate: number;
  };
  
  // AI-powered feedback
  feedback: {
    overall: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    skillAssessment: {
      [skillName: string]: {
        score: number;
        feedback: string;
        improvement: string;
      };
    };
    nextSteps: string[];
    estimatedLevel: 'junior' | 'mid' | 'senior' | 'expert';
  };
  
  // API usage tracking
  apiUsage: {
    questionGeneration: {
      provider: 'gemini' | 'deepseek' | 'claude' | 'openai';
      tokensUsed: number;
      cost: number;
    };
    feedbackGeneration: {
      provider: 'gemini' | 'deepseek' | 'claude' | 'openai';
      tokensUsed: number;
      cost: number;
    };
    voiceGeneration?: {
      provider: string;
      charactersUsed: number;
      cost: number;
    };
  };
  
  // Metadata
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    deviceInfo?: {
      browser: string;
      os: string;
      device: string;
    };
    interviewMode: 'practice' | 'assessment' | 'mock';
    tags: string[];
  };
  
  // Question bank integration
  savedToQuestionBank: boolean;
  questionBankCategory?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Question Schema
const enhancedQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'subjective', 'coding', 'bug-fix'],
    required: true
  },
  question: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  domain: { type: String, required: true },
  subDomain: String,
  
  // MCQ fields
  options: [String],
  correctAnswer: Number,
  
  // Coding fields
  codeSnippet: String,
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'typescript']
  },
  expectedOutput: String,
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  
  // Bug fix fields
  buggyCode: String,
  fixedCode: String,
  bugDescription: String,
  
  // User response
  userAnswer: String,
  userCode: String,
  executionResult: {
    output: String,
    error: String,
    executionTime: Number,
    memoryUsed: Number
  },
  
  // AI feedback
  feedback: String,
  score: { type: Number, min: 0, max: 100 },
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    codeQuality: { type: Number, min: 0, max: 10 },
    efficiency: { type: Number, min: 0, max: 10 },
    correctness: { type: Number, min: 0, max: 10 }
  },
  
  timeSpent: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  isCorrect: Boolean,
  createdAt: { type: Date, default: Date.now },
  answeredAt: Date
}, { _id: false });

// Enhanced Interview Schema
const enhancedInterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: String,
  
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'system_design', 'coding', 'mixed', 'resume_based'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    required: true
  },
  domain: { type: String, required: true },
  subDomain: String,
  
  questionConfig: {
    totalQuestions: { type: Number, required: true, min: 1, max: 50 },
    questionTypes: {
      mcq: { type: Number, default: 0 },
      subjective: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      bugFix: { type: Number, default: 0 }
    },
    timeLimit: { type: Number, required: true, min: 5, max: 180 },
    voiceEnabled: { type: Boolean, default: false }
  },
  
  resumeAnalysis: {
    skills: [String],
    experience: String,
    projects: [String],
    technologies: [String],
    aiSummary: String
  },
  
  questions: [enhancedQuestionSchema],
  
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'paused'],
    default: 'scheduled'
  },
  startTime: Date,
  endTime: Date,
  pausedTime: { type: Number, default: 0 },
  actualDuration: Number,
  
  performance: {
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    categoryScores: {
      mcq: { type: Number, default: 0, min: 0, max: 100 },
      subjective: { type: Number, default: 0, min: 0, max: 100 },
      coding: { type: Number, default: 0, min: 0, max: 100 },
      bugFix: { type: Number, default: 0, min: 0, max: 100 }
    },
    timeEfficiency: { type: Number, default: 0, min: 0, max: 100 },
    accuracyRate: { type: Number, default: 0, min: 0, max: 100 },
    completionRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  
  feedback: {
    overall: String,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    skillAssessment: {
      type: Map,
      of: {
        score: { type: Number, min: 0, max: 100 },
        feedback: String,
        improvement: String
      }
    },
    nextSteps: [String],
    estimatedLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'expert']
    }
  },
  
  apiUsage: {
    questionGeneration: {
      provider: {
        type: String,
        enum: ['gemini', 'deepseek', 'claude', 'openai']
      },
      tokensUsed: { type: Number, default: 0 },
      cost: { type: Number, default: 0 }
    },
    feedbackGeneration: {
      provider: {
        type: String,
        enum: ['gemini', 'deepseek', 'claude', 'openai']
      },
      tokensUsed: { type: Number, default: 0 },
      cost: { type: Number, default: 0 }
    },
    voiceGeneration: {
      provider: String,
      charactersUsed: { type: Number, default: 0 },
      cost: { type: Number, default: 0 }
    }
  },
  
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String
    },
    interviewMode: {
      type: String,
      enum: ['practice', 'assessment', 'mock'],
      default: 'practice'
    },
    tags: [String]
  },
  
  savedToQuestionBank: { type: Boolean, default: false },
  questionBankCategory: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
enhancedInterviewSchema.index({ userId: 1, createdAt: -1 });
enhancedInterviewSchema.index({ status: 1 });
enhancedInterviewSchema.index({ domain: 1, difficulty: 1 });
enhancedInterviewSchema.index({ 'performance.overallScore': -1 });

const EnhancedInterviewModel = mongoose.models.EnhancedInterview || 
  mongoose.model<IEnhancedInterview>('EnhancedInterview', enhancedInterviewSchema);

export default EnhancedInterviewModel;
export { EnhancedInterviewModel };
