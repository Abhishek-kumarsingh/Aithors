# InterviewAI - Comprehensive AI-Powered Interview Platform

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-blue)](https://mui.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

InterviewAI is a comprehensive, enterprise-grade interview platform that leverages multiple AI providers to revolutionize the hiring process. Built with modern technologies and featuring a robust architecture, it provides intelligent interview management, real-time AI assistance, and comprehensive analytics.

## 🚀 Key Features

### 🤖 Multi-AI Provider Integration
- **Google Gemini 2.0 Flash** - Primary AI provider for intelligent responses
- **DeepSeek API** - Fallback provider for enhanced reliability  
- **Claude (Anthropic)** - Advanced reasoning and analysis
- **OpenAI GPT** - Additional AI capabilities
- **Automatic Failover** - Seamless switching between providers

### 👥 Comprehensive User Management
- **Role-Based Access Control** - Admin and User roles with specific permissions
- **Google OAuth Integration** - Secure social authentication
- **Two-Factor Authentication** - Enhanced security with OTP verification
- **Session Management** - Secure JWT-based authentication
- **User Impersonation** - Admin capability for support and testing

### 📊 Advanced Interview System
- **AI-Powered Question Generation** - Dynamic questions based on job requirements
- **Real-Time Code Execution** - Multi-language code testing environment
- **Resume Analysis** - AI-powered resume parsing and skill extraction
- **Voice Integration** - Text-to-speech and speech recognition
- **Performance Analytics** - Detailed interview performance metrics

### 🎯 Modern Dashboard Experience
- **Admin Dashboard** - Comprehensive system management and analytics
- **User Dashboard** - Personalized interview tracking and progress
- **Real-Time Updates** - WebSocket-powered live data
- **Interactive Charts** - Advanced data visualization with Recharts
- **Responsive Design** - Mobile-first approach with Material-UI

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    InterviewAI Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 13 + TypeScript + Material-UI)         │
│  ├── Landing Page (Marketing & Features)                   │
│  ├── Authentication (OAuth + 2FA)                          │
│  ├── User Dashboard (Interviews + Analytics)               │
│  └── Admin Dashboard (Management + System Metrics)         │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes)                            │
│  ├── Authentication APIs (/api/auth/*)                     │
│  ├── AI Integration APIs (/api/ai-assistant/*)             │
│  ├── Interview Management (/api/interviews/*)              │
│  ├── User Management (/api/user/*)                         │
│  ├── Admin APIs (/api/admin/*)                             │
│  └── Analytics & Reporting (/api/analytics/*)              │
├─────────────────────────────────────────────────────────────┤
│  AI Integration Layer                                       │
│  ├── Google Gemini 2.0 Flash (Primary)                    │
│  ├── DeepSeek API (Fallback)                               │
│  ├── Claude/Anthropic (Advanced Analysis)                  │
│  └── OpenAI GPT (Additional Capabilities)                  │
├─────────────────────────────────────────────────────────────┤
│  Database Layer (MongoDB)                                  │
│  ├── Users Collection (Authentication & Profiles)          │
│  ├── Interviews Collection (Sessions & Results)            │
│  ├── ChatSessions Collection (AI Conversations)            │
│  ├── Analytics Collection (Performance Metrics)            │
│  └── SystemMetrics Collection (Platform Health)            │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ├── Google OAuth (Authentication)                         │
│  ├── Email Service (OTP & Notifications)                   │
│  ├── File Storage (Resume & Document Upload)               │
│  └── WebSocket (Real-time Updates)                         │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation Index

### 🚀 Getting Started
- [**Installation & Setup Guide**](docs/INSTALLATION.md) - Complete setup instructions
- [**Environment Configuration**](docs/ENVIRONMENT.md) - Environment variables and configuration
- [**Quick Start Tutorial**](docs/QUICK_START.md) - Get up and running in 5 minutes

### 🏗️ Architecture & Development  
- [**API Documentation**](docs/API.md) - Complete API reference with examples
- [**Database Schema**](docs/DATABASE.md) - MongoDB collections and relationships
- [**Component Architecture**](docs/COMPONENTS.md) - Frontend component structure
- [**Authentication System**](docs/AUTHENTICATION.md) - Auth flow and security features

### 👥 User Guides
- [**Admin Dashboard Guide**](docs/ADMIN_GUIDE.md) - Complete admin functionality
- [**User Dashboard Guide**](docs/USER_GUIDE.md) - User features and workflows  
- [**Interview System Guide**](docs/INTERVIEW_GUIDE.md) - Interview creation and management

### 🔧 Development & Maintenance
- [**Development Workflow**](docs/DEVELOPMENT.md) - Contributing and development practices
- [**Testing Guide**](docs/TESTING.md) - Testing strategies and implementation
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment instructions
- [**Troubleshooting**](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript 5.8.3
- **UI Library**: Material-UI 7.2.0 + Emotion
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: Zustand + React Context
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Material Icons + Lucide React

### Backend & APIs
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **File Upload**: Multer for multipart/form-data
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Email**: Nodemailer for OTP and notifications
- **WebSocket**: Socket.io for real-time features

### AI & External Services
- **Primary AI**: Google Gemini 2.0 Flash API
- **Fallback AI**: DeepSeek API
- **Advanced AI**: Claude (Anthropic) API  
- **Additional AI**: OpenAI GPT API
- **OAuth**: Google OAuth 2.0
- **Code Execution**: Secure sandboxed environment
- **Voice**: Web Speech API + Text-to-Speech

### Development & Testing
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Code Quality**: Prettier for formatting
- **Package Manager**: npm
- **Build Tool**: Next.js built-in bundler
- **Development**: Hot reload + Fast refresh

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- Google OAuth credentials
- AI API keys (Gemini required, others optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/interviewai.git
cd interviewai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your .env.local file with required variables
# See docs/ENVIRONMENT.md for detailed configuration

# Seed the database with admin user
npm run seed-admin

# Start development server
npm run dev
```

### Default Admin Access
- **Email**: `alpsingh03@gmail.com`
- **Password**: `cdyx`

Visit `http://localhost:3000` to access the application.

## 🌟 Key Features Breakdown

### 🎯 Interview Management
- **AI Question Generation** - Dynamic questions based on job requirements and resume analysis
- **Multi-Domain Support** - Technical, behavioral, and domain-specific interviews
- **Real-Time Code Testing** - Integrated code execution environment with multiple language support
- **Performance Analytics** - Detailed scoring and feedback with AI-powered insights
- **Resume Integration** - Automatic parsing and skill extraction from uploaded resumes

### 🤖 AI Assistant Features  
- **Multi-Provider Support** - Seamless integration with multiple AI providers
- **Intelligent Fallback** - Automatic switching to backup providers on failure
- **Context Awareness** - Maintains conversation context across sessions
- **Streaming Responses** - Real-time response generation for better UX
- **Cost Tracking** - Monitor AI usage and costs across providers

### 📊 Analytics & Reporting
- **Real-Time Dashboards** - Live metrics and system health monitoring
- **Performance Insights** - Detailed candidate performance analysis
- **System Analytics** - Platform usage statistics and trends
- **Export Capabilities** - PDF reports and data export functionality
- **Custom Metrics** - Configurable KPIs and performance indicators

### 🔐 Security & Authentication
- **Multi-Factor Authentication** - OTP-based email verification
- **Role-Based Access Control** - Granular permissions for different user types
- **Session Management** - Secure JWT-based authentication with refresh tokens
- **OAuth Integration** - Google OAuth for seamless social login
- **Admin Impersonation** - Secure user impersonation for support scenarios

## 📈 Performance & Scalability

- **Optimized Bundle Size** - Code splitting and lazy loading
- **Database Indexing** - Optimized MongoDB queries and indexes
- **Caching Strategy** - Redis caching for frequently accessed data
- **CDN Integration** - Static asset optimization and delivery
- **Horizontal Scaling** - Designed for multi-instance deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on:

- Code of Conduct
- Development setup
- Pull request process
- Coding standards
- Testing requirements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **Documentation**: Comprehensive guides in the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/interviewai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/interviewai/discussions)
- **Email**: support@interviewai.com

## 🙏 Acknowledgments

- **Google** for the Gemini AI API and OAuth services
- **Anthropic** for the Claude AI API
- **Material-UI Team** for the excellent component library
- **Next.js Team** for the amazing React framework
- **MongoDB** for the flexible database solution
- **All Contributors** who have helped build and improve this platform

---

**Built with ❤️ by the InterviewAI Team**
