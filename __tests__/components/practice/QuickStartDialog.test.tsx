import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { QuickStartDialog } from '../../../components/practice/QuickStartDialog'

// Mock the motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('QuickStartDialog', () => {
  const mockOnClose = jest.fn()
  const mockOnStart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onStart: mockOnStart,
  }

  it('renders dialog when open', () => {
    render(<QuickStartDialog {...defaultProps} />)
    
    expect(screen.getByText('Quick Start Practice')).toBeInTheDocument()
    expect(screen.getByText('Choose Your Path')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<QuickStartDialog {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Quick Start Practice')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('shows preset configurations', () => {
    render(<QuickStartDialog {...defaultProps} />)
    
    expect(screen.getByText('Quick Start Presets')).toBeInTheDocument()
    expect(screen.getByText('Frontend Focus')).toBeInTheDocument()
    expect(screen.getByText('Backend Mastery')).toBeInTheDocument()
    expect(screen.getByText('Full Stack Challenge')).toBeInTheDocument()
  })

  it('allows selecting a preset', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    const frontendPreset = screen.getByText('Frontend Focus')
    await user.click(frontendPreset)
    
    // Should advance to next step
    expect(screen.getByText('Review & Start')).toBeInTheDocument()
  })

  it('allows custom configuration', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    const customButton = screen.getByText('Custom Configuration')
    await user.click(customButton)
    
    // Should advance to configuration step
    expect(screen.getByText('Configure Your Practice Session')).toBeInTheDocument()
  })

  it('shows domain selection in custom configuration', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Go to custom configuration
    const customButton = screen.getByText('Custom Configuration')
    await user.click(customButton)
    
    expect(screen.getByLabelText('Domain')).toBeInTheDocument()
    expect(screen.getByText('Question Type')).toBeInTheDocument()
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument()
  })

  it('allows changing domain selection', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Go to custom configuration
    const customButton = screen.getByText('Custom Configuration')
    await user.click(customButton)
    
    // Open domain dropdown
    const domainSelect = screen.getByLabelText('Domain')
    await user.click(domainSelect)
    
    // Select backend
    const backendOption = screen.getByText('Backend Development')
    await user.click(backendOption)
    
    expect(domainSelect).toHaveValue('backend')
  })

  it('allows adjusting question count with slider', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Go to custom configuration
    const customButton = screen.getByText('Custom Configuration')
    await user.click(customButton)
    
    const questionSlider = screen.getByRole('slider', { name: /number of questions/i })
    expect(questionSlider).toBeInTheDocument()
    
    // Change slider value
    fireEvent.change(questionSlider, { target: { value: '15' } })
    expect(screen.getByText('Number of Questions: 15')).toBeInTheDocument()
  })

  it('allows adjusting time limit with slider', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Go to custom configuration
    const customButton = screen.getByText('Custom Configuration')
    await user.click(customButton)
    
    const timeSlider = screen.getByRole('slider', { name: /time limit/i })
    expect(timeSlider).toBeInTheDocument()
    
    // Change slider value
    fireEvent.change(timeSlider, { target: { value: '45' } })
    expect(screen.getByText('Time Limit: 45 minutes')).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(<QuickStartDialog {...defaultProps} />)
    
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('disables back button on first step', () => {
    render(<QuickStartDialog {...defaultProps} />)
    
    const backButton = screen.getByText('Back')
    expect(backButton).toBeDisabled()
  })

  it('calls onStart when start button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Select a preset to get to final step
    const frontendPreset = screen.getByText('Frontend Focus')
    await user.click(frontendPreset)
    
    // Click start button
    const startButton = screen.getByText('Start Practice')
    await user.click(startButton)
    
    expect(mockOnStart).toHaveBeenCalledTimes(1)
    expect(mockOnStart).toHaveBeenCalledWith(expect.objectContaining({
      domain: expect.any(String),
      type: expect.any(String),
      difficulty: expect.any(String),
    }))
  })

  it('shows stepper with correct steps', () => {
    render(<QuickStartDialog {...defaultProps} />)
    
    expect(screen.getByText('Choose Your Path')).toBeInTheDocument()
    expect(screen.getByText('Configure')).toBeInTheDocument()
    expect(screen.getByText('Review & Start')).toBeInTheDocument()
  })

  it('shows configuration summary in review step', async () => {
    const user = userEvent.setup()
    render(<QuickStartDialog {...defaultProps} />)
    
    // Select a preset to get to review step
    const frontendPreset = screen.getByText('Frontend Focus')
    await user.click(frontendPreset)
    
    // Should show configuration summary
    expect(screen.getByText('Domain')).toBeInTheDocument()
    expect(screen.getByText('Question Type')).toBeInTheDocument()
    expect(screen.getByText('Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
    expect(screen.getByText('Time Limit')).toBeInTheDocument()
  })
})
