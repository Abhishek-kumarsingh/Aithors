import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for User document
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  lastLogin?: Date;
  isOnline?: boolean;
  lastActivity?: Date;
  isBlocked?: boolean;
  blockedAt?: Date;
  blockedBy?: mongoose.Types.ObjectId;
  blockedReason?: string;
  loginCount?: number;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
    ip?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };

  // Enhanced user profile for modern dashboard
  profile?: {
    techStack?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredDomains?: string[];
    targetRoles?: string[];
    skills?: {
      name: string;
      level: number; // 1-10
      category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'data' | 'ai' | 'other';
    }[];
    goals?: {
      weeklyInterviews?: number;
      targetScore?: number;
      focusAreas?: string[];
    };
    resumePath?: string;
  };

  // Performance tracking
  performance?: {
    totalInterviews?: number;
    completedInterviews?: number;
    averageScore?: number;
    bestScore?: number;
    currentStreak?: number;
    longestStreak?: number;
    weeklyProgress?: number;
    monthlyProgress?: number;
    skillProgress?: {
      [skillName: string]: {
        score: number;
        improvement: number;
        lastUpdated: Date;
      };
    };
  };

  // Interview preferences
  interviewPreferences?: {
    voiceEnabled?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    interviewDuration?: number; // in minutes
    questionTypes?: {
      mcq?: boolean;
      subjective?: boolean;
      coding?: boolean;
      bugFix?: boolean;
    };
  };

  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the schema first
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
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false // Don't include in query results by default
  },
  twoFactorBackupCodes: {
    type: [String],
    select: false // Don't include in query results by default
  },
  lastLogin: {
    type: Date
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: {
    type: Date
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blockedReason: {
    type: String
  },
  loginCount: {
    type: Number,
    default: 0
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    ip: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },

  // Enhanced user profile for modern dashboard
  profile: {
    techStack: [String],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    preferredDomains: [String],
    targetRoles: [String],
    skills: [{
      name: { type: String, required: true },
      level: { type: Number, min: 1, max: 10, default: 1 },
      category: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data', 'ai', 'other'],
        default: 'other'
      }
    }],
    goals: {
      weeklyInterviews: { type: Number, default: 3 },
      targetScore: { type: Number, default: 80 },
      focusAreas: [String]
    },
    resumePath: String
  },

  // Performance tracking
  performance: {
    totalInterviews: { type: Number, default: 0 },
    completedInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    weeklyProgress: { type: Number, default: 0 },
    monthlyProgress: { type: Number, default: 0 },
    skillProgress: {
      type: Map,
      of: {
        score: { type: Number, default: 0 },
        improvement: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
      }
    }
  },

  // Interview preferences
  interviewPreferences: {
    voiceEnabled: { type: Boolean, default: false },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'easy'
    },
    interviewDuration: { type: Number, default: 30 }, // in minutes
    questionTypes: {
      mcq: { type: Boolean, default: true },
      subjective: { type: Boolean, default: true },
      coding: { type: Boolean, default: false },
      bugFix: { type: Boolean, default: false }
    }
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

// Check if the model already exists to prevent overwriting
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;
export { UserModel };
