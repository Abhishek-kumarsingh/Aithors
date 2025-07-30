# 🎯 Aithor - AI-Powered Interview Platform

<div align="center">

![Aithor Banner](https://via.placeholder.com/800x200/9333ea/ffffff?text=Aithor+-+AI+Interview+Platform)

**Revolutionizing Interview Preparation with Artificial Intelligence**

[![Build Status](https://github.com/abhishek/aithor/workflows/CI/badge.svg)](https://github.com/abhishek/aithor/actions)
[![Deploy Status](https://github.com/abhishek/aithor/workflows/Deploy/badge.svg)](https://github.com/abhishek/aithor/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge&logo=openai)](https://ai.google.dev/)

[🚀 Live Demo](https://aithor.vercel.app) • [📚 Documentation](./docs) • [🐛 Report Bug](https://github.com/abhishek/aithor/issues) • [💡 Request Feature](https://github.com/abhishek/aithor/discussions)

</div>

---

## 📊 Project Stats

<!-- AUTO-GENERATED-CONTENT:START (STATS) -->
![GitHub stars](https://img.shields.io/github/stars/abhishek/aithor?style=social)
![GitHub forks](https://img.shields.io/github/forks/abhishek/aithor?style=social)
![GitHub issues](https://img.shields.io/github/issues/abhishek/aithor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/abhishek/aithor)
![Last commit](https://img.shields.io/github/last-commit/abhishek/aithor)
![Repo size](https://img.shields.io/github/repo-size/abhishek/aithor)
<!-- AUTO-GENERATED-CONTENT:END -->

## 🌟 Overview

Aithor is a cutting-edge AI-powered interview preparation platform designed to help job seekers excel in their interviews. Using advanced artificial intelligence, real-time conversation analysis, and comprehensive feedback systems, Aithor provides personalized interview practice that adapts to each user's skill level and career goals.

### ✨ Key Features

- 🤖 **AI-Powered Interviews**: Intelligent conversations that adapt to your responses
- 📊 **Real-Time Analytics**: Comprehensive performance tracking and insights
- 🎯 **Personalized Feedback**: Detailed analysis of technical and soft skills
- 📱 **Mobile Responsive**: Practice anywhere, anytime on any device
- 🔊 **Voice Integration**: Speech-to-text for natural conversation flow
- 📄 **Resume Analysis**: AI-powered resume review and optimization
- 🏆 **Progress Tracking**: Monitor improvement over time
- 🌐 **Multi-Domain Support**: Questions across various industries and roles

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhishek/aithor.git
   cd aithor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/aithor

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3001

   # AI API Keys
   GEMINI_API_KEY=your-gemini-api-key

   # Application
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture

### Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14, TypeScript | React framework with SSR/SSG |
| **Styling** | Material-UI, Tailwind CSS | Component library and utilities |
| **Backend** | Next.js API Routes | Serverless API endpoints |
| **Database** | MongoDB, Mongoose | Document database and ODM |
| **Authentication** | NextAuth.js | Secure user authentication |
| **AI Integration** | Google Gemini API | Natural language processing |
| **Real-time** | Socket.io | WebSocket connections |
| **Deployment** | Vercel | Cloud platform deployment |

---

## 📈 Recent Activity

<!-- AUTO-GENERATED-CONTENT:START (ACTIVITY) -->
### Latest Commits
- **Latest commit message** - *Date*
- **Second latest commit** - *Date*
- **Third latest commit** - *Date*

### Recent Contributors
Thanks to these amazing people for their recent contributions!

<!-- AUTO-GENERATED-CONTENT:END -->

---

## 🧪 Testing & Quality

<!-- AUTO-GENERATED-CONTENT:START (QUALITY) -->
![Build Status](https://github.com/abhishek/aithor/workflows/CI/badge.svg)
![Test Coverage](https://img.shields.io/codecov/c/github/abhishek/aithor)
![Code Quality](https://img.shields.io/codeclimate/maintainability/abhishek/aithor)
<!-- AUTO-GENERATED-CONTENT:END -->

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
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

---

## 🤝 Contributing

We welcome contributions from the community!

<!-- AUTO-GENERATED-CONTENT:START (CONTRIBUTORS) -->
### Contributors

Thanks goes to these wonderful people:

<!-- AUTO-GENERATED-CONTENT:END -->

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## 📊 Project Metrics

<!-- AUTO-GENERATED-CONTENT:START (METRICS) -->
### Development Activity (Last 30 Days)
- **Commits**: [Auto-generated number]
- **Pull Requests**: [Auto-generated number]
- **Issues Closed**: [Auto-generated number]
- **New Contributors**: [Auto-generated number]

### Code Statistics
- **Total Lines of Code**: [Auto-generated number]
- **Languages Used**: TypeScript (65%), JavaScript (20%), CSS (10%), Other (5%)
- **Test Coverage**: [Auto-generated percentage]%
<!-- AUTO-GENERATED-CONTENT:END -->

---

## 🎯 Roadmap

### Current Version (v1.0) ✅
- ✅ AI-powered interview sessions
- ✅ Real-time feedback system
- ✅ User authentication & profiles
- ✅ Basic analytics dashboard
- ✅ Mobile responsive design

### Upcoming Features (v1.1) 🔄
- 🔄 Video interview capabilities
- 🔄 Advanced analytics & insights
- 🔄 Team collaboration features
- 🔄 Integration with job boards
- 🔄 Mobile application

### Future Vision (v2.0) 📋
- 📋 AI-powered career coaching
- 📋 Company-specific interview prep
- 📋 Live mentor connections
- 📋 Advanced performance metrics
- 📋 Enterprise solutions

---

## 👥 Team

### Project Lead & Developer
**Abhishek Kumar Singh**
- 🔗 LinkedIn: [Abhishek Kumar Singh](https://linkedin.com/in/abhishek-kumar-singh)
- 📧 Email: abhishek@aithor.in
- 🐙 GitHub: [@abhishek](https://github.com/abhishek)

---

## 📞 Support & Contact

### Get Help
- 📧 **General Inquiries**: contact@aithor.in
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/abhishek/aithor/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/abhishek/aithor/discussions)
- 🔒 **Security Issues**: security@aithor.in

### Community
- 💬 **Discord**: [Join our community](https://discord.gg/aithor)
- 🐦 **Twitter**: [@AithorPlatform](https://twitter.com/AithorPlatform)
- 📱 **LinkedIn**: [Aithor Company Page](https://linkedin.com/company/aithor)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing capabilities
- **Vercel** for seamless deployment and hosting
- **MongoDB** for reliable database solutions
- **Next.js Team** for the amazing React framework
- **Open Source Community** for inspiration and support
---

<!-- AUTO-GENERATED-CONTENT:START (FOOTER) -->
### 📊 Repository Stats
![Profile Views](https://komarev.com/ghpvc/?username=abhishek&color=blue)
![Followers](https://img.shields.io/github/followers/abhishek?style=social)

**Last Updated**: [Auto-generated timestamp]
<!-- AUTO-GENERATED-CONTENT:END -->

<div align="center">

**⭐ Star this repository if you find it helpful!**

[🚀 Try Aithor Now](https://aithor.vercel.app) | [📖 Read the Docs](./docs) | [🤝 Contribute](./CONTRIBUTING.md)

**Made with ❤️ for job seekers worldwide**

</div>
