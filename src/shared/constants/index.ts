/**
 * Shared Constants
 * 
 * Application-wide constants and configuration values.
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

/**
 * Task Statuses
 */
export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

/**
 * Task Priorities
 */
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Cache Keys
 */
export const CACHE_KEYS = {
  TASKS: 'tasks',
  USERS: 'users',
  PROJECTS: 'projects',
  COMMENTS: 'comments',
  ANALYTICS: 'analytics',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully.',
  TASK_UPDATED: 'Task updated successfully.',
  TASK_DELETED: 'Task deleted successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
} as const;

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'MMMM dd, yyyy HH:mm',
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_COLLABORATION: true,
  ENABLE_AI_SUGGESTIONS: true,
} as const;
