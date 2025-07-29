/**
 * Simple in-memory OTP storage for development and production
 * In production, consider using Redis or a database for persistence
 */

interface OTPData {
  code: string;
  expires: number;
  attempts: number;
}

class OTPStorage {
  private storage: Map<string, OTPData> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired OTPs every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Store an OTP for an email
   */
  set(email: string, data: OTPData): void {
    this.storage.set(email.toLowerCase(), data);
  }

  /**
   * Get OTP data for an email
   */
  get(email: string): OTPData | undefined {
    return this.storage.get(email.toLowerCase());
  }

  /**
   * Delete OTP data for an email
   */
  delete(email: string): boolean {
    return this.storage.delete(email.toLowerCase());
  }

  /**
   * Check if OTP exists for an email
   */
  has(email: string): boolean {
    return this.storage.has(email.toLowerCase());
  }

  /**
   * Clean up expired OTPs
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredEmails: string[] = [];

    this.storage.forEach((data, email) => {
      if (now > data.expires) {
        expiredEmails.push(email);
      }
    });

    expiredEmails.forEach(email => {
      this.storage.delete(email);
    });
  }

  /**
   * Get all entries (for debugging/testing)
   */
  entries(): IterableIterator<[string, OTPData]> {
    return this.storage.entries();
  }

  /**
   * Get the size of the storage
   */
  get size(): number {
    return this.storage.size;
  }

  /**
   * Get storage statistics
   */
  getStats(): { total: number; expired: number } {
    const now = Date.now();
    let expired = 0;

    this.storage.forEach((data) => {
      if (now > data.expires) {
        expired++;
      }
    });

    return {
      total: this.storage.size,
      expired
    };
  }

  /**
   * Clear all OTPs (for testing)
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.storage.clear();
  }
}

// Export a singleton instance
export const otpStorage = new OTPStorage();

// Cleanup on process exit
process.on('SIGINT', () => {
  otpStorage.destroy();
});

process.on('SIGTERM', () => {
  otpStorage.destroy();
});
