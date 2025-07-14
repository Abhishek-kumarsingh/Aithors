import {
  formatTime,
  calculateScore,
  validateEmail,
  generateId,
  formatDate,
  truncateText,
  debounce,
  deepClone,
} from '../../lib/utils'

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(65)).toBe('01:05')
      expect(formatTime(120)).toBe('02:00')
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(3661)).toBe('61:01') // Over an hour
    })

    it('should handle negative values', () => {
      expect(formatTime(-10)).toBe('00:00')
    })
  })

  describe('calculateScore', () => {
    it('should calculate percentage score correctly', () => {
      expect(calculateScore(8, 10)).toBe(80)
      expect(calculateScore(0, 10)).toBe(0)
      expect(calculateScore(10, 10)).toBe(100)
    })

    it('should handle edge cases', () => {
      expect(calculateScore(5, 0)).toBe(0) // Division by zero
      expect(calculateScore(-1, 10)).toBe(0) // Negative correct answers
    })

    it('should round to specified decimal places', () => {
      expect(calculateScore(7, 9, 2)).toBe(77.78)
      expect(calculateScore(1, 3, 1)).toBe(33.3)
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test..test@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })

    it('should generate IDs of specified length', () => {
      const shortId = generateId(8)
      const longId = generateId(32)
      
      expect(shortId.length).toBe(8)
      expect(longId.length).toBe(32)
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      
      expect(formatDate(date)).toBe('Jan 15, 2024')
      expect(formatDate(date, 'full')).toBe('January 15, 2024')
      expect(formatDate(date, 'short')).toBe('1/15/24')
    })

    it('should handle string dates', () => {
      const dateString = '2024-01-15T10:30:00Z'
      expect(formatDate(dateString)).toBe('Jan 15, 2024')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date')
      expect(formatDate(null as any)).toBe('Invalid Date')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('should handle custom ellipsis', () => {
      const text = 'This is a long text'
      expect(truncateText(text, 10, ' [more]')).toBe('This is a [more]')
    })

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('')
      expect(truncateText('Test', 0)).toBe('...')
      expect(truncateText('Test', -1)).toBe('...')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should reset timer on subsequent calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      jest.advanceTimersByTime(50)
      debouncedFn()
      jest.advanceTimersByTime(50)

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(50)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('string')).toBe('string')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('should clone arrays', () => {
      const original = [1, 2, [3, 4]]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[2]).not.toBe(original[2])
    })

    it('should clone objects', () => {
      const original = {
        name: 'Test',
        nested: {
          value: 42,
          array: [1, 2, 3],
        },
      }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.nested).not.toBe(original.nested)
      expect(cloned.nested.array).not.toBe(original.nested.array)
    })

    it('should handle dates', () => {
      const date = new Date('2024-01-15')
      const cloned = deepClone(date)

      expect(cloned).toEqual(date)
      expect(cloned).not.toBe(date)
      expect(cloned instanceof Date).toBe(true)
    })

    it('should handle circular references', () => {
      const obj: any = { name: 'test' }
      obj.self = obj

      const cloned = deepClone(obj)
      expect(cloned.name).toBe('test')
      expect(cloned.self).toBe(cloned)
    })
  })
})
