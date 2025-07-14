import mongoose from 'mongoose';

// Define the interface for Question document
export interface IQuestion extends mongoose.Document {
  title: string;
  description: string;
  type: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string; // Frontend, Backend, Data Analysis, etc.
  category: string; // JavaScript, React, Node.js, Python, etc.
  tags: string[];

  // Question content
  content: {
    question: string;
    options?: string[]; // For MCQ
    correctAnswer?: string | number;
    explanation?: string;
    hints?: string[];
  };

  // For coding questions
  codingDetails?: {
    language: string[];
    starterCode?: string;
    testCases: {
      input: string;
      expectedOutput: string;
      isHidden: boolean;
    }[];
    constraints?: string[];
    timeLimit?: number; // in seconds
    memoryLimit?: number; // in MB
  };

  // For bug fix questions
  bugFixDetails?: {
    language: string;
    buggyCode: string;
    expectedBehavior: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  };

  // Metadata
  author: mongoose.Types.ObjectId;
  isPublic: boolean;
  isVerified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;

  // Statistics
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number; // in seconds
    successRate: number; // percentage
    rating: number; // 1-5 stars
    ratingCount: number;
  };

  // Community features
  likes: number;
  dislikes: number;
  reports: number;

  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['mcq', 'subjective', 'coding', 'bug-fix'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Question content
  content: {
    question: { type: String, required: true },
    options: [String], // For MCQ
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    hints: [String]
  },

  // For coding questions
  codingDetails: {
    language: [String],
    starterCode: String,
    testCases: [{
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      isHidden: { type: Boolean, default: false }
    }],
    constraints: [String],
    timeLimit: { type: Number, default: 30 }, // in seconds
    memoryLimit: { type: Number, default: 128 } // in MB
  },

  // For bug fix questions
  bugFixDetails: {
    language: String,
    buggyCode: String,
    expectedBehavior: String,
    testCases: [{
      input: String,
      expectedOutput: String
    }]
  },

  // Metadata
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Statistics
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 }, // in seconds
    successRate: { type: Number, default: 0 }, // percentage
    rating: { type: Number, default: 0, min: 0, max: 5 }, // 1-5 stars
    ratingCount: { type: Number, default: 0 }
  },

  // Community features
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
questionSchema.index({ domain: 1, category: 1 });
questionSchema.index({ type: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ isPublic: 1, isVerified: 1 });
questionSchema.index({ 'stats.successRate': -1 });
questionSchema.index({ 'stats.rating': -1 });
questionSchema.index({ createdAt: -1 });

// Add text index for search functionality
questionSchema.index({
  title: 'text',
  description: 'text',
  'content.question': 'text',
  tags: 'text'
});

// Virtual for success rate calculation
questionSchema.virtual('calculatedSuccessRate').get(function() {
  if (!this.stats || this.stats.totalAttempts === 0) return 0;
  return Math.round((this.stats.correctAttempts / this.stats.totalAttempts) * 100);
});

// Check if the model already exists to prevent overwriting
const QuestionModel = mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema);

export default QuestionModel;
export { QuestionModel };
