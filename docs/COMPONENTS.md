# Component Architecture Documentation

This document describes the frontend component architecture of the InterviewAI platform, built with Next.js 13, TypeScript, and Material-UI.

## Architecture Overview

The component architecture follows a feature-based organization pattern with clear separation of concerns:

```
components/
├── admin/              # Admin-specific components
├── auth/               # Authentication components
├── interview/          # Interview functionality
├── landing/            # Landing page components
├── practice/           # Practice session components
├── shared/             # Shared/global components
├── ui/                 # Base UI components
└── user-dashboard/     # User dashboard components
```

## Design Principles

### 1. Feature-Based Organization
Components are organized by feature/domain rather than by type, making it easier to locate and maintain related functionality.

### 2. Material-UI First
All components use Material-UI components and theming system for consistent design and accessibility.

### 3. TypeScript Strict Mode
All components are written in TypeScript with strict type checking enabled.

### 4. Responsive Design
Components are built mobile-first with responsive breakpoints using Material-UI's Grid2 system.

### 5. Accessibility
Components follow WCAG 2.1 guidelines and use semantic HTML with proper ARIA attributes.

## Component Categories

### Landing Page Components (`/landing`)

Modern, marketing-focused components for the public-facing website.

#### `modern-ai-header.tsx`
**Purpose**: Main navigation header with authentication links
**Props**: None
**Features**:
- Responsive navigation menu
- Theme toggle integration
- Authentication state awareness
- Mobile hamburger menu

```typescript
interface HeaderProps {
  // No props - uses global auth state
}
```

#### `modern-ai-landing-hero.tsx`
**Purpose**: Hero section with main value proposition
**Props**: None
**Features**:
- Animated text effects
- Call-to-action buttons
- Responsive layout
- Background animations

#### `modern-ai-features.tsx`
**Purpose**: Feature showcase with cards and icons
**Props**: None
**Features**:
- Grid layout of feature cards
- Material-UI icons
- Hover animations
- Responsive grid

#### `modern-ai-testimonials.tsx`
**Purpose**: User testimonials with rotating cards
**Props**: None
**Features**:
- Centered main testimonial
- Rotating side testimonials
- Avatar integration
- Smooth transitions

#### `modern-ai-faq.tsx`
**Purpose**: Frequently asked questions section
**Props**: None
**Features**:
- Side-by-side layout
- Expandable accordion items
- Search functionality
- Category filtering

### Admin Dashboard Components (`/admin`)

Administrative interface components for platform management.

#### `dashboard/DashboardAnalytics.tsx`
**Purpose**: Main admin analytics dashboard
**Props**: None
**Features**:
- Real-time metrics display
- Interactive charts (Recharts)
- System health monitoring
- Export functionality

```typescript
interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalInterviews: number;
  systemHealth: {
    uptime: string;
    responseTime: string;
    errorRate: string;
  };
}
```

#### `dashboard/EnhancedUserManagement.tsx`
**Purpose**: Advanced user management interface
**Props**: None
**Features**:
- User search and filtering
- Bulk actions
- Status management
- Pagination
- Export capabilities

#### `dashboard/ModernStatsCard.tsx`
**Purpose**: Reusable statistics card component
**Props**:
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
```

#### `dashboard/ModernChartCard.tsx`
**Purpose**: Reusable chart container component
**Props**:
```typescript
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  height?: number;
  loading?: boolean;
}
```

### User Dashboard Components (`/user-dashboard`)

User-facing dashboard components for interview management and progress tracking.

#### `TopNavigation.tsx`
**Purpose**: User dashboard navigation header
**Props**: None
**Features**:
- User profile dropdown
- Navigation menu
- Notifications
- Theme toggle
- Logout functionality

#### `PerformanceChart.tsx`
**Purpose**: User performance visualization
**Props**:
```typescript
interface PerformanceChartProps {
  data: PerformanceData[];
  type: 'line' | 'bar' | 'area';
  timeRange: '7d' | '30d' | '90d' | '1y';
}

interface PerformanceData {
  date: string;
  score: number;
  interviews: number;
}
```

#### `ProfileCard.tsx`
**Purpose**: User profile information card
**Props**:
```typescript
interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
    joinDate: string;
  };
  editable?: boolean;
}
```

#### `StatsCard.tsx`
**Purpose**: User statistics display card
**Props**:
```typescript
interface UserStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    period: string;
  };
}
```

#### `InterviewCard.tsx`
**Purpose**: Interview session card component
**Props**:
```typescript
interface InterviewCardProps {
  interview: {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    score?: number;
    duration: number;
    createdAt: string;
    completedAt?: string;
  };
  onStart?: (id: string) => void;
  onView?: (id: string) => void;
}
```

### Feedback Components (`/user-dashboard/feedback`)

Specialized components for displaying interview feedback and analytics.

#### `FeedbackSummaryCard.tsx`
**Purpose**: Overall interview feedback summary
**Props**:
```typescript
interface FeedbackSummaryProps {
  feedback: {
    overallScore: number;
    totalQuestions: number;
    timeSpent: number;
    strengths: string[];
    improvements: string[];
  };
}
```

#### `SkillBreakdownCard.tsx`
**Purpose**: Skill-wise performance breakdown
**Props**:
```typescript
interface SkillBreakdownProps {
  skills: {
    [skillName: string]: {
      score: number;
      questions: number;
      improvement: number;
    };
  };
}
```

#### `RecommendationsCard.tsx`
**Purpose**: AI-generated improvement recommendations
**Props**:
```typescript
interface RecommendationsProps {
  recommendations: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    resources: {
      title: string;
      url: string;
      type: 'article' | 'video' | 'course';
    }[];
  }[];
}
```

### Interview Components (`/interview`)

Components for conducting and managing interviews.

#### `InterviewSetupDialog.tsx`
**Purpose**: Interview configuration modal
**Props**:
```typescript
interface InterviewSetupProps {
  open: boolean;
  onClose: () => void;
  onStart: (config: InterviewConfig) => void;
}

interface InterviewConfig {
  jobRole: string;
  techStack: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  questionCount: number;
}
```

#### `QuestionDisplay.tsx`
**Purpose**: Interview question presentation
**Props**:
```typescript
interface QuestionDisplayProps {
  question: {
    id: string;
    question: string;
    type: 'technical' | 'behavioral' | 'coding';
    timeLimit?: number;
  };
  onAnswer: (answer: string) => void;
  onNext: () => void;
  timeRemaining?: number;
}
```

#### `InterviewTimer.tsx`
**Purpose**: Interview session timer
**Props**:
```typescript
interface InterviewTimerProps {
  duration: number; // Total duration in seconds
  onTimeUp: () => void;
  paused?: boolean;
  showWarning?: boolean; // Show warning at 10% remaining
}
```

### Authentication Components (`/auth`)

Components for user authentication and security.

#### `two-factor-form.tsx`
**Purpose**: Two-factor authentication form
**Props**:
```typescript
interface TwoFactorFormProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
  error?: string;
}
```

### Practice Components (`/practice`)

Components for practice sessions and skill development.

#### `SubmissionDialog.tsx`
**Purpose**: Practice question submission modal
**Props**:
```typescript
interface SubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (answer: string) => void;
  question: {
    id: string;
    question: string;
    timeLimit?: number;
  };
}
```

### Shared Components (`/shared`)

Global components used across multiple features.

#### `mui-theme-provider.tsx`
**Purpose**: Material-UI theme configuration and provider
**Props**:
```typescript
interface MUIThemeProviderProps {
  children: React.ReactNode;
}
```
**Features**:
- Custom theme configuration
- Dark/light mode support
- Typography scale
- Color palette
- Component overrides

#### `responsive-theme-provider.tsx`
**Purpose**: Responsive design utilities and breakpoint management
**Props**:
```typescript
interface ResponsiveThemeProviderProps {
  children: React.ReactNode;
}
```

#### `mode-toggle.tsx`
**Purpose**: Dark/light theme toggle button
**Props**: None
**Features**:
- Theme persistence
- Smooth transitions
- Icon animations
- Accessibility support

#### `profile-dropdown.tsx`
**Purpose**: User profile dropdown menu
**Props**:
```typescript
interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}
```
**Features**:
- User information display
- Navigation links
- Logout functionality
- Settings access

#### `impersonation-wrapper.tsx`
**Purpose**: Admin user impersonation functionality
**Props**:
```typescript
interface ImpersonationWrapperProps {
  children: React.ReactNode;
}
```

#### `aos-provider.tsx`
**Purpose**: Animate On Scroll (AOS) library integration
**Props**:
```typescript
interface AOSProviderProps {
  children: React.ReactNode;
}
```

#### `task-initializer.tsx`
**Purpose**: Application initialization and setup
**Props**:
```typescript
interface TaskInitializerProps {
  children: React.ReactNode;
}
```

### UI Components (`/ui`)

Base UI components and utilities.

#### `LoadingSpinner.tsx`
**Purpose**: Reusable loading spinner component
**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  overlay?: boolean;
}
```

#### `toaster.tsx`
**Purpose**: Toast notification system
**Props**: None
**Features**:
- Multiple notification types
- Auto-dismiss functionality
- Position configuration
- Animation support

#### `use-toast.ts`
**Purpose**: Toast notification hook
**Usage**:
```typescript
const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed successfully",
  variant: "success"
});
```

## Component Patterns and Best Practices

### 1. Props Interface Definition
All components have well-defined TypeScript interfaces for props:

```typescript
// ✅ Good - Clear interface definition
interface ComponentProps {
  title: string;
  optional?: boolean;
  onAction: (data: ActionData) => void;
}

// ❌ Avoid - Any type or no interface
const Component = (props: any) => { ... }
```

### 2. Default Props and Optional Parameters
Use default parameters for optional props:

```typescript
interface CardProps {
  title: string;
  variant?: 'outlined' | 'filled';
  elevation?: number;
}

const Card: React.FC<CardProps> = ({
  title,
  variant = 'outlined',
  elevation = 1
}) => {
  // Component implementation
};
```

### 3. Event Handling Patterns
Consistent event handling with proper typing:

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const Form: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};
```

### 4. Loading and Error States
Components handle loading and error states consistently:

```typescript
interface DataComponentProps {
  data?: DataType;
  loading?: boolean;
  error?: string;
}

const DataComponent: React.FC<DataComponentProps> = ({
  data,
  loading,
  error
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
};
```

### 5. Responsive Design Implementation
Components use Material-UI's responsive utilities:

```typescript
import { useTheme, useMediaQuery } from '@mui/material';

const ResponsiveComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid2 container spacing={isMobile ? 2 : 3}>
      <Grid2 xs={12} md={6}>
        {/* Content */}
      </Grid2>
    </Grid2>
  );
};
```

### 6. Theme Integration
Components integrate with the Material-UI theme system:

```typescript
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));
```

## State Management Patterns

### 1. Local State with useState
For component-specific state:

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<DataType | null>(null);
const [error, setError] = useState<string | null>(null);
```

### 2. Form State with React Hook Form
For form management:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting }
} = useForm<FormData>({
  resolver: zodResolver(formSchema)
});
```

### 3. Global State with Context
For shared application state:

```typescript
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Testing Patterns

### 1. Component Testing
Components include comprehensive tests:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Component from './Component';

describe('Component', () => {
  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <Component {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const onAction = jest.fn();
    renderComponent({ onAction });

    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### 2. Accessibility Testing
Components are tested for accessibility:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = renderComponent();
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Performance Optimization

### 1. Code Splitting
Components use dynamic imports for code splitting:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 2. Memoization
Components use React.memo and useMemo for optimization:

```typescript
const ExpensiveComponent = React.memo<ComponentProps>(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

### 3. Lazy Loading
Components implement lazy loading for images and content:

```typescript
import { LazyLoadImage } from 'react-lazy-load-image-component';

const OptimizedImage: React.FC<ImageProps> = ({ src, alt }) => (
  <LazyLoadImage
    src={src}
    alt={alt}
    effect="blur"
    placeholderSrc="/placeholder.jpg"
  />
);
```
