import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SessionProvider } from 'next-auth/react'

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

// Mock session data
const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  },
  expires: '2024-12-31',
}

interface AllTheProvidersProps {
  children: React.ReactNode
  session?: any
}

const AllTheProviders = ({ children, session = mockSession }: AllTheProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={testTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any
}

const customRender = (
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {}
) =>
  render(ui, {
    wrapper: (props) => <AllTheProviders {...props} session={session} />,
    ...options,
  })

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  })
}

// Mock fetch for API calls
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn(() => mockApiResponse(response, status)) as jest.Mock
}

// Mock user interactions
export const mockUserEvent = {
  click: jest.fn(),
  type: jest.fn(),
  clear: jest.fn(),
  selectOptions: jest.fn(),
  upload: jest.fn(),
}

// Mock interview data
export const mockInterview = {
  id: 'test-interview-id',
  title: 'Test Interview',
  description: 'A test interview for testing purposes',
  domain: 'frontend',
  subDomain: 'react',
  level: 'intermediate',
  status: 'scheduled',
  type: 'technical',
  questions: [
    {
      question: 'What is React?',
      answer: '',
      feedback: '',
    },
    {
      question: 'Explain useState hook',
      answer: '',
      feedback: '',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock practice session data
export const mockPracticeSession = {
  id: 'test-session-id',
  userId: 'test-user-id',
  sessionType: 'practice',
  title: 'Test Practice Session',
  config: {
    domain: 'frontend',
    difficulty: 'medium',
    questionTypes: ['mcq', 'coding'],
    totalQuestions: 10,
    timeLimit: 60,
    isTimerEnabled: true,
    shuffleQuestions: true,
  },
  questions: [],
  progress: {
    currentQuestionIndex: 0,
    questionsCompleted: 0,
    questionsCorrect: 0,
    totalTimeSpent: 0,
    isCompleted: false,
    isPaused: false,
    pauseDuration: 0,
  },
  results: {
    totalScore: 0,
    maxScore: 100,
    percentage: 0,
    grade: 'F',
    timeEfficiency: 0,
    accuracyRate: 0,
    strengthAreas: [],
    weaknessAreas: [],
  },
  status: 'not_started',
  isCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  profile: {
    bio: 'Test user bio',
    skills: ['React', 'JavaScript', 'TypeScript'],
    experience: 'intermediate',
    location: 'Test City',
  },
  stats: {
    totalInterviews: 5,
    completedInterviews: 3,
    averageScore: 85,
    totalPracticeTime: 120,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock admin user
export const mockAdminUser = {
  ...mockUser,
  role: 'admin',
  email: 'admin@example.com',
}

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

export const createMockComponent = (name: string) => {
  const MockComponent = ({ children, ...props }: any) => (
    <div data-testid={`mock-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  )
  MockComponent.displayName = `Mock${name}`
  return MockComponent
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
export { testTheme, mockSession }
