# Environment Configuration Guide

This document provides detailed information about all environment variables used in the InterviewAI platform.

## Environment Files

### Development Environment
- **File**: `.env.local`
- **Purpose**: Local development configuration
- **Git Tracking**: Not tracked (in .gitignore)

### Production Environment
- **File**: `.env.production`
- **Purpose**: Production deployment configuration
- **Security**: Secure storage required

### Example Environment
- **File**: `.env.example`
- **Purpose**: Template for environment setup
- **Git Tracking**: Tracked for reference

## Required Environment Variables

### Database Configuration

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/interviewai
# Production example: mongodb+srv://user:pass@cluster.mongodb.net/interviewai
```

**Description**: MongoDB connection string
**Required**: Yes
**Format**: MongoDB URI format
**Example Values**:
- Local: `mongodb://localhost:27017/interviewai`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Authentication Configuration

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-32-character-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-32-character-jwt-secret-here
```

**NEXTAUTH_SECRET**:
- **Description**: Secret key for NextAuth.js session encryption
- **Required**: Yes
- **Format**: Minimum 32 characters, random string
- **Generation**: `openssl rand -base64 32`

**NEXTAUTH_URL**:
- **Description**: Base URL of your application
- **Required**: Yes
- **Format**: Full URL with protocol
- **Examples**: 
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

**JWT_SECRET**:
- **Description**: Secret key for JWT token signing
- **Required**: Yes
- **Format**: Minimum 32 characters, random string
- **Security**: Must be different from NEXTAUTH_SECRET

### Google OAuth Configuration

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Setup Instructions**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### AI Provider Configuration

```bash
# Google Gemini API Keys (Load Balancing)
GEMINI_API_KEY_1=your-gemini-api-key-1
GEMINI_API_KEY_2=your-gemini-api-key-2
GEMINI_API_KEY_3=your-gemini-api-key-3
GEMINI_API_KEY_4=your-gemini-api-key-4
GEMINI_API_KEY_5=your-gemini-api-key-5

# Optional AI Providers
DEEPSEEK_API_KEY=your-deepseek-api-key
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
```

**Gemini API Keys**:
- **Description**: Google Gemini API keys for load balancing
- **Required**: At least GEMINI_API_KEY_1 is required
- **Setup**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Load Balancing**: System automatically rotates between available keys

**Optional AI Providers**:
- **DeepSeek**: Fallback AI provider
- **Anthropic**: Claude AI for advanced reasoning
- **OpenAI**: GPT models for additional capabilities

### Email Service Configuration

```bash
# Email Service (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SECURE=false
EMAIL_FROM=InterviewAI <noreply@yourdomain.com>
```

**Gmail Setup**:
1. Enable 2-factor authentication
2. Generate app-specific password
3. Use app password in EMAIL_PASS

**Custom SMTP Setup**:
- Update EMAIL_HOST and EMAIL_PORT
- Set EMAIL_SECURE=true for SSL/TLS
- Configure authentication credentials

## Optional Environment Variables

### Application Configuration

```bash
# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InterviewAI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Security Configuration

```bash
# Security Settings
BCRYPT_SALT_ROUNDS=12
SESSION_TIMEOUT=86400000
REFRESH_TOKEN_TIMEOUT=2592000000
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

**BCRYPT_SALT_ROUNDS**:
- **Description**: Number of salt rounds for password hashing
- **Default**: 12
- **Range**: 10-15 (higher = more secure but slower)

**SESSION_TIMEOUT**:
- **Description**: Session timeout in milliseconds
- **Default**: 86400000 (24 hours)
- **Format**: Milliseconds

### Rate Limiting Configuration

```bash
# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
AI_RATE_LIMIT_MAX=20
```

**RATE_LIMIT_WINDOW**:
- **Description**: Time window for rate limiting in milliseconds
- **Default**: 900000 (15 minutes)

**RATE_LIMIT_MAX_REQUESTS**:
- **Description**: Maximum requests per window
- **Default**: 100

### File Upload Configuration

```bash
# File Upload Settings
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt
UPLOAD_DIR=uploads
```

**MAX_FILE_SIZE**:
- **Description**: Maximum file size in bytes
- **Default**: 10485760 (10MB)
- **Format**: Bytes

### Logging Configuration

```bash
# Logging Settings
LOG_LEVEL=info
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10485760
LOG_MAX_FILES=5
```

**LOG_LEVEL**:
- **Options**: error, warn, info, debug
- **Default**: info
- **Production**: warn or error

### Redis Configuration (Optional)

```bash
# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

### Monitoring Configuration

```bash
# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

## Environment Validation

### Validation Schema

The application validates environment variables on startup:

```typescript
const envSchema = z.object({
  // Required variables
  MONGODB_URI: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GEMINI_API_KEY_1: z.string().min(1),
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.string().regex(/^\d+$/),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  
  // Optional variables with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BCRYPT_SALT_ROUNDS: z.string().regex(/^\d+$/).default('12'),
  SESSION_TIMEOUT: z.string().regex(/^\d+$/).default('86400000'),
});
```

### Validation Errors

Common validation errors and solutions:

1. **NEXTAUTH_SECRET too short**
   - Generate: `openssl rand -base64 32`

2. **Invalid NEXTAUTH_URL**
   - Must include protocol (http:// or https://)

3. **Invalid email format**
   - EMAIL_USER must be valid email address

4. **Missing required variables**
   - Check .env.local file exists and contains all required variables

## Environment Setup Scripts

### Generate Secrets Script

```bash
#!/bin/bash
# generate-secrets.sh

echo "Generating secure secrets for InterviewAI..."

echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"
```

### Environment Checker Script

```bash
#!/bin/bash
# check-env.sh

echo "Checking environment configuration..."

required_vars=(
  "MONGODB_URI"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
  "JWT_SECRET"
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
  "GEMINI_API_KEY_1"
  "EMAIL_HOST"
  "EMAIL_USER"
  "EMAIL_PASS"
)

missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
  echo "✅ All required environment variables are set"
else
  echo "❌ Missing required environment variables:"
  printf '%s\n' "${missing_vars[@]}"
  exit 1
fi
```

## Security Best Practices

### Secret Management

1. **Never commit secrets to version control**
2. **Use different secrets for different environments**
3. **Rotate secrets regularly**
4. **Use secure secret management services in production**

### Environment File Security

1. **Restrict file permissions**: `chmod 600 .env.local`
2. **Use encrypted storage in production**
3. **Audit access to environment files**
4. **Monitor for secret exposure**

### Production Considerations

1. **Use environment variables instead of files**
2. **Implement secret rotation**
3. **Use managed services for secrets**
4. **Monitor for configuration drift**

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Check file name (.env.local)
   - Restart development server
   - Verify file location (project root)

2. **Invalid MongoDB URI**
   - Check connection string format
   - Verify database credentials
   - Test connection manually

3. **Google OAuth errors**
   - Verify redirect URIs
   - Check client ID and secret
   - Ensure APIs are enabled

4. **Email service failures**
   - Test SMTP credentials
   - Check firewall settings
   - Verify app password for Gmail

### Debug Commands

```bash
# Check environment variables
npm run env:check

# Test database connection
npm run db:test

# Test email service
npm run email:test

# Validate all configurations
npm run config:validate
```

For additional help, refer to:
- [Installation Guide](./INSTALLATION.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
