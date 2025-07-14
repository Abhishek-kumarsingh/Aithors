# API Documentation

This document provides comprehensive documentation for all API endpoints in the InterviewAI platform.

## Base URL
```
http://localhost:3000/api (Development)
https://your-domain.com/api (Production)
```

## Authentication

Most API endpoints require authentication. The platform uses JWT tokens for authentication.

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints Overview

### Authentication APIs (`/api/auth/*`)
- User registration, login, and session management
- Google OAuth integration
- Two-factor authentication

### AI Assistant APIs (`/api/ai-assistant/*`)
- Chat with multiple AI providers
- Session management
- Message history

### Interview APIs (`/api/interviews/*`)
- Interview creation and management
- Question generation
- Performance analytics

### User Management APIs (`/api/user/*`)
- User profile management
- Settings and preferences

### Admin APIs (`/api/admin/*`)
- User management
- System analytics
- Platform administration

---

## Authentication Endpoints

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST `/api/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### GET `/api/auth/session`
Get current user session information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "expires": "2024-12-31T23:59:59.000Z"
}
```

### POST `/api/auth/logout`
Logout user and invalidate session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/api/auth/verify-otp`
Verify OTP for two-factor authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

## AI Assistant Endpoints

### POST `/api/ai-assistant/chat`
Send a message to the AI assistant.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "Help me prepare for a JavaScript interview",
  "sessionId": "session_123",
  "provider": "gemini" // optional: "gemini", "deepseek", "claude", "openai"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd be happy to help you prepare for a JavaScript interview...",
  "sessionId": "session_123",
  "provider": "gemini",
  "messageId": "msg_456"
}
```

### GET `/api/ai-assistant/sessions`
Get user's chat sessions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of sessions to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session_123",
      "title": "JavaScript Interview Prep",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z",
      "messageCount": 15
    }
  ],
  "total": 5,
  "hasMore": false
}
```

### GET `/api/ai-assistant/sessions/[sessionId]`
Get messages from a specific chat session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_123",
    "title": "JavaScript Interview Prep",
    "messages": [
      {
        "id": "msg_1",
        "role": "user",
        "content": "Help me prepare for a JavaScript interview",
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "msg_2",
        "role": "assistant",
        "content": "I'd be happy to help you prepare...",
        "timestamp": "2024-01-15T10:30:15.000Z",
        "provider": "gemini"
      }
    ]
  }
}
```

### DELETE `/api/ai-assistant/sessions/[sessionId]`
Delete a chat session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

---

## Interview Endpoints

### GET `/api/interviews`
Get user's interviews.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status ("pending", "in_progress", "completed")
- `limit` (optional): Number of interviews to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "interviews": [
    {
      "id": "interview_123",
      "title": "Frontend Developer Interview",
      "status": "completed",
      "score": 85,
      "duration": 3600,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "completedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 10,
  "hasMore": true
}
```

### POST `/api/interviews`
Create a new interview.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Frontend Developer Interview",
  "jobRole": "Frontend Developer",
  "techStack": ["JavaScript", "React", "Node.js"],
  "difficulty": "intermediate",
  "duration": 3600,
  "questionCount": 10
}
```

**Response:**
```json
{
  "success": true,
  "interview": {
    "id": "interview_123",
    "title": "Frontend Developer Interview",
    "status": "pending",
    "questions": [
      {
        "id": "q1",
        "question": "Explain the difference between let, const, and var",
        "type": "technical",
        "difficulty": "intermediate"
      }
    ]
  }
}
```

### GET `/api/interviews/[id]`
Get interview details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "interview": {
    "id": "interview_123",
    "title": "Frontend Developer Interview",
    "status": "completed",
    "score": 85,
    "questions": [
      {
        "id": "q1",
        "question": "Explain the difference between let, const, and var",
        "answer": "User's answer here...",
        "score": 8,
        "feedback": "Good explanation, but could include more details about hoisting"
      }
    ],
    "feedback": {
      "overall": "Strong performance with good technical knowledge",
      "strengths": ["JavaScript fundamentals", "Problem-solving"],
      "improvements": ["System design", "Testing strategies"]
    }
  }
}
```

### POST `/api/interviews/[id]/start`
Start an interview session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Interview started",
  "startTime": "2024-01-15T10:00:00.000Z"
}
```

### POST `/api/interviews/[id]/submit-answer`
Submit an answer to an interview question.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "questionId": "q1",
  "answer": "let and const are block-scoped while var is function-scoped...",
  "timeSpent": 180
}
```

**Response:**
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "nextQuestion": {
    "id": "q2",
    "question": "What is the event loop in JavaScript?"
  }
}
```

### POST `/api/interviews/[id]/complete`
Complete an interview and generate feedback.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Interview completed",
  "score": 85,
  "feedback": {
    "overall": "Strong performance with good technical knowledge",
    "strengths": ["JavaScript fundamentals", "Problem-solving"],
    "improvements": ["System design", "Testing strategies"]
  }
}
```

### POST `/api/interviews/[id]/generate-overall-feedback`
Generate comprehensive feedback for completed interview.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "feedback": {
    "overallScore": 85,
    "skillBreakdown": {
      "JavaScript": 90,
      "React": 80,
      "Problem Solving": 85
    },
    "recommendations": [
      "Focus on advanced React patterns",
      "Practice system design questions"
    ],
    "detailedAnalysis": "Comprehensive analysis text..."
  }
}
```

---

## User Management Endpoints

### GET `/api/user/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-15T10:00:00.000Z",
    "preferences": {
      "theme": "light",
      "notifications": true
    }
  }
}
```

### PUT `/api/user/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

### GET `/api/user/analytics`
Get user's performance analytics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalInterviews": 15,
    "averageScore": 82,
    "completionRate": 93,
    "skillProgress": {
      "JavaScript": 85,
      "React": 78,
      "Node.js": 72
    },
    "recentActivity": [
      {
        "type": "interview_completed",
        "date": "2024-01-15T10:00:00.000Z",
        "score": 85
      }
    ]
  }
}
```

---

## Admin Endpoints

### GET `/api/admin/users`
Get all users (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `role` (optional): Filter by role ("user", "admin")
- `status` (optional): Filter by status ("active", "blocked")
- `limit` (optional): Number of users to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-15T10:00:00.000Z",
      "interviewCount": 5
    }
  ],
  "total": 150,
  "hasMore": true
}
```

### PUT `/api/admin/users/[id]/status`
Update user status (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "blocked" // or "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated successfully"
}
```

### GET `/api/admin/analytics`
Get platform analytics (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "totalInterviews": 5670,
    "averageScore": 78,
    "systemHealth": {
      "uptime": "99.9%",
      "responseTime": "120ms",
      "errorRate": "0.1%"
    },
    "usage": {
      "daily": [
        {"date": "2024-01-15", "users": 45, "interviews": 120}
      ],
      "monthly": [
        {"month": "2024-01", "users": 1250, "interviews": 3400}
      ]
    }
  }
}
```

### POST `/api/admin/impersonate`
Impersonate a user (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "impersonationToken": "impersonation_jwt_token",
  "message": "Impersonation started"
}
```

---

## Practice Endpoints

### GET `/api/practice/questions`
Get practice questions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `domain` (optional): Filter by domain ("frontend", "backend", "fullstack")
- `difficulty` (optional): Filter by difficulty ("easy", "medium", "hard")
- `limit` (optional): Number of questions to return (default: 20)

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q_123",
      "question": "Implement a function to reverse a string",
      "domain": "frontend",
      "difficulty": "easy",
      "type": "coding",
      "timeLimit": 300
    }
  ],
  "total": 500
}
```

### POST `/api/practice/submit`
Submit a practice question answer.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "questionId": "q_123",
  "answer": "function reverseString(str) { return str.split('').reverse().join(''); }",
  "timeSpent": 180
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "correct": true,
    "score": 95,
    "feedback": "Excellent solution! Clean and efficient implementation.",
    "testResults": [
      {"input": "hello", "expected": "olleh", "actual": "olleh", "passed": true}
    ]
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **AI Assistant endpoints**: 20 requests per minute
- **General endpoints**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```
