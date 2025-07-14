import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ModernStatsCard } from '@/components/dashboard/ModernStatsCard';
import { TrendingUp, People } from '@mui/icons-material';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ModernStatsCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: '100',
    icon: <People data-testid="people-icon" />,
    color: 'primary' as const,
  };

  it('renders basic card with title and value', () => {
    renderWithTheme(<ModernStatsCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('people-icon')).toBeInTheDocument();
  });

  it('displays subtitle when provided', () => {
    renderWithTheme(
      <ModernStatsCard {...defaultProps} subtitle="Test Subtitle" />
    );
    
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('shows trend information when provided', () => {
    const trend = {
      value: 15,
      direction: 'up' as const,
      label: 'vs last month'
    };

    renderWithTheme(
      <ModernStatsCard {...defaultProps} trend={trend} />
    );
    
    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('shows negative trend correctly', () => {
    const trend = {
      value: -5,
      direction: 'down' as const,
      label: 'vs last week'
    };

    renderWithTheme(
      <ModernStatsCard {...defaultProps} trend={trend} />
    );
    
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('displays progress bar when progress prop is provided', () => {
    const progress = {
      value: 75,
      max: 100,
      label: 'Completion Rate'
    };

    renderWithTheme(
      <ModernStatsCard {...defaultProps} progress={progress} />
    );
    
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('75/100')).toBeInTheDocument();
  });

  it('shows badge when provided', () => {
    const badge = {
      label: 'New',
      color: 'warning' as const
    };

    renderWithTheme(
      <ModernStatsCard {...defaultProps} badge={badge} />
    );
    
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <ModernStatsCard {...defaultProps} onClick={handleClick} />
    );
    
    const card = screen.getByText('Test Title').closest('.MuiCard-root');
    fireEvent.click(card!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    renderWithTheme(
      <ModernStatsCard {...defaultProps} loading={true} />
    );
    
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('applies glassmorphism variant styles', () => {
    renderWithTheme(
      <ModernStatsCard {...defaultProps} variant="glassmorphism" />
    );
    
    const card = screen.getByText('Test Title').closest('.MuiCard-root');
    expect(card).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    });
  });

  it('applies minimal variant styles', () => {
    renderWithTheme(
      <ModernStatsCard {...defaultProps} variant="minimal" />
    );
    
    const card = screen.getByText('Test Title').closest('.MuiCard-root');
    expect(card).toHaveStyle({
      background: 'transparent'
    });
  });

  it('renders with different color variants', () => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
    
    colors.forEach(color => {
      const { unmount } = renderWithTheme(
        <ModernStatsCard {...defaultProps} color={color} />
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles numeric values correctly', () => {
    renderWithTheme(
      <ModernStatsCard {...defaultProps} value={1234} />
    );
    
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('displays all interactive elements', () => {
    const trend = {
      value: 10,
      direction: 'up' as const,
      label: 'growth'
    };
    
    const progress = {
      value: 80,
      max: 100,
      label: 'Progress'
    };
    
    const badge = {
      label: 'Active',
      color: 'success' as const
    };

    renderWithTheme(
      <ModernStatsCard 
        {...defaultProps}
        subtitle="Test subtitle"
        trend={trend}
        progress={progress}
        badge={badge}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
    expect(screen.getByText('growth')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('80/100')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
