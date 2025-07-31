interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, [now]);
      return true;
    }

    const clientRequests = this.requests.get(clientId)!;
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    return true;
  }

  getRemainingRequests(clientId: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    if (!this.requests.has(clientId)) {
      return this.config.maxRequests;
    }

    const clientRequests = this.requests.get(clientId)!;
    const validRequests = clientRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    for (const [clientId, requests] of Array.from(this.requests.entries())) {
      const validRequests = requests.filter((time: number) => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, validRequests);
      }
    }
  }
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // Reduced from 100 to 50 requests per minute
});

export const wsRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // Increased to allow normal WebSocket communication
});

// Special rate limiter for paid APIs
export const paidApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // Very conservative for paid APIs
});

// Cleanup old entries every 5 minutes
setInterval(() => {
  apiRateLimiter.cleanup();
  wsRateLimiter.cleanup();
}, 5 * 60 * 1000); 