/**
 * Error Handler Middleware
 * 
 * Centralized error handling for the application.
 * Catches and formats all errors consistently.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error handler middleware
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  // Unhandled errors
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
};
