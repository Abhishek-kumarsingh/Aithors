import mongoose from 'mongoose';

// Practice Question Interface
export interface IPracticeQuestion extends mongoose.Document {
  title: string;
  description: string;
  type: 'mcq' | 'subjective' | 'coding' | 'system-design';
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string;
  subDomain?: string;
  tags: string[];
  
  // Question content
  content: {
    question: string;
    options?: string[]; // For MCQ
    correctAnswer?: string | number; // For MCQ
    sampleInput?: string; // For coding
    sampleOutput?: string; // For coding
    constraints?: string; // For coding
    hints?: string[];
  };
  
  // Metadata
  timeLimit: number; // in minutes
  points: number;
  companies: string[];
  frequency: number; // how often this question appears
  
  // Statistics
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number; // in seconds
    averageScore: number;
    lastAttempted?: Date;
  };
  
  // Solution and explanation
  solution?: {
    approach: string;
    code?: string;
    explanation: string;
    timeComplexity?: string;
    spaceComplexity?: string;
  };
  
  // Status and metadata
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Virtual properties
  successRate: number;

  // Methods
  updateStats(isCorrect: boolean, timeSpent: number, score: number): void;
}

// Model interface with static methods
export interface IPracticeQuestionModel extends mongoose.Model<IPracticeQuestion> {
  findByDomain(domain: string, difficulty?: string): Promise<IPracticeQuestion[]>;
  findByType(type: string): Promise<IPracticeQuestion[]>;
  getRandomQuestions(count: number, filters?: any): Promise<IPracticeQuestion[]>;
}

// Practice Question Schema
const practiceQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'subjective', 'coding', 'system-design'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  subDomain: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  content: {
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String
    }],
    correctAnswer: mongoose.Schema.Types.Mixed,
    sampleInput: String,
    sampleOutput: String,
    constraints: String,
    hints: [String]
  },
  timeLimit: {
    type: Number,
    default: 30 // 30 minutes default
  },
  points: {
    type: Number,
    default: 10
  },
  companies: [{
    type: String,
    trim: true
  }],
  frequency: {
    type: Number,
    default: 0
  },
  stats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    correctAttempts: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    lastAttempted: Date
  },
  solution: {
    approach: String,
    code: String,
    explanation: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
practiceQuestionSchema.index({ domain: 1, difficulty: 1 });
practiceQuestionSchema.index({ type: 1, isActive: 1 });
practiceQuestionSchema.index({ tags: 1 });
practiceQuestionSchema.index({ companies: 1 });

// Virtual for success rate
practiceQuestionSchema.virtual('successRate').get(function() {
  return this.stats && this.stats.totalAttempts > 0
    ? (this.stats.correctAttempts / this.stats.totalAttempts) * 100
    : 0;
});

// Methods
practiceQuestionSchema.methods.updateStats = function(isCorrect: boolean, timeSpent: number, score: number) {
  this.stats.totalAttempts += 1;
  if (isCorrect) {
    this.stats.correctAttempts += 1;
  }
  
  // Update average time
  const totalTime = this.stats.averageTime * (this.stats.totalAttempts - 1) + timeSpent;
  this.stats.averageTime = totalTime / this.stats.totalAttempts;
  
  // Update average score
  const totalScore = this.stats.averageScore * (this.stats.totalAttempts - 1) + score;
  this.stats.averageScore = totalScore / this.stats.totalAttempts;
  
  this.stats.lastAttempted = new Date();
  this.frequency += 1;
};

// Static methods
practiceQuestionSchema.statics.findByDomain = function(domain: string, difficulty?: string) {
  const query: any = { domain, isActive: true };
  if (difficulty) {
    query.difficulty = difficulty;
  }
  return this.find(query);
};

practiceQuestionSchema.statics.findByType = function(type: string) {
  return this.find({ type, isActive: true });
};

practiceQuestionSchema.statics.getRandomQuestions = function(count: number, filters: any = {}) {
  const query = { isActive: true, ...filters };
  return this.aggregate([
    { $match: query },
    { $sample: { size: count } }
  ]);
};

const PracticeQuestionModel = (mongoose.models.PracticeQuestion ||
  mongoose.model<IPracticeQuestion>('PracticeQuestion', practiceQuestionSchema)) as IPracticeQuestionModel;

export default PracticeQuestionModel;
