# Development Workflow Guide

This guide outlines the development practices, workflows, and standards for contributing to the InterviewAI platform.

## Development Environment Setup

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Git
- VS Code (recommended)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/interviewai.git
cd interviewai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (API testing)

## Project Structure

### Directory Organization
```
interviewai/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── interview/        # Interview components
│   ├── landing/          # Landing page components
│   ├── practice/         # Practice components
│   ├── shared/           # Shared components
│   ├── ui/               # Base UI components
│   └── user-dashboard/   # User dashboard components
├── lib/                  # Utility libraries
├── models/               # Database models
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/                # Test files
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: kebab-case (e.g., `user-profile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types**: PascalCase with suffix (e.g., `UserTypes.ts`)

## Coding Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// ✅ Good - Explicit interface definitions
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// ❌ Avoid - Any types
const user: any = getUserData();
```

#### Component Props
```typescript
// ✅ Good - Well-defined props interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'medium', 
  disabled = false, 
  onClick, 
  children 
}) => {
  // Component implementation
};
```

#### Error Handling
```typescript
// ✅ Good - Proper error handling
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  console.error('API call failed:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

### React Best Practices

#### Component Structure
```typescript
// ✅ Good - Organized component structure
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/UserTypes';

interface UserCardProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // Hooks
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [user.id]);

  // Event handlers
  const handleEdit = () => {
    setLoading(true);
    onEdit(user);
    setLoading(false);
  };

  // Render
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};
```

#### Custom Hooks
```typescript
// ✅ Good - Reusable custom hook
export const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### API Development

#### API Route Structure
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { User } from '@/models/User';

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user: currentUser } = await requireAuth(request, 'admin');
    const body = await request.json();
    
    const validatedData = createUserSchema.parse(body);
    
    const newUser = await User.create(validatedData);
    
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Git Workflow

### Branch Strategy

#### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features
- **staging**: Pre-production testing

#### Feature Branches
- **feature/**: New features (`feature/user-authentication`)
- **bugfix/**: Bug fixes (`bugfix/login-error`)
- **hotfix/**: Critical production fixes (`hotfix/security-patch`)

### Commit Guidelines

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples
```bash
feat(auth): add Google OAuth integration

- Implement Google OAuth login flow
- Add OAuth callback handling
- Update user model for OAuth data

Closes #123
```

```bash
fix(api): resolve interview submission timeout

- Increase API timeout to 30 seconds
- Add retry logic for failed submissions
- Improve error handling

Fixes #456
```

### Pull Request Process

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

#### Review Process
1. **Self-review**: Review your own code before submitting
2. **Automated checks**: Ensure all CI checks pass
3. **Peer review**: At least one team member review
4. **Testing**: Verify functionality works as expected
5. **Merge**: Squash and merge after approval

## Testing Strategy

### Test Types

#### Unit Tests
```typescript
// __tests__/utils/formatDate.test.ts
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    const formatted = formatDate(date, 'YYYY-MM-DD');
    expect(formatted).toBe('2024-01-15');
  });

  it('should handle invalid dates', () => {
    const result = formatDate(null, 'YYYY-MM-DD');
    expect(result).toBe('Invalid Date');
  });
});
```

#### Component Tests
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

#### API Tests
```typescript
// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/users/route';

describe('/api/users', () => {
  it('should return users list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(Array.isArray(data.users)).toBe(true);
  });
});
```

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests for specific pattern
npm test -- --testNamePattern="should render"
```

## Code Quality

### Linting and Formatting

#### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Pre-commit Hooks

#### Husky Configuration
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

## Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for duplicate dependencies
npm run check-duplicates

# Audit dependencies
npm audit
```

### Code Splitting
```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

const OptimizedImage = () => (
  <Image
    src="/profile.jpg"
    alt="Profile"
    width={200}
    height={200}
    priority
  />
);
```

## Deployment

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm start

# Export static files (if needed)
npm run export
```

### Environment Management
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm run build && npm start

# Testing
NODE_ENV=test npm test
```

## Documentation

### Code Documentation
```typescript
/**
 * Calculates the average score from an array of interview results
 * @param interviews - Array of interview objects with score property
 * @returns The average score rounded to 2 decimal places
 * @throws Error if interviews array is empty
 */
export const calculateAverageScore = (interviews: Interview[]): number => {
  if (interviews.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  
  const total = interviews.reduce((sum, interview) => sum + interview.score, 0);
  return Math.round((total / interviews.length) * 100) / 100;
};
```

### API Documentation
Use JSDoc comments for API endpoints:
```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
```

## Monitoring and Debugging

### Logging
```typescript
// Use structured logging
import { logger } from '@/lib/logger';

logger.info('User login attempt', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack
});
```

### Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: {
    component: 'UserProfile',
    action: 'updateProfile'
  },
  user: {
    id: user.id,
    email: user.email
  }
});
```

For additional information, refer to:
- [API Documentation](./API.md)
- [Component Architecture](./COMPONENTS.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
