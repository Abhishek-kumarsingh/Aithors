import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calculate percentage score
 */
export function calculateScore(correct: number, total: number, decimals: number = 0): number {
  if (total === 0 || correct < 0) return 0

  const percentage = (correct / total) * 100
  return Number(percentage.toFixed(decimals))
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && !email.includes('..')
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, format: 'default' | 'full' | 'short' = 'default'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    switch (format) {
      case 'full':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      case 'short':
        return dateObj.toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        })
      default:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
    }
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (!text) return ''
  if (maxLength <= 0) return ellipsis
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T, seen = new WeakMap()): T {
  // Handle primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Handle circular references
  if (seen.has(obj as any)) {
    return seen.get(obj as any)
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    const clonedArray: any[] = []
    seen.set(obj as any, clonedArray)

    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], seen)
    }

    return clonedArray as T
  }

  // Handle Objects
  const clonedObj: any = {}
  seen.set(obj as any, clonedObj)

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], seen)
    }
  }

  return clonedObj as T
}
