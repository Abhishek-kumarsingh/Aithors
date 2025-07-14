# Troubleshooting Guide

This guide helps you diagnose and resolve common issues in the InterviewAI platform.

## Quick Diagnostics

### System Health Check

Run these commands to quickly check system status:

```bash
# Check application status
npm run health-check

# Test database connection
npm run db:test

# Verify environment configuration
npm run env:validate

# Test AI providers
npm run ai:test
```

### Common Quick Fixes

1. **Restart the application**
   ```bash
   npm run dev
   ```

2. **Clear cache and reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

3. **Reset database connection**
   ```bash
   npm run db:reset
   ```

## Installation Issues

### Node.js and npm Issues

#### Error: `node: command not found`
**Cause**: Node.js not installed or not in PATH
**Solution**:
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Error: `npm ERR! EACCES: permission denied`
**Cause**: npm permissions issue
**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Error: `Module not found` after installation
**Cause**: Corrupted node_modules or cache
**Solution**:
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
```

### MongoDB Issues

#### Error: `MongoNetworkError: connect ECONNREFUSED`
**Cause**: MongoDB not running or wrong connection string
**Solution**:
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Test connection
mongosh --eval "db.adminCommand('ismaster')"
```

#### Error: `Authentication failed`
**Cause**: Wrong MongoDB credentials
**Solution**:
1. Check MONGODB_URI in .env.local
2. Verify username/password
3. For Atlas: Check network access whitelist

#### Error: `Database connection timeout`
**Cause**: Network issues or slow connection
**Solution**:
```bash
# Add timeout options to connection string
MONGODB_URI=mongodb://localhost:27017/interviewai?connectTimeoutMS=30000&socketTimeoutMS=30000
```

### Environment Configuration Issues

#### Error: `Environment validation failed`
**Cause**: Missing or invalid environment variables
**Solution**:
1. Copy example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in all required variables
3. Validate configuration:
   ```bash
   npm run env:validate
   ```

#### Error: `NEXTAUTH_SECRET is required`
**Cause**: Missing authentication secret
**Solution**:
```bash
# Generate secure secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=generated-secret-here
```

## Authentication Issues

### Google OAuth Issues

#### Error: `redirect_uri_mismatch`
**Cause**: Incorrect redirect URI in Google Console
**Solution**:
1. Go to Google Cloud Console
2. Navigate to Credentials
3. Edit OAuth 2.0 client
4. Add correct redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

#### Error: `invalid_client`
**Cause**: Wrong Google Client ID or Secret
**Solution**:
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
2. Check for extra spaces or characters
3. Regenerate credentials if necessary

### JWT Token Issues

#### Error: `JsonWebTokenError: invalid token`
**Cause**: Corrupted or expired JWT token
**Solution**:
1. Clear browser localStorage
2. Clear cookies
3. Login again
4. Check JWT_SECRET in environment

#### Error: `TokenExpiredError`
**Cause**: JWT token has expired
**Solution**:
1. Implement token refresh logic
2. Increase token expiration time
3. Clear stored tokens and re-login

### Two-Factor Authentication Issues

#### Error: `OTP not received`
**Cause**: Email service configuration issue
**Solution**:
1. Check email service settings in .env.local
2. Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS
3. Test email service:
   ```bash
   npm run email:test
   ```
4. Check spam folder

#### Error: `Invalid OTP`
**Cause**: Wrong OTP or expired code
**Solution**:
1. Request new OTP
2. Check system time synchronization
3. Verify OTP expiration settings

## AI Provider Issues

### Gemini API Issues

#### Error: `API key not valid`
**Cause**: Invalid or missing Gemini API key
**Solution**:
1. Verify API key in .env.local
2. Check API key permissions
3. Ensure Generative AI API is enabled
4. Generate new API key if necessary

#### Error: `Quota exceeded`
**Cause**: API usage limits reached
**Solution**:
1. Check API quotas in Google Cloud Console
2. Enable billing if required
3. Implement rate limiting
4. Use multiple API keys for load balancing

#### Error: `Model not found`
**Cause**: Incorrect model name or unavailable model
**Solution**:
1. Check available models in API documentation
2. Update model name in configuration
3. Use fallback model

### AI Provider Fallback Issues

#### Error: `All AI providers failed`
**Cause**: All configured AI providers are unavailable
**Solution**:
1. Check internet connectivity
2. Verify all API keys
3. Check provider status pages
4. Implement better error handling

## Database Issues

### Connection Issues

#### Error: `MongooseError: Operation buffering timed out`
**Cause**: Database connection timeout
**Solution**:
```bash
# Increase timeout in connection string
MONGODB_URI=mongodb://localhost:27017/interviewai?bufferMaxEntries=0&connectTimeoutMS=30000&socketTimeoutMS=30000
```

#### Error: `MongoError: not master`
**Cause**: Connecting to secondary replica set member
**Solution**:
1. Update connection string to use primary
2. Add `?readPreference=primary` to connection string

### Performance Issues

#### Error: Slow database queries
**Cause**: Missing indexes or inefficient queries
**Solution**:
1. Create database indexes:
   ```bash
   npm run db:create-indexes
   ```
2. Analyze slow queries
3. Optimize query patterns

#### Error: `MongoError: cursor id not found`
**Cause**: Long-running queries or cursor timeout
**Solution**:
1. Implement pagination
2. Reduce query result size
3. Add proper error handling

## Application Performance Issues

### Slow Page Loading

#### Cause: Large bundle size
**Solution**:
1. Analyze bundle size:
   ```bash
   npm run analyze
   ```
2. Implement code splitting
3. Optimize imports
4. Remove unused dependencies

#### Cause: Unoptimized images
**Solution**:
1. Use Next.js Image component
2. Implement lazy loading
3. Optimize image formats
4. Use CDN for static assets

### Memory Issues

#### Error: `JavaScript heap out of memory`
**Cause**: Memory leak or large data processing
**Solution**:
1. Increase Node.js memory limit:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run dev
   ```
2. Implement pagination
3. Optimize data processing
4. Fix memory leaks

## Email Service Issues

### SMTP Issues

#### Error: `Invalid login`
**Cause**: Wrong email credentials or security settings
**Solution**:
1. For Gmail: Use app-specific password
2. Enable "Less secure app access" (not recommended)
3. Check 2FA settings
4. Verify SMTP settings

#### Error: `Connection timeout`
**Cause**: Network or firewall issues
**Solution**:
1. Check firewall settings
2. Try different SMTP ports (587, 465, 25)
3. Test with telnet:
   ```bash
   telnet smtp.gmail.com 587
   ```

### Email Delivery Issues

#### Error: Emails not being delivered
**Cause**: Spam filters or delivery issues
**Solution**:
1. Check spam folder
2. Verify sender reputation
3. Implement SPF, DKIM, DMARC records
4. Use reputable email service

## Frontend Issues

### React/Next.js Issues

#### Error: `Hydration failed`
**Cause**: Server-client mismatch
**Solution**:
1. Check for dynamic content rendering
2. Use `useEffect` for client-only code
3. Implement proper SSR handling

#### Error: `Module not found: Can't resolve`
**Cause**: Import path issues
**Solution**:
1. Check file paths and extensions
2. Verify tsconfig.json paths
3. Clear .next cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Material-UI Issues

#### Error: `useTheme must be used within a ThemeProvider`
**Cause**: Component not wrapped in theme provider
**Solution**:
1. Ensure ThemeProvider wraps the app
2. Check component hierarchy
3. Import theme provider correctly

#### Error: Styling conflicts
**Cause**: CSS specificity or order issues
**Solution**:
1. Use Material-UI's styled API
2. Check CSS import order
3. Use theme overrides

## API Issues

### API Route Issues

#### Error: `API route not found`
**Cause**: Incorrect route path or file structure
**Solution**:
1. Check file naming convention
2. Verify route.ts file structure
3. Check Next.js app directory structure

#### Error: `Method not allowed`
**Cause**: HTTP method not handled in API route
**Solution**:
1. Add proper HTTP method handlers
2. Check request method in frontend
3. Implement proper error handling

### CORS Issues

#### Error: `CORS policy blocked`
**Cause**: Cross-origin request restrictions
**Solution**:
1. Configure CORS headers in API routes
2. Use same-origin requests
3. Implement proper CORS middleware

## Debugging Tools

### Logging

#### Enable debug logging
```bash
# Set log level to debug
LOG_LEVEL=debug npm run dev

# Enable Next.js debug mode
DEBUG=* npm run dev
```

#### Check application logs
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

### Database Debugging

#### MongoDB query profiling
```javascript
// Enable profiling in MongoDB
db.setProfilingLevel(2)

// View slow queries
db.system.profile.find().limit(5).sort({ts:-1}).pretty()
```

### Network Debugging

#### Test API endpoints
```bash
# Test API endpoint
curl -X GET http://localhost:3000/api/health

# Test with authentication
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer your-jwt-token"
```

## Getting Help

### Support Channels

1. **Documentation**: Check relevant documentation files
2. **GitHub Issues**: Search existing issues or create new one
3. **Community Forum**: Ask questions in community discussions
4. **Email Support**: Contact support@interviewai.com

### Information to Include

When reporting issues, include:

1. **Error message**: Complete error message and stack trace
2. **Environment**: OS, Node.js version, npm version
3. **Steps to reproduce**: Detailed steps to reproduce the issue
4. **Configuration**: Relevant environment variables (without secrets)
5. **Logs**: Application logs around the time of the error

### Emergency Contacts

For critical production issues:
- **Email**: emergency@interviewai.com
- **Phone**: +1-XXX-XXX-XXXX (24/7 support)

For additional help, refer to:
- [Installation Guide](./INSTALLATION.md)
- [API Documentation](./API.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Environment Configuration](./ENVIRONMENT.md)
