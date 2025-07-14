# Database Schema Documentation

This document describes the MongoDB database schema used in the InterviewAI platform.

## Database Overview

The InterviewAI platform uses MongoDB as its primary database with the following collections:

- **users** - User accounts and profiles
- **interviews** - Interview sessions and results
- **chatSessions** - AI assistant conversations
- **questions** - Question bank for interviews and practice
- **analytics** - Performance metrics and analytics data
- **systemMetrics** - Platform health and usage statistics

## Collections Schema

### Users Collection

Stores user account information, authentication data, and preferences.

```javascript
{
  _id: ObjectId,
  email: String, // Unique, required
  name: String, // Required
  password: String, // Hashed password (for email/password auth)
  role: String, // "user" | "admin", default: "user"
  status: String, // "active" | "blocked" | "pending", default: "active"
  
  // OAuth Integration
  googleId: String, // Google OAuth ID
  avatar: String, // Profile picture URL
  
  // Authentication & Security
  emailVerified: Boolean, // default: false
  twoFactorEnabled: Boolean, // default: false
  lastLogin: Date,
  loginAttempts: Number, // default: 0
  lockUntil: Date, // Account lock timestamp
  
  // User Preferences
  preferences: {
    theme: String, // "light" | "dark", default: "light"
    notifications: Boolean, // default: true
    language: String, // default: "en"
    timezone: String // default: "UTC"
  },
  
  // Profile Information
  profile: {
    bio: String,
    location: String,
    website: String,
    skills: [String], // Array of skills
    experience: String, // "junior" | "mid" | "senior"
    resume: {
      filename: String,
      url: String,
      uploadedAt: Date
    }
  },
  
  // Timestamps
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  
  // Analytics
  stats: {
    totalInterviews: Number, // default: 0
    completedInterviews: Number, // default: 0
    averageScore: Number, // default: 0
    totalChatMessages: Number, // default: 0
    lastActivityAt: Date
  }
}
```

**Indexes:**
```javascript
// Unique indexes
{ email: 1 } // unique
{ googleId: 1 } // unique, sparse

// Query optimization indexes
{ role: 1, status: 1 }
{ createdAt: -1 }
{ "stats.lastActivityAt": -1 }
```

### Interviews Collection

Stores interview sessions, questions, answers, and results.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  
  // Interview Configuration
  title: String, // Required
  jobRole: String, // e.g., "Frontend Developer"
  techStack: [String], // e.g., ["JavaScript", "React", "Node.js"]
  difficulty: String, // "easy" | "medium" | "hard"
  duration: Number, // Duration in seconds
  
  // Interview Status
  status: String, // "pending" | "in_progress" | "completed" | "cancelled"
  startedAt: Date,
  completedAt: Date,
  
  // Questions and Answers
  questions: [{
    _id: ObjectId,
    questionId: ObjectId, // Reference to questions collection
    question: String,
    type: String, // "technical" | "behavioral" | "coding"
    difficulty: String,
    expectedAnswer: String,
    
    // User Response
    answer: String,
    codeAnswer: String, // For coding questions
    timeSpent: Number, // Time spent in seconds
    submittedAt: Date,
    
    // AI Evaluation
    score: Number, // 0-100
    feedback: String,
    aiProvider: String, // "gemini" | "deepseek" | "claude"
    evaluatedAt: Date
  }],
  
  // Overall Results
  results: {
    totalScore: Number, // 0-100
    averageScore: Number,
    questionsAnswered: Number,
    questionsTotal: Number,
    timeSpent: Number, // Total time in seconds
    
    // Skill Breakdown
    skillScores: {
      // Dynamic fields based on tech stack
      // e.g., "JavaScript": 85, "React": 78
    },
    
    // AI-Generated Feedback
    overallFeedback: String,
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    
    // Performance Metrics
    responseTime: Number, // Average response time
    consistency: Number, // Score consistency metric
    confidence: Number // AI confidence in evaluation
  },
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  
  // AI Processing
  aiProcessing: {
    provider: String, // Primary AI provider used
    fallbackUsed: Boolean, // Whether fallback was needed
    processingTime: Number, // Total AI processing time
    cost: Number // Estimated cost for AI processing
  }
}
```

**Indexes:**
```javascript
{ userId: 1, status: 1 }
{ userId: 1, createdAt: -1 }
{ status: 1, createdAt: -1 }
{ jobRole: 1, difficulty: 1 }
{ "results.totalScore": -1 }
```

### ChatSessions Collection

Stores AI assistant conversations and message history.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  
  // Session Information
  title: String, // Auto-generated or user-defined
  provider: String, // "gemini" | "deepseek" | "claude" | "openai"
  
  // Messages
  messages: [{
    _id: ObjectId,
    role: String, // "user" | "assistant" | "system"
    content: String, // Message content
    timestamp: Date,
    
    // AI Response Metadata
    provider: String, // AI provider used for this message
    model: String, // Specific model used
    tokens: {
      input: Number,
      output: Number,
      total: Number
    },
    cost: Number, // Estimated cost
    responseTime: Number, // Response time in ms
    
    // Message Features
    attachments: [{
      type: String, // "file" | "image" | "code"
      url: String,
      filename: String,
      size: Number
    }],
    
    // User Feedback
    feedback: {
      rating: Number, // 1-5 stars
      helpful: Boolean,
      comment: String,
      submittedAt: Date
    }
  }],
  
  // Session Metadata
  messageCount: Number, // default: 0
  lastMessageAt: Date,
  isActive: Boolean, // default: true
  
  // Analytics
  analytics: {
    totalTokens: Number,
    totalCost: Number,
    averageResponseTime: Number,
    userSatisfaction: Number // Average rating
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1, isActive: 1 }
{ userId: 1, lastMessageAt: -1 }
{ provider: 1, createdAt: -1 }
{ "analytics.totalCost": -1 }
```

### Questions Collection

Stores the question bank for interviews and practice sessions.

```javascript
{
  _id: ObjectId,
  
  // Question Content
  question: String, // Required
  type: String, // "technical" | "behavioral" | "coding" | "system_design"
  category: String, // "frontend" | "backend" | "fullstack" | "mobile"
  difficulty: String, // "easy" | "medium" | "hard"
  
  // Technical Details
  techStack: [String], // Related technologies
  skills: [String], // Skills being tested
  timeLimit: Number, // Recommended time in seconds
  
  // Question Variants
  variants: [{
    question: String,
    difficulty: String,
    context: String // Additional context for the variant
  }],
  
  // Expected Answer/Solution
  expectedAnswer: String,
  sampleCode: String, // For coding questions
  testCases: [{ // For coding questions
    input: String,
    expectedOutput: String,
    description: String
  }],
  
  // Evaluation Criteria
  evaluationCriteria: [{
    criterion: String, // e.g., "Code Quality"
    weight: Number, // Percentage weight (0-100)
    description: String
  }],
  
  // Usage Statistics
  usage: {
    timesUsed: Number, // default: 0
    averageScore: Number,
    averageTime: Number,
    successRate: Number // Percentage of correct answers
  },
  
  // Metadata
  createdBy: ObjectId, // Reference to users collection
  tags: [String],
  isActive: Boolean, // default: true
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ type: 1, category: 1, difficulty: 1 }
{ techStack: 1, isActive: 1 }
{ skills: 1, difficulty: 1 }
{ "usage.averageScore": -1 }
{ tags: 1 }
```

### Analytics Collection

Stores detailed analytics and performance metrics for users and the platform.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  type: String, // "user" | "interview" | "chat" | "system"

  // Time Period
  period: {
    type: String, // "daily" | "weekly" | "monthly" | "yearly"
    date: Date, // Start date of the period
    endDate: Date // End date of the period
  },

  // User Analytics (when type: "user")
  userMetrics: {
    interviewsCompleted: Number,
    averageScore: Number,
    totalTimeSpent: Number, // in seconds
    skillProgress: {
      // Dynamic fields for each skill
      // e.g., "JavaScript": { score: 85, improvement: 5 }
    },
    streakDays: Number, // Consecutive days of activity
    achievements: [String], // Unlocked achievements

    // Engagement Metrics
    loginCount: Number,
    sessionDuration: Number, // Average session duration
    featuresUsed: [String], // Features accessed

    // Performance Trends
    scoreHistory: [{
      date: Date,
      score: Number,
      interviewId: ObjectId
    }],

    // AI Usage
    aiInteractions: {
      totalMessages: Number,
      averageResponseTime: Number,
      satisfactionRating: Number,
      providersUsed: [String]
    }
  },

  // Interview Analytics (when type: "interview")
  interviewMetrics: {
    interviewId: ObjectId,
    completionRate: Number, // Percentage completed
    averageQuestionTime: Number,
    difficultyDistribution: {
      easy: Number,
      medium: Number,
      hard: Number
    },
    skillPerformance: {
      // Dynamic fields for each skill tested
    },

    // Question Analysis
    questionMetrics: [{
      questionId: ObjectId,
      averageScore: Number,
      averageTime: Number,
      successRate: Number,
      commonMistakes: [String]
    }]
  },

  // Chat Analytics (when type: "chat")
  chatMetrics: {
    sessionId: ObjectId,
    messageCount: Number,
    averageResponseTime: Number,
    tokensUsed: Number,
    cost: Number,
    userSatisfaction: Number,
    topicsDiscussed: [String],

    // Provider Performance
    providerMetrics: {
      primary: String, // Primary provider used
      fallbackCount: Number, // Times fallback was needed
      errorRate: Number,
      averageLatency: Number
    }
  },

  // System Analytics (when type: "system")
  systemMetrics: {
    activeUsers: Number,
    newRegistrations: Number,
    totalInterviews: Number,
    systemUptime: Number, // Percentage
    averageResponseTime: Number,
    errorRate: Number,

    // Resource Usage
    cpuUsage: Number,
    memoryUsage: Number,
    diskUsage: Number,

    // AI Provider Stats
    aiProviderStats: [{
      provider: String,
      requestCount: Number,
      successRate: Number,
      averageLatency: Number,
      totalCost: Number,
      errorCount: Number
    }],

    // Feature Usage
    featureUsage: {
      interviews: Number,
      chatSessions: Number,
      practiceQuestions: Number,
      adminActions: Number
    }
  },

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1, type: 1, "period.date": -1 }
{ type: 1, "period.date": -1 }
{ "userMetrics.averageScore": -1 }
{ "systemMetrics.activeUsers": -1 }
```

### SystemMetrics Collection

Stores real-time system health and performance metrics.

```javascript
{
  _id: ObjectId,

  // Timestamp
  timestamp: Date, // Required

  // System Health
  health: {
    status: String, // "healthy" | "warning" | "critical"
    uptime: Number, // Uptime percentage
    responseTime: Number, // Average response time in ms
    errorRate: Number, // Error rate percentage

    // Server Metrics
    server: {
      cpuUsage: Number, // CPU usage percentage
      memoryUsage: Number, // Memory usage percentage
      diskUsage: Number, // Disk usage percentage
      networkIO: {
        incoming: Number, // Bytes per second
        outgoing: Number // Bytes per second
      }
    }
  },

  // Database Metrics
  database: {
    connectionCount: Number,
    queryTime: Number, // Average query time in ms
    slowQueries: Number, // Count of slow queries
    indexUsage: Number, // Index usage percentage

    // Collection Sizes
    collections: {
      users: Number,
      interviews: Number,
      chatSessions: Number,
      questions: Number,
      analytics: Number
    }
  },

  // API Metrics
  api: {
    requestCount: Number, // Total requests in time period
    successRate: Number, // Success rate percentage
    averageLatency: Number, // Average latency in ms

    // Endpoint Performance
    endpoints: [{
      path: String,
      method: String,
      requestCount: Number,
      averageLatency: Number,
      errorRate: Number
    }],

    // Rate Limiting
    rateLimitHits: Number,
    blockedRequests: Number
  },

  // AI Provider Metrics
  aiProviders: [{
    provider: String, // "gemini" | "deepseek" | "claude" | "openai"
    status: String, // "online" | "offline" | "degraded"
    requestCount: Number,
    successRate: Number,
    averageLatency: Number,
    errorCount: Number,
    cost: Number, // Total cost for the period

    // Error Details
    errors: [{
      type: String,
      count: Number,
      lastOccurred: Date
    }]
  }],

  // User Activity
  userActivity: {
    activeUsers: Number, // Currently active users
    newRegistrations: Number,
    totalLogins: Number,
    concurrentSessions: Number,

    // Feature Usage
    featureUsage: {
      interviews: Number,
      chatSessions: Number,
      practiceQuestions: Number,
      adminActions: Number
    }
  },

  // Alerts and Notifications
  alerts: [{
    type: String, // "warning" | "error" | "critical"
    message: String,
    component: String, // Component that triggered the alert
    timestamp: Date,
    resolved: Boolean, // default: false
    resolvedAt: Date
  }]
}
```

**Indexes:**
```javascript
{ timestamp: -1 }
{ "health.status": 1, timestamp: -1 }
{ "aiProviders.provider": 1, timestamp: -1 }
{ "alerts.type": 1, "alerts.resolved": 1 }
```

## Relationships and Data Flow

### User → Interviews
- One user can have many interviews
- Each interview belongs to one user
- Foreign key: `interviews.userId` → `users._id`

### User → ChatSessions
- One user can have many chat sessions
- Each chat session belongs to one user
- Foreign key: `chatSessions.userId` → `users._id`

### Interview → Questions
- One interview can have many questions
- Questions are referenced by ID in interviews
- Reference: `interviews.questions.questionId` → `questions._id`

### User → Analytics
- One user can have many analytics records
- Each analytics record belongs to one user
- Foreign key: `analytics.userId` → `users._id`

## Data Validation Rules

### Email Validation
- Must be unique across all users
- Must follow valid email format
- Case-insensitive storage (lowercase)

### Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, number
- Hashed using bcrypt with salt rounds ≥ 12

### Score Validation
- All scores must be between 0-100
- Stored as integers
- Default value: 0

### Status Enums
- User status: `["active", "blocked", "pending"]`
- Interview status: `["pending", "in_progress", "completed", "cancelled"]`
- Question difficulty: `["easy", "medium", "hard"]`

## Performance Considerations

### Indexing Strategy
- Compound indexes for common query patterns
- Sparse indexes for optional fields (e.g., googleId)
- TTL indexes for temporary data (e.g., session tokens)

### Data Archiving
- Archive completed interviews older than 2 years
- Archive chat sessions older than 1 year
- Maintain analytics data for 5 years

### Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation pipelines for complex analytics

### Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Monthly backup testing and validation
