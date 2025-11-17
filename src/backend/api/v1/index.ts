/**
 * API v1 Routes
 * 
 * Defines all v1 API endpoints for TaskFlow.
 * Includes routes for tasks, users, projects, comments, and more.
 */

import { Router } from 'express';
import { tasksRouter } from './routes/tasks';
import { usersRouter } from './routes/users';
import { projectsRouter } from './routes/projects';
import { commentsRouter } from './routes/comments';
import { analyticsRouter } from './routes/analytics';

const v1Router = Router();

/**
 * Mount route handlers
 */
v1Router.use('/tasks', tasksRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/projects', projectsRouter);
v1Router.use('/comments', commentsRouter);
v1Router.use('/analytics', analyticsRouter);

/**
 * API v1 Info Endpoint
 */
v1Router.get('/', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      tasks: '/api/v1/tasks',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      comments: '/api/v1/comments',
      analytics: '/api/v1/analytics',
    },
    documentation: 'https://docs.taskflow.io/api/v1',
  });
});

export { v1Router };
