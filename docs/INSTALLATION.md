# Installation & Setup Guide

This comprehensive guide will help you set up the InterviewAI platform on your local development environment or production server.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn** (version 1.22 or higher)
- **MongoDB** (version 5.0 or higher)
- **Git** (for cloning the repository)

### Optional Software
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (for API testing)
- **VS Code** (recommended IDE)

### External Services
- **Google Cloud Console** account (for OAuth and Gemini API)
- **Email service** (Gmail or SMTP server for OTP)
- **DeepSeek API** account (optional, for AI fallback)
- **Anthropic API** account (optional, for Claude AI)

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/interviewai.git
cd interviewai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/interviewai

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here

# Google OAuth & Gemini API
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY_1=your-gemini-api-key-1
GEMINI_API_KEY_2=your-gemini-api-key-2
GEMINI_API_KEY_3=your-gemini-api-key-3
GEMINI_API_KEY_4=your-gemini-api-key-4
GEMINI_API_KEY_5=your-gemini-api-key-5

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start MongoDB

```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is correct in .env.local
```

### 5. Seed the Database

```bash
npm run seed-admin
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with:
- **Email**: `alpsingh03@gmail.com`
- **Password**: `Aa2275aA`

## Detailed Installation

### Step 1: System Requirements

#### Hardware Requirements
- **Minimum**: 4GB RAM, 2 CPU cores, 10GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 20GB storage
- **Production**: 16GB RAM, 8 CPU cores, 50GB storage

#### Operating System Support
- **Windows**: 10/11 (with WSL2 recommended)
- **macOS**: 10.15 or later
- **Linux**: Ubuntu 18.04+, CentOS 7+, or equivalent

### Step 2: Node.js Installation

#### Windows
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: MongoDB Installation

#### Option A: Local MongoDB Installation

##### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service:
```bash
net start MongoDB
```

##### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

##### Linux (Ubuntu)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Configure network access (add your IP)
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in `.env.local`

### Step 4: Google Cloud Setup

#### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   - Google+ API
   - Gmail API (for OAuth)
   - Generative AI API (for Gemini)

#### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in application information:
   - App name: "InterviewAI"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`

#### 3. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Save Client ID and Client Secret

#### 4. Get Gemini API Keys
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create 5 API keys for load balancing
3. Copy all keys to your `.env.local` file

### Step 5: Email Service Setup

#### Option A: Gmail App Password
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings
3. Security > 2-Step Verification > App passwords
4. Generate app password for "Mail"
5. Use this password in `EMAIL_PASS`

#### Option B: Custom SMTP
Update email configuration in `.env.local`:
```bash
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
EMAIL_SECURE=false
```

### Step 6: Project Configuration

#### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/interviewai.git
cd interviewai
npm install
```

#### 2. Environment Configuration
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Complete environment variables:
```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/interviewai

# Authentication Secrets (generate secure random strings)
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-32-character-jwt-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini API Keys (for load balancing)
GEMINI_API_KEY_1=your-gemini-api-key-1
GEMINI_API_KEY_2=your-gemini-api-key-2
GEMINI_API_KEY_3=your-gemini-api-key-3
GEMINI_API_KEY_4=your-gemini-api-key-4
GEMINI_API_KEY_5=your-gemini-api-key-5

# Optional AI Providers
DEEPSEEK_API_KEY=your-deepseek-api-key
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SECURE=false

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security Configuration
BCRYPT_SALT_ROUNDS=12
SESSION_TIMEOUT=86400000
REFRESH_TOKEN_TIMEOUT=2592000000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### 3. Generate Secure Secrets
```bash
# Generate secure random strings for secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7: Database Initialization

#### 1. Create Database Indexes
```bash
npm run create-indexes
```

#### 2. Seed Initial Data
```bash
# Seed admin user and sample data
npm run seed-admin

# Optional: Seed sample questions
npm run seed-questions
```

#### 3. Verify Database Setup
```bash
# Connect to MongoDB and verify collections
mongosh interviewai
> show collections
> db.users.findOne()
```

### Step 8: Development Server

#### 1. Start Development Server
```bash
npm run dev
```

#### 2. Verify Installation
1. Open `http://localhost:3000`
2. Check landing page loads correctly
3. Test admin login:
   - Email: `alpsingh03@gmail.com`
   - Password: `Aa2275aA`
4. Test Google OAuth login
5. Test AI assistant functionality

#### 3. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Step 9: Production Deployment

#### 1. Build Application
```bash
npm run build
```

#### 2. Start Production Server
```bash
npm start
```

#### 3. Environment Variables for Production
Update `.env.local` for production:
```bash
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

#### 2. Google OAuth Error
```bash
Error: redirect_uri_mismatch
```
**Solution**: Add correct redirect URI in Google Console
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

#### 3. Gemini API Error
```bash
Error: API key not valid
```
**Solution**: 
1. Verify API key is correct
2. Ensure Generative AI API is enabled
3. Check API quotas and billing

#### 4. Email Service Error
```bash
Error: Invalid login
```
**Solution**:
1. Enable 2FA on Google account
2. Generate app-specific password
3. Use app password instead of regular password

#### 5. Build Errors
```bash
Error: Module not found
```
**Solution**:
1. Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```
2. Clear Next.js cache
```bash
rm -rf .next
npm run build
```

### Performance Optimization

#### 1. Database Optimization
```bash
# Create compound indexes for better query performance
npm run optimize-db
```

#### 2. Enable Compression
Add to `next.config.js`:
```javascript
module.exports = {
  compress: true,
  // other config
};
```

#### 3. Configure Caching
Set up Redis for session caching (optional):
```bash
# Install Redis
sudo apt-get install redis-server

# Update environment
REDIS_URL=redis://localhost:6379
```

## Next Steps

After successful installation:

1. **Explore the Application**
   - Test all features as admin user
   - Create regular user accounts
   - Test interview functionality

2. **Customize Configuration**
   - Update branding and styling
   - Configure additional AI providers
   - Set up monitoring and logging

3. **Deploy to Production**
   - Follow deployment guide
   - Set up SSL certificates
   - Configure domain and DNS

4. **Monitor and Maintain**
   - Set up error tracking
   - Configure backup strategies
   - Monitor performance metrics

For additional help, refer to:
- [API Documentation](./API.md)
- [Component Architecture](./COMPONENTS.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
