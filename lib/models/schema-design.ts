import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ==========================================
// User Collection Schema
// ==========================================
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: 'user' | 'admin';
  registeredAt: Date;
  interviewHistory: mongoose.Types.ObjectId[];
  chatSessions: mongoose.Types.ObjectId[];
  resumePath?: string;
  jobDescriptions?: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  interviewHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  chatSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession'
  }],
  resumePath: {
    type: String
  },
  jobDescriptions: {
    type: [String],
    default: []
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define methods on the schema before creating the model
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ==========================================
// Interview Collection Schema
// ==========================================
export interface IInterviewQuestion {
  question: string;
  generatedAt: Date;
  response?: string;
  score?: number;
}

export interface IInterviewResultSummary {
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface IInterview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  stream: string;
  questions: IInterviewQuestion[];
  startedAt: Date;
  endedAt?: Date;
  resultSummary?: IInterviewResultSummary;
  pdfPath?: string;
  interrupted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interviewQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  }
}, { _id: true });

const interviewResultSummarySchema = new mongoose.Schema({
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  feedback: {
    type: String
  }
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  questions: [interviewQuestionSchema],
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  resultSummary: interviewResultSummarySchema,
  pdfPath: {
    type: String
  },
  interrupted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==========================================
// ChatSession Collection Schema
// ==========================================
export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  messages: IChatMessage[];
  contextTags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  messages: [chatMessageSchema],
  contextTags: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==========================================
// Export Models
// ==========================================

// Check if models already exist to prevent overwriting
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
const InterviewModel = mongoose.models.Interview || mongoose.model<IInterview>('Interview', interviewSchema);
const ChatSessionModel = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', chatSessionSchema);

export { UserModel, InterviewModel, ChatSessionModel };

// ==========================================
// PDF Export Service
// ==========================================

/**
 * Service for exporting interview results to PDF
 */
export class InterviewPDFExportService {
  /**
   * Generate a PDF from interview results
   * @param interview The interview data to include in the PDF
   * @returns The generated PDF as a Blob
   */
  static async generateInterviewPDF(interview: IInterview): Promise<string> {
    // This would be implemented using jsPDF or similar library
    // Similar to the existing PDFExportService
    
    // 1. Create PDF with interview questions, answers, and scores
    // 2. Include the result summary (strengths, weaknesses, feedback)
    // 3. Save to server/public folder or cloud storage
    // 4. Return the path to the saved PDF
    
    // Placeholder implementation
    const pdfPath = `/pdfs/interviews/${interview._id}.pdf`;
    return pdfPath;
  }
}

// ==========================================
// Background Worker Implementation
// ==========================================

/**
 * Example implementation of background worker for processing AI jobs
 * In a real implementation, this would use a queue system like BullMQ
 */
export class BackgroundWorker {
  /**
   * Process resume analysis job
   * @param userId The user ID
   * @param resumePath The path to the resume file
   * @param jobDescription The job description to compare against
   */
  static async processResumeAnalysis(userId: string, resumePath: string, jobDescription: string) {
    // 1. Queue the job
    // 2. Process in background
    // 3. Update user record when complete
    
    // Example implementation with BullMQ would be:
    // const queue = new Queue('resume-analysis');
    // await queue.add('analyze', { userId, resumePath, jobDescription });
  }
  
  /**
   * Process interview scoring job
   * @param interviewId The interview ID
   */
  static async processInterviewScoring(interviewId: string) {
    // 1. Queue the job
    // 2. Process in background
    // 3. Update interview record when complete
    // 4. Generate PDF
    
    // Example implementation with BullMQ would be:
    // const queue = new Queue('interview-scoring');
    // await queue.add('score', { interviewId });
  }
}