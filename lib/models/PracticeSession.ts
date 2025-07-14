import mongoose from 'mongoose';

// Practice Session Interface
export interface IPracticeSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  sessionType: 'practice' | 'mock_interview' | 'timed_test' | 'custom';
  title: string;
  description?: string;
  
  // Session configuration
  config: {
    domain: string;
    subDomain?: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questionTypes: string[];
    totalQuestions: number;
    timeLimit: number; // in minutes
    isTimerEnabled: boolean;
    shuffleQuestions: boolean;
  };
  
  // Questions and answers
  questions: Array<{
    questionId: mongoose.Types.ObjectId;
    question: any; // Full question object
    userAnswer?: any;
    isCorrect?: boolean;
    timeSpent: number; // in seconds
    score: number;
    feedback?: string;
    hints?: string[];
    hintsUsed: number;
    attempts: number;
    startedAt: Date;
    submittedAt?: Date;
  }>;
  
  // Session progress
  progress: {
    currentQuestionIndex: number;
    questionsCompleted: number;
    questionsCorrect: number;
    totalTimeSpent: number; // in seconds
    isCompleted: boolean;
    isPaused: boolean;
    pausedAt?: Date;
    resumedAt?: Date;
    pauseDuration: number; // total pause time in seconds
  };
  
  // Results and scoring
  results: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: string;
    rank?: number;
    timeEfficiency: number; // percentage of time used efficiently
    accuracyRate: number;
    strengthAreas: string[];
    weaknessAreas: string[];
  };
  
  // AI-powered feedback
  feedback: {
    overall: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    nextSteps: string[];
    skillAssessment: {
      [skillName: string]: {
        score: number;
        feedback: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      };
    };
  };
  
  // Session metadata
  metadata: {
    startedAt: Date;
    completedAt?: Date;
    lastActivity: Date;
    sessionDuration: number; // actual time spent (excluding pauses)
    deviceInfo?: string;
    browserInfo?: string;
    ipAddress?: string;
  };
  
  // Status and flags
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'abandoned';
  isCompleted: boolean;
  isPublic: boolean;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// Practice Session Schema
const practiceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['practice', 'mock_interview', 'timed_test', 'custom'],
    default: 'practice'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  config: {
    domain: {
      type: String,
      required: true
    },
    subDomain: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'medium'
    },
    questionTypes: [{
      type: String,
      enum: ['mcq', 'subjective', 'coding', 'system-design']
    }],
    totalQuestions: {
      type: Number,
      default: 10,
      min: 1,
      max: 100
    },
    timeLimit: {
      type: Number,
      default: 60 // 60 minutes
    },
    isTimerEnabled: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: true
    }
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeQuestion',
      required: true
    },
    question: mongoose.Schema.Types.Mixed,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    feedback: String,
    hints: [String],
    hintsUsed: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: Date
  }],
  progress: {
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    questionsCompleted: {
      type: Number,
      default: 0
    },
    questionsCorrect: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    pausedAt: Date,
    resumedAt: Date,
    pauseDuration: {
      type: Number,
      default: 0
    }
  },
  results: {
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    grade: {
      type: String,
      default: 'F'
    },
    rank: Number,
    timeEfficiency: {
      type: Number,
      default: 0
    },
    accuracyRate: {
      type: Number,
      default: 0
    },
    strengthAreas: [String],
    weaknessAreas: [String]
  },
  feedback: {
    overall: String,
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    nextSteps: [String],
    skillAssessment: {
      type: Map,
      of: {
        score: Number,
        feedback: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
      }
    }
  },
  metadata: {
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    lastActivity: {
      type: Date,
      default: Date.now
    },
    sessionDuration: {
      type: Number,
      default: 0
    },
    deviceInfo: String,
    browserInfo: String,
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'paused', 'completed', 'abandoned'],
    default: 'not_started'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
practiceSessionSchema.index({ userId: 1, status: 1 });
practiceSessionSchema.index({ 'config.domain': 1, 'config.difficulty': 1 });
practiceSessionSchema.index({ sessionType: 1, isCompleted: 1 });
practiceSessionSchema.index({ createdAt: -1 });

// Virtual properties
practiceSessionSchema.virtual('duration').get(function() {
  if (this.metadata?.completedAt && this.metadata?.startedAt) {
    return this.metadata.completedAt.getTime() - this.metadata.startedAt.getTime();
  }
  return 0;
});

practiceSessionSchema.virtual('averageTimePerQuestion').get(function() {
  return this.questions.length > 0 && this.progress?.totalTimeSpent
    ? this.progress.totalTimeSpent / this.questions.length
    : 0;
});

// Methods
practiceSessionSchema.methods.calculateResults = function() {
  const totalQuestions = this.questions.length;
  const correctAnswers = this.questions.filter((q: any) => q.isCorrect).length;
  const totalScore = this.questions.reduce((sum: number, q: any) => sum + q.score, 0);
  const maxScore = this.questions.reduce((sum: number, q: any) => sum + (q.question?.points || 10), 0);
  
  this.results.totalScore = totalScore;
  this.results.maxScore = maxScore;
  this.results.percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  this.results.accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Calculate grade
  const percentage = this.results.percentage;
  if (percentage >= 90) this.results.grade = 'A+';
  else if (percentage >= 80) this.results.grade = 'A';
  else if (percentage >= 70) this.results.grade = 'B';
  else if (percentage >= 60) this.results.grade = 'C';
  else if (percentage >= 50) this.results.grade = 'D';
  else this.results.grade = 'F';
  
  // Calculate time efficiency
  const totalTimeAllowed = this.config.timeLimit * 60; // convert to seconds
  this.results.timeEfficiency = totalTimeAllowed > 0 
    ? Math.max(0, 100 - (this.progress.totalTimeSpent / totalTimeAllowed) * 100)
    : 0;
};

practiceSessionSchema.methods.completeSession = function() {
  this.status = 'completed';
  this.isCompleted = true;
  this.progress.isCompleted = true;
  this.metadata.completedAt = new Date();
  this.metadata.sessionDuration = this.progress.totalTimeSpent;
  this.calculateResults();
};

// Static methods
practiceSessionSchema.statics.findByUser = function(userId: string, status?: string) {
  const query: any = { userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

practiceSessionSchema.statics.getSessionStats = function(userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        completedSessions: {
          $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] }
        },
        averageScore: { $avg: '$results.percentage' },
        totalTimeSpent: { $sum: '$progress.totalTimeSpent' }
      }
    }
  ]);
};

const PracticeSessionModel = mongoose.models.PracticeSession || 
  mongoose.model<IPracticeSession>('PracticeSession', practiceSessionSchema);

export default PracticeSessionModel;
