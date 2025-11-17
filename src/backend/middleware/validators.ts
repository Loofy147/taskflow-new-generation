/**
 * Input Validators Middleware
 * 
 * Validates request input data before processing.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validate task input
 */
export const validateTaskInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority, status } = req.body;

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: {
        title: 'Title is required and must be a non-empty string',
      },
    });
  }

  if (title.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: {
        title: 'Title must be less than 255 characters',
      },
    });
  }

  // Validate priority
  if (priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: {
        priority: 'Priority must be one of: low, medium, high, critical',
      },
    });
  }

  // Validate status
  if (status && !['todo', 'in_progress', 'review', 'completed', 'archived'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: {
        status: 'Status must be one of: todo, in_progress, review, completed, archived',
      },
    });
  }

  next();
};
