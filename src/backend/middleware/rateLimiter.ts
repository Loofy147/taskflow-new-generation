/**
 * Rate Limiter Middleware
 * 
 * Implements rate limiting to prevent abuse.
 * Uses in-memory store for simplicity (use Redis for production).
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // requests per window

/**
 * Rate limiter middleware
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Initialize or get existing record
  if (!store[ip]) {
    store[ip] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  const record = store[ip];

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + WINDOW_MS;
  }

  // Increment counter
  record.count++;

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));
  res.setHeader('X-RateLimit-Reset', record.resetTime);

  // Check limit
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  next();
};
