# MongoDB Schema Design for Interview Platform

## Overview

This document outlines the MongoDB schema design for a full-stack interview platform. The schema is designed to support user management, interview sessions, chat sessions with AI assistants, and PDF export functionality.

## Collections

### 1. User Collection

```typescript
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string; // Hashed
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
```

- **Purpose**: Stores user information and references to their interviews and chat sessions
- **Key Features**:
  - Password hashing with bcrypt
  - Role-based access control ('user' or 'admin')
  - References to interviews and chat sessions
  - Optional resume storage path
  - Job descriptions array for matching

### 2. Interview Collection

```typescript
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
```

- **Purpose**: Stores interview sessions with questions, responses, and results
- **Key Features**:
  - Embedded questions array with question text, response, and score
  - Result summary with strengths, weaknesses, and feedback
  - PDF export path for generated reports
  - Interrupted flag for resuming partial interviews

### 3. ChatSession Collection

```typescript
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
```

- **Purpose**: Stores AI assistant chat sessions
- **Key Features**:
  - Embedded messages array with role, content, and timestamp
  - Context tags for categorizing sessions (e.g., 'Resume Help', 'Frontend Interview')
  - Active status flag for ongoing sessions

## Implementation Details

### Session Persistence

The schema supports session persistence through:

1. **Database Storage**: All chat messages and interview responses are stored in MongoDB
2. **Frontend State Management**: Implement using Redux/Zustand to maintain session state
3. **WebSocket/Polling**: For real-time updates when navigating between pages
4. **LocalStorage Fallback**: For session recovery after browser refresh

### Background Workers

The `BackgroundWorker` class provides a framework for implementing background processing:

```typescript
export class BackgroundWorker {
  static async processResumeAnalysis(userId: string, resumePath: string, jobDescription: string) {
    // Implementation with queue system like BullMQ
  }
  
  static async processInterviewScoring(interviewId: string) {
    // Implementation with queue system like BullMQ
  }
}
```

- Use a queue system like BullMQ for processing long-running AI jobs
- Process resume analysis, interview scoring, and PDF generation in the background

### PDF Export

The `InterviewPDFExportService` handles PDF generation:

```typescript
export class InterviewPDFExportService {
  static async generateInterviewPDF(interview: IInterview): Promise<string> {
    // Implementation using jsPDF or similar library
    // Returns path to saved PDF
  }
}
```

- Generates formatted PDFs with questions, answers, and scores
- Stores PDFs in server/public folder or cloud storage
- Saves the path in the Interview document for later retrieval

## Bonus Features

1. **Interrupted Interviews**: The `interrupted` flag in the Interview schema allows for resuming partially completed interviews
2. **Resume-JD Analysis**: The User schema includes fields for storing resume paths and job descriptions for analysis
3. **AI Usage Tracking**: Could be implemented by adding usage metrics to the User or a separate collection

## Integration with Existing Models

This schema design extends and complements the existing models in the codebase:

- **User Model**: Enhanced with interview history and chat session references
- **Interview Model**: Restructured to focus on interview flow and results
- **ChatSession Model**: Optimized for AI assistant interactions

## Database Indexes

Recommended indexes for performance optimization:

```javascript
// User Collection
db.users.createIndex({ "email": 1 }, { unique: true })

// Interview Collection
db.interviews.createIndex({ "userId": 1 })
db.interviews.createIndex({ "startedAt": 1 })

// ChatSession Collection
db.chatSessions.createIndex({ "userId": 1 })
db.chatSessions.createIndex({ "isActive": 1 })
```