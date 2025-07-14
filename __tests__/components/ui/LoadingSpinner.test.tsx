import { render, screen } from '../../utils/test-utils'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner with default props', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size={60} />)
    
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveStyle({ width: '60px', height: '60px' })
  })

  it('renders with custom message', () => {
    const message = 'Loading your data...'
    render(<LoadingSpinner message={message} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('renders centered when specified', () => {
    render(<LoadingSpinner centered />)
    
    const container = screen.getByTestId('loading-spinner-container')
    expect(container).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    })
  })

  it('applies custom className', () => {
    const customClass = 'custom-spinner'
    render(<LoadingSpinner className={customClass} />)
    
    const container = screen.getByTestId('loading-spinner-container')
    expect(container).toHaveClass(customClass)
  })

  it('renders with overlay when specified', () => {
    render(<LoadingSpinner overlay />)
    
    const container = screen.getByTestId('loading-spinner-container')
    expect(container).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
    })
  })
})
