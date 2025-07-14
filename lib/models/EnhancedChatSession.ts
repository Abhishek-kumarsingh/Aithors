import mongoose from 'mongoose';

// Enhanced Chat Message Interface
export interface IEnhancedChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  
  // Message metadata
  metadata?: {
    tokens?: number;
    model?: string;
    provider?: 'gemini' | 'deepseek' | 'claude' | 'openai';
    cost?: number;
    responseTime?: number; // in milliseconds
    isStreaming?: boolean;
    wasInterrupted?: boolean;
  };
  
  // Message formatting
  formatting?: {
    hasCode?: boolean;
    codeLanguage?: string;
    hasMarkdown?: boolean;
    hasImages?: boolean;
  };
  
  // User feedback
  feedback?: {
    rating?: 'thumbs_up' | 'thumbs_down';
    comment?: string;
    reportedAt?: Date;
  };
}

// Enhanced Chat Session Interface
export interface IEnhancedChatSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  
  // Session configuration
  config: {
    model: 'gemini-pro' | 'deepseek-chat' | 'claude-3' | 'gpt-4';
    provider: 'gemini' | 'deepseek' | 'claude' | 'openai';
    temperature: number;
    maxTokens: number;
    systemPrompt?: string;
    context?: string; // Additional context for the conversation
  };
  
  // Messages in the conversation
  messages: IEnhancedChatMessage[];
  
  // Session state
  status: 'active' | 'paused' | 'completed' | 'archived';
  isStreaming: boolean;
  lastActivity: Date;
  
  // Session statistics
  stats: {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    totalTokens: number;
    totalCost: number;
    averageResponseTime: number;
    sessionDuration: number; // in minutes
  };
  
  // Session metadata
  metadata: {
    category: 'general' | 'interview_prep' | 'coding_help' | 'career_advice' | 'technical_questions';
    tags: string[];
    language: string;
    userAgent?: string;
    ipAddress?: string;
    deviceInfo?: {
      browser: string;
      os: string;
      device: string;
    };
  };
  
  // Privacy and sharing
  privacy: {
    isPrivate: boolean;
    sharedWith?: mongoose.Types.ObjectId[];
    isPublic?: boolean;
    allowAnalytics?: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Chat Message Schema
const enhancedChatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  
  metadata: {
    tokens: Number,
    model: String,
    provider: {
      type: String,
      enum: ['gemini', 'deepseek', 'claude', 'openai']
    },
    cost: Number,
    responseTime: Number,
    isStreaming: { type: Boolean, default: false },
    wasInterrupted: { type: Boolean, default: false }
  },
  
  formatting: {
    hasCode: { type: Boolean, default: false },
    codeLanguage: String,
    hasMarkdown: { type: Boolean, default: false },
    hasImages: { type: Boolean, default: false }
  },
  
  feedback: {
    rating: {
      type: String,
      enum: ['thumbs_up', 'thumbs_down']
    },
    comment: String,
    reportedAt: Date
  }
}, { _id: false });

// Enhanced Chat Session Schema
const enhancedChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true, default: 'New Chat' },
  description: String,
  
  config: {
    model: {
      type: String,
      enum: ['gemini-pro', 'deepseek-chat', 'claude-3', 'gpt-4'],
      default: 'gemini-pro'
    },
    provider: {
      type: String,
      enum: ['gemini', 'deepseek', 'claude', 'openai'],
      default: 'gemini'
    },
    temperature: { type: Number, min: 0, max: 2, default: 0.7 },
    maxTokens: { type: Number, min: 100, max: 8000, default: 2000 },
    systemPrompt: String,
    context: String
  },
  
  messages: [enhancedChatMessageSchema],
  
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  isStreaming: { type: Boolean, default: false },
  lastActivity: { type: Date, default: Date.now },
  
  stats: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    assistantMessages: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    sessionDuration: { type: Number, default: 0 }
  },
  
  metadata: {
    category: {
      type: String,
      enum: ['general', 'interview_prep', 'coding_help', 'career_advice', 'technical_questions'],
      default: 'general'
    },
    tags: [String],
    language: { type: String, default: 'en' },
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String
    }
  },
  
  privacy: {
    isPrivate: { type: Boolean, default: true },
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isPublic: { type: Boolean, default: false },
    allowAnalytics: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
enhancedChatSessionSchema.index({ userId: 1, lastActivity: -1 });
enhancedChatSessionSchema.index({ status: 1 });
enhancedChatSessionSchema.index({ 'metadata.category': 1 });
enhancedChatSessionSchema.index({ createdAt: -1 });

// Virtual for session duration calculation
enhancedChatSessionSchema.virtual('calculatedDuration').get(function() {
  if (this.messages.length < 2) return 0;
  
  const firstMessage = this.messages[0];
  const lastMessage = this.messages[this.messages.length - 1];
  
  return Math.round((lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime()) / (1000 * 60));
});

// Pre-save middleware to update stats
enhancedChatSessionSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.stats) {
    this.stats.totalMessages = this.messages.length;
    this.stats.userMessages = this.messages.filter(m => m.role === 'user').length;
    this.stats.assistantMessages = this.messages.filter(m => m.role === 'assistant').length;

    // Calculate total tokens and cost
    this.stats.totalTokens = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.tokens || 0);
    }, 0);

    this.stats.totalCost = this.messages.reduce((total, msg) => {
      return total + (msg.metadata?.cost || 0);
    }, 0);

    // Calculate average response time
    const responseTimes = this.messages
      .filter(m => m.role === 'assistant' && m.metadata?.responseTime)
      .map(m => m.metadata!.responseTime!);

    if (responseTimes.length > 0) {
      this.stats.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    // Update session duration - calculate from createdAt to now
    const duration = this.createdAt ? Date.now() - this.createdAt.getTime() : 0;
    this.stats.sessionDuration = duration;
    
    // Update last activity
    this.lastActivity = new Date();
  }
  
  next();
});

const EnhancedChatSessionModel = mongoose.models.EnhancedChatSession || 
  mongoose.model<IEnhancedChatSession>('EnhancedChatSession', enhancedChatSessionSchema);

export default EnhancedChatSessionModel;
export { EnhancedChatSessionModel };
