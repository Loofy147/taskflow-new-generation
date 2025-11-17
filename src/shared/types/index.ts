/**
 * Shared Type Definitions
 * 
 * TypeScript types and interfaces used across frontend and backend.
 */

/**
 * Task type
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId?: string;
  createdBy: string;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  comments?: Comment[];
}

/**
 * Create task input
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'archived';
  createdBy: string;
  dueDate?: Date;
  tags?: string[];
}

/**
 * Update task input
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dueDate?: Date;
  tags?: string[];
}

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project type
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members?: User[];
}

/**
 * Comment type
 */
export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API Response type
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

/**
 * Pagination type
 */
export interface Pagination {
  skip: number;
  take: number;
  total?: number;
}
