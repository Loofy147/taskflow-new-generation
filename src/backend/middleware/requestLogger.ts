/**
 * Request Logger Middleware
 * 
 * Logs incoming HTTP requests with details.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
