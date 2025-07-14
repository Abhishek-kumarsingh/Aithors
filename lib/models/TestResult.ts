import mongoose from 'mongoose';

// Define the interface for TestResult document
export interface ITestResult extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  interviewId?: mongoose.Types.ObjectId;
  questionId?: mongoose.Types.ObjectId;
  
  // Test information
  testType: 'interview' | 'practice' | 'mock-test' | 'assessment';
  testTitle: string;
  testCategory: string; // Frontend, Backend, Data Analysis, etc.
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Performance metrics
  performance: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers: number;
    accuracy: number; // percentage
    score: number; // out of 100
    timeSpent: number; // in seconds
    averageTimePerQuestion: number; // in seconds
  };
  
  // Detailed question-wise results
  questionResults: {
    questionId: string;
    questionType: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    points: number;
    explanation?: string;
    skillTags: string[];
  }[];
  
  // Skill-wise breakdown
  skillAnalysis: {
    [skillName: string]: {
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      averageTime: number;
      improvement: number; // compared to previous attempts
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    };
  };
  
  // Feedback and recommendations
  feedback: {
    overallFeedback: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    recommendations: string[];
    nextSteps: string[];
    studyPlan?: {
      topic: string;
      priority: 'high' | 'medium' | 'low';
      estimatedTime: number; // in hours
      resources: string[];
    }[];
  };
  
  // Comparison with previous attempts
  comparison?: {
    previousScore: number;
    scoreImprovement: number;
    previousAccuracy: number;
    accuracyImprovement: number;
    previousTime: number;
    timeImprovement: number;
    overallProgress: 'improved' | 'declined' | 'stable';
  };
  
  // Test metadata
  metadata: {
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    deviceInfo?: {
      browser: string;
      os: string;
      device: string;
    };
    environment: 'web' | 'mobile' | 'desktop';
    isCompleted: boolean;
    isPaused: boolean;
    pausedAt?: Date;
    resumedAt?: Date;
  };
  
  // Analytics and insights
  insights: {
    strongAreas: string[];
    weakAreas: string[];
    timeManagement: 'excellent' | 'good' | 'average' | 'poor';
    consistencyScore: number; // 0-100
    confidenceLevel: number; // 0-100
    recommendedDifficulty: 'easy' | 'medium' | 'hard';
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  
  // Test information
  testType: {
    type: String,
    enum: ['interview', 'practice', 'mock-test', 'assessment'],
    required: true
  },
  testTitle: {
    type: String,
    required: true,
    trim: true
  },
  testCategory: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  
  // Performance metrics
  performance: {
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // percentage
    score: { type: Number, default: 0 }, // out of 100
    timeSpent: { type: Number, default: 0 }, // in seconds
    averageTimePerQuestion: { type: Number, default: 0 } // in seconds
  },
  
  // Detailed question-wise results
  questionResults: [{
    questionId: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['mcq', 'subjective', 'coding', 'bug-fix'],
      required: true
    },
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    explanation: String,
    skillTags: [String]
  }],
  
  // Skill-wise breakdown
  skillAnalysis: {
    type: Map,
    of: {
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
      improvement: { type: Number, default: 0 },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      }
    }
  },
  
  // Feedback and recommendations
  feedback: {
    overallFeedback: String,
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    recommendations: [String],
    nextSteps: [String],
    studyPlan: [{
      topic: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      },
      estimatedTime: Number, // in hours
      resources: [String]
    }]
  },
  
  // Comparison with previous attempts
  comparison: {
    previousScore: Number,
    scoreImprovement: Number,
    previousAccuracy: Number,
    accuracyImprovement: Number,
    previousTime: Number,
    timeImprovement: Number,
    overallProgress: {
      type: String,
      enum: ['improved', 'declined', 'stable']
    }
  },
  
  // Test metadata
  metadata: {
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: { type: Number, default: 0 }, // in minutes
    deviceInfo: {
      browser: String,
      os: String,
      device: String
    },
    environment: {
      type: String,
      enum: ['web', 'mobile', 'desktop'],
      default: 'web'
    },
    isCompleted: { type: Boolean, default: false },
    isPaused: { type: Boolean, default: false },
    pausedAt: Date,
    resumedAt: Date
  },
  
  // Analytics and insights
  insights: {
    strongAreas: [String],
    weakAreas: [String],
    timeManagement: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'average'
    },
    consistencyScore: { type: Number, default: 0, min: 0, max: 100 },
    confidenceLevel: { type: Number, default: 0, min: 0, max: 100 },
    recommendedDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
testResultSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ testType: 1, testCategory: 1 });
testResultSchema.index({ difficulty: 1 });
testResultSchema.index({ 'performance.score': -1 });
testResultSchema.index({ 'performance.accuracy': -1 });
testResultSchema.index({ 'metadata.isCompleted': 1 });

// Virtual for grade calculation
testResultSchema.virtual('grade').get(function() {
  const score = this.performance?.score || 0;
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
});

// Check if the model already exists to prevent overwriting
const TestResultModel = mongoose.models.TestResult || mongoose.model<ITestResult>('TestResult', testResultSchema);

export default TestResultModel;
export { TestResultModel };
