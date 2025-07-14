# Testing Guide for InterviewAI

## Overview

This project uses Jest and React Testing Library for comprehensive testing of components, utilities, and API endpoints.

## Setup

### Dependencies Installed
- `jest` - Testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM elements
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for testing
- `mongodb-memory-server` - In-memory MongoDB for testing
- `node-mocks-http` - HTTP request/response mocking
- `bcryptjs` - Password hashing (for API tests)
- `identity-obj-proxy` - CSS module mocking

### Configuration Files
- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Global test setup and mocks
- `__tests__/utils/test-utils.tsx` - Custom render utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci

# Run specific test file
npm test -- --testPathPattern=simple.test.ts
```

## Test Structure

### Directory Structure
```
__tests__/
├── utils/
│   └── test-utils.tsx          # Custom testing utilities
├── components/
│   ├── ui/
│   │   └── LoadingSpinner.test.tsx
│   ├── dashboard/
│   │   └── ModernStatsCard.test.tsx
│   └── practice/
│       └── QuickStartDialog.test.tsx
├── lib/
│   ├── utils.test.ts           # Utility function tests
│   ├── models/
│   │   └── PracticeQuestion.test.ts
│   └── utils/
│       └── dashboardUtils.test.ts
├── api/
│   ├── auth.test.ts            # Authentication API tests
│   └── dashboard/
│       └── overview.test.ts
└── simple.test.ts              # Basic functionality tests
```

## Test Categories

### 1. Unit Tests
- **Utility Functions** (`lib/utils.test.ts`)
  - String manipulation
  - Date formatting
  - Validation functions
  - Mathematical calculations

### 2. Component Tests
- **UI Components** (`components/ui/`)
  - LoadingSpinner
  - Buttons, Cards, Modals
- **Dashboard Components** (`components/dashboard/`)
  - Stats cards
  - Charts and graphs
- **Practice Components** (`components/practice/`)
  - Question dialogs
  - Practice sessions

### 3. API Tests
- **Authentication** (`api/auth.test.ts`)
  - User registration
  - Login/logout
  - Session management
- **Dashboard APIs** (`api/dashboard/`)
  - Data fetching
  - Statistics calculation

### 4. Database Model Tests
- **Mongoose Models** (`lib/models/`)
  - Schema validation
  - Instance methods
  - Static methods
  - Virtual properties

## Testing Utilities

### Custom Render Function
```typescript
import { render } from '__tests__/utils/test-utils'

// Renders component with Material UI theme and session providers
render(<YourComponent />)
```

### Mock Data
The test utilities provide mock data for:
- User sessions
- Interview data
- Practice sessions
- API responses

### Common Test Patterns

#### Component Testing
```typescript
import { render, screen, fireEvent } from '__tests__/utils/test-utils'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

#### API Testing
```typescript
import { createMocks } from 'node-mocks-http'

describe('/api/endpoint', () => {
  it('should handle POST requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { data: 'test' }
    })

    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
  })
})
```

#### Database Model Testing
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

describe('Model', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })
})
```

## Current Status

### ✅ Working
- Basic Jest configuration
- Simple unit tests
- Test utilities setup
- Mock configurations
- Some component tests (with warnings)

### ⚠️ Known Issues
1. **Material UI Import Issues**
   - CssBaseline component import problems
   - Need to fix import statements in test-utils.tsx

2. **MongoDB ES Module Issues**
   - BSON module export problems
   - Need to configure Jest to handle ES modules properly

3. **Path Resolution**
   - Some @ path aliases not resolving correctly
   - Need to verify tsconfig.json paths

### 🔧 Fixes Needed

#### For Material UI Issues:
```typescript
// In test-utils.tsx, try:
import { CssBaseline } from '@mui/material/CssBaseline'
// or
import CssBaseline from '@mui/material/CssBaseline'
```

#### For MongoDB Issues:
```javascript
// In jest.config.js, add:
extensionsToTreatAsEsm: ['.ts'],
globals: {
  'ts-jest': {
    useESM: true
  }
}
```

#### For Path Resolution:
```javascript
// Verify moduleNameMapping in jest.config.js matches tsconfig.json paths
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Mock External Dependencies**: Use mocks for APIs, databases, and external services
4. **Test User Behavior**: Focus on testing what users actually do
5. **Coverage Goals**: Aim for 70%+ coverage on critical paths
6. **Async Testing**: Properly handle async operations with await/waitFor

## Coverage Reports

Coverage reports are generated in the `coverage/` directory when running:
```bash
npm run test:coverage
```

View the HTML report at `coverage/lcov-report/index.html`

## Debugging Tests

### Common Issues
1. **Component not rendering**: Check import paths and mock configurations
2. **Async operations failing**: Use `waitFor` or `findBy` queries
3. **Material UI warnings**: Ensure proper theme provider setup
4. **Database connection issues**: Verify MongoDB memory server setup

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file with debugging
npm test -- --testPathPattern=filename.test.ts --verbose

# Clear Jest cache
npx jest --clearCache
```

## Next Steps

1. Fix Material UI import issues in test utilities
2. Configure Jest for MongoDB ES modules
3. Add more comprehensive component tests
4. Implement integration tests
5. Set up continuous integration testing
6. Add visual regression testing for UI components
