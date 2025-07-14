import mongoose from 'mongoose';

// Define the interface for ChatMessage subdocument
export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    responseTime?: number;
    isEdited?: boolean;
    editedAt?: Date;
  };
}

// Define the interface for ChatSession document
export interface IChatSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;

  // Session configuration
  config: {
    model: 'gemini' | 'deepseek' | 'gpt-3.5' | 'gpt-4';
    temperature: number;
    maxTokens: number;
    systemPrompt?: string;
  };

  // Messages in the conversation
  messages: IChatMessage[];

  // Session metadata
  metadata: {
    totalMessages: number;
    totalTokens: number;
    totalCost: number; // in credits or currency
    averageResponseTime: number; // in milliseconds
    sessionDuration: number; // in seconds
    lastActivity: Date;
    isActive: boolean;
    isPinned: boolean;
    tags: string[];
  };

  // Session statistics
  stats: {
    userMessages: number;
    assistantMessages: number;
    codeSnippets: number;
    questionsAsked: number;
    problemsSolved: number;
    rating?: number; // 1-5 stars
    feedback?: string;
  };

  // Sharing and collaboration
  sharing: {
    isPublic: boolean;
    shareId?: string;
    allowComments: boolean;
    viewCount: number;
    likes: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

// Create the ChatMessage schema
const chatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    model: String,
    tokens: Number,
    responseTime: Number,
    isEdited: { type: Boolean, default: false },
    editedAt: Date
  }
}, { _id: false });

// Create the main ChatSession schema
const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 500
  },

  // Session configuration
  config: {
    model: {
      type: String,
      enum: ['gemini', 'deepseek', 'gpt-3.5', 'gpt-4'],
      default: 'gemini'
    },
    temperature: { type: Number, default: 0.7, min: 0, max: 2 },
    maxTokens: { type: Number, default: 2048, min: 1, max: 8192 },
    systemPrompt: String
  },

  // Messages in the conversation
  messages: [chatMessageSchema],

  // Session metadata
  metadata: {
    totalMessages: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    sessionDuration: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
    tags: [String]
  },

  // Session statistics
  stats: {
    userMessages: { type: Number, default: 0 },
    assistantMessages: { type: Number, default: 0 },
    codeSnippets: { type: Number, default: 0 },
    questionsAsked: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 },
    feedback: String
  },

  // Sharing and collaboration
  sharing: {
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    allowComments: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
chatSessionSchema.index({ userId: 1, createdAt: -1 });
chatSessionSchema.index({ 'metadata.lastActivity': -1 });
chatSessionSchema.index({ 'metadata.isActive': 1 });
chatSessionSchema.index({ 'metadata.isPinned': 1 });
chatSessionSchema.index({ 'metadata.tags': 1 });
chatSessionSchema.index({ 'sharing.isPublic': 1 });
chatSessionSchema.index({ 'sharing.shareId': 1 });

// Add text index for search functionality
chatSessionSchema.index({
  title: 'text',
  description: 'text',
  'messages.content': 'text'
});

// Virtual for message count
chatSessionSchema.virtual('messageCount').get(function() {
  return this.messages ? this.messages.length : 0;
});

// Virtual for last message
chatSessionSchema.virtual('lastMessage').get(function() {
  if (!this.messages || this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Pre-save middleware to update metadata
chatSessionSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    if (this.metadata) {
      this.metadata.totalMessages = this.messages.length;
      this.metadata.lastActivity = new Date();
    }

    // Count user and assistant messages
    if (this.stats) {
      this.stats.userMessages = this.messages.filter(m => m.role === 'user').length;
      this.stats.assistantMessages = this.messages.filter(m => m.role === 'assistant').length;

      // Count code snippets (simple heuristic)
      this.stats.codeSnippets = this.messages.filter(m =>
        m.content.includes('```') || m.content.includes('<code>')
      ).length;
    }
  }
  next();
});

// Check if the model already exists to prevent overwriting
const ChatSessionModel = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', chatSessionSchema);

export default ChatSessionModel;
export { ChatSessionModel };
