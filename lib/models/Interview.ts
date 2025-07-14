import mongoose from 'mongoose';

// Define the interface for Interview document
export interface IInterview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'coding' | 'mixed';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  difficulty: 'easy' | 'medium' | 'hard';

  // Interview setup
  setupMethod: 'resume' | 'techstack';
  resumeData?: {
    fileName: string;
    filePath: string;
    extractedSkills: string[];
    extractedExperience: string;
  };
  techStackData?: {
    selectedStack: string[];
    domain: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  };

  // Questions and responses
  questions: {
    id: string;
    type: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
    question: string;
    options?: string[]; // For MCQ
    correctAnswer?: string | number;
    userAnswer?: string;
    isCorrect?: boolean;
    timeSpent: number; // in seconds
    voiceResponse?: {
      audioPath: string;
      transcription: string;
    };
    codeResponse?: {
      language: string;
      code: string;
      output?: string;
      isExecuted: boolean;
    };
  }[];

  // Results and scoring
  results: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers: number;
    accuracy: number; // percentage
    totalTimeSpent: number; // in seconds
    averageTimePerQuestion: number;
    score: number; // out of 100
    skillWiseScore: {
      [skillName: string]: {
        correct: number;
        total: number;
        percentage: number;
      };
    };
  };

  // Feedback and analysis
  feedback: {
    overallFeedback: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    nextSteps: string[];
  };

  // Timing information
  startedAt?: Date;
  completedAt?: Date;
  duration: number; // in minutes

  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'coding', 'mixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },

  // Interview setup
  setupMethod: {
    type: String,
    enum: ['resume', 'techstack'],
    required: true
  },
  resumeData: {
    fileName: String,
    filePath: String,
    extractedSkills: [String],
    extractedExperience: String
  },
  techStackData: {
    selectedStack: [String],
    domain: String,
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  },

  // Questions and responses
  questions: [{
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['mcq', 'subjective', 'coding', 'bug-fix'],
      required: true
    },
    question: { type: String, required: true },
    options: [String], // For MCQ
    correctAnswer: mongoose.Schema.Types.Mixed,
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: { type: Number, default: 0 }, // in seconds
    voiceResponse: {
      audioPath: String,
      transcription: String
    },
    codeResponse: {
      language: String,
      code: String,
      output: String,
      isExecuted: { type: Boolean, default: false }
    }
  }],

  // Results and scoring
  results: {
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // percentage
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    averageTimePerQuestion: { type: Number, default: 0 },
    score: { type: Number, default: 0 }, // out of 100
    skillWiseScore: {
      type: Map,
      of: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      }
    }
  },

  // Feedback and analysis
  feedback: {
    overallFeedback: String,
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    nextSteps: [String]
  },

  // Timing information
  startedAt: Date,
  completedAt: Date,
  duration: { type: Number, default: 0 } // in minutes
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ type: 1, difficulty: 1 });

// Check if the model already exists to prevent overwriting
const InterviewModel = mongoose.models.Interview || mongoose.model<IInterview>('Interview', interviewSchema);

export default InterviewModel;
export { InterviewModel };
