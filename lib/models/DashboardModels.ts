import mongoose from 'mongoose';

// ==========================================
// System Metrics Collection Schema
// ==========================================
export interface ISystemMetrics extends mongoose.Document {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  storage: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  services: {
    database: 'healthy' | 'warning' | 'critical';
    api: 'healthy' | 'warning' | 'critical';
    websocket: 'healthy' | 'warning' | 'critical';
    redis?: 'healthy' | 'warning' | 'critical';
  };
  uptime: number;
  createdAt: Date;
}

const systemMetricsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  cpu: {
    usage: { type: Number, required: true, min: 0, max: 100 },
    cores: { type: Number, required: true },
    temperature: { type: Number, min: 0, max: 100 }
  },
  memory: {
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true },
    usage: { type: Number, required: true, min: 0, max: 100 }
  },
  storage: {
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true },
    usage: { type: Number, required: true, min: 0, max: 100 }
  },
  network: {
    bytesIn: { type: Number, default: 0 },
    bytesOut: { type: Number, default: 0 },
    packetsIn: { type: Number, default: 0 },
    packetsOut: { type: Number, default: 0 }
  },
  services: {
    database: { 
      type: String, 
      enum: ['healthy', 'warning', 'critical'], 
      default: 'healthy' 
    },
    api: { 
      type: String, 
      enum: ['healthy', 'warning', 'critical'], 
      default: 'healthy' 
    },
    websocket: { 
      type: String, 
      enum: ['healthy', 'warning', 'critical'], 
      default: 'healthy' 
    },
    redis: { 
      type: String, 
      enum: ['healthy', 'warning', 'critical'] 
    }
  },
  uptime: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days TTL
  }
});

// ==========================================
// User Activity Logs Schema
// ==========================================
export interface IUserActivity extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  description: string;
  category: 'authentication' | 'interview' | 'dashboard' | 'admin' | 'system';
  severity: 'info' | 'warning' | 'error' | 'success';
  metadata?: {
    ip?: string;
    userAgent?: string;
    duration?: number;
    score?: number;
    interviewId?: string;
    questionCount?: number;
    [key: string]: any;
  };
  timestamp: Date;
  createdAt: Date;
}

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['authentication', 'interview', 'dashboard', 'admin', 'system'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info',
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7776000 // 90 days TTL
  }
});

// ==========================================
// Dashboard Analytics Schema
// ==========================================
export interface IDashboardAnalytics extends mongoose.Document {
  date: Date;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
    averageDuration: number;
    topSkills: Array<{
      skill: string;
      count: number;
      averageScore: number;
    }>;
    userEngagement: {
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      monthlyActiveUsers: number;
      averageSessionDuration: number;
    };
    systemPerformance: {
      averageResponseTime: number;
      errorRate: number;
      uptime: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const dashboardAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  metrics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    completedInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageDuration: { type: Number, default: 0 },
    topSkills: [{
      skill: String,
      count: Number,
      averageScore: Number
    }],
    userEngagement: {
      dailyActiveUsers: { type: Number, default: 0 },
      weeklyActiveUsers: { type: Number, default: 0 },
      monthlyActiveUsers: { type: Number, default: 0 },
      averageSessionDuration: { type: Number, default: 0 }
    },
    systemPerformance: {
      averageResponseTime: { type: Number, default: 0 },
      errorRate: { type: Number, default: 0 },
      uptime: { type: Number, default: 100 }
    }
  }
}, {
  timestamps: true
});

// ==========================================
// Interview Session Schema
// ==========================================
export interface IInterview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'technical' | 'behavioral' | 'system_design' | 'coding' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  questions: Array<{
    id: string;
    question: string;
    answer?: string;
    score?: number;
    feedback?: string;
    timeSpent?: number;
  }>;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  overallScore?: number;
  feedback?: string;
  skills: string[];
  metadata?: {
    aiModel?: string;
    difficulty?: string;
    interviewerNotes?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'system_design', 'coding', 'general'],
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  questions: [{
    id: String,
    question: String,
    answer: String,
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    timeSpent: Number // in seconds
  }],
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  overallScore: { type: Number, min: 0, max: 100 },
  feedback: String,
  skills: [{ type: String, index: true }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// ==========================================
// Chat Session Schema
// ==========================================
export interface IChatSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'gemini' | 'claude' | 'general';
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
      model?: string;
      tokens?: number;
      responseTime?: number;
    };
  }>;
  status: 'active' | 'completed' | 'archived';
  totalMessages: number;
  totalTokens?: number;
  averageResponseTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['gemini', 'claude', 'general'],
    required: true,
    index: true
  },
  messages: [{
    id: String,
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now },
    metadata: {
      model: String,
      tokens: Number,
      responseTime: Number
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
    index: true
  },
  totalMessages: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Create models
export const SystemMetricsModel = mongoose.models.SystemMetrics ||
  mongoose.model<ISystemMetrics>('SystemMetrics', systemMetricsSchema);

export const UserActivityModel = mongoose.models.UserActivity ||
  mongoose.model<IUserActivity>('UserActivity', userActivitySchema);

export const DashboardAnalyticsModel = mongoose.models.DashboardAnalytics ||
  mongoose.model<IDashboardAnalytics>('DashboardAnalytics', dashboardAnalyticsSchema);

export const InterviewModel = mongoose.models.Interview ||
  mongoose.model<IInterview>('Interview', interviewSchema);

export const ChatSessionModel = mongoose.models.ChatSession ||
  mongoose.model<IChatSession>('ChatSession', chatSessionSchema);
