/**
 * Tasks API Routes
 * 
 * Handles all task-related API endpoints:
 * - GET /api/v1/tasks - List all tasks
 * - GET /api/v1/tasks/:id - Get single task
 * - POST /api/v1/tasks - Create task
 * - PUT /api/v1/tasks/:id - Update task
 * - DELETE /api/v1/tasks/:id - Delete task
 */

import { Router, Request, Response } from 'express';
import { TaskService } from '../../../services/TaskService';
import { validateTaskInput } from '../../../middleware/validators';

const tasksRouter = Router();
const taskService = new TaskService();

/**
 * GET /api/v1/tasks
 * List all tasks with optional filtering and pagination
 */
tasksRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = 0, take = 10, status, priority, projectId } = req.query;

    const tasks = await taskService.getTasks({
      skip: Number(skip),
      take: Number(take),
      status: status as string,
      priority: priority as string,
      projectId: projectId as string,
    });

    res.json({
      success: true,
      data: tasks,
      pagination: {
        skip: Number(skip),
        take: Number(take),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/v1/tasks/:id
 * Get a single task by ID
 */
tasksRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/v1/tasks
 * Create a new task
 */
tasksRouter.post('/', validateTaskInput, async (req: Request, res: Response) => {
  try {
    const { title, description, projectId, priority, status } = req.body;

    const task = await taskService.createTask({
      title,
      description,
      projectId,
      priority,
      status,
      createdBy: req.user?.id || 'anonymous',
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/v1/tasks/:id
 * Update an existing task
 */
tasksRouter.put('/:id', validateTaskInput, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await taskService.updateTask(id, updateData);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/v1/tasks/:id
 * Delete a task
 */
tasksRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await taskService.deleteTask(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { tasksRouter };
