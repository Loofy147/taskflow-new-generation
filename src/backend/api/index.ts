/**
 * API Router
 * 
 * Main API router that aggregates all API version routes.
 * Currently supports v1 API endpoints.
 */

import { Router } from 'express';
import { v1Router } from './v1';

const apiRouter = Router();

/**
 * API v1 Routes
 */
apiRouter.use('/v1', v1Router);

/**
 * API Status Endpoint
 */
apiRouter.get('/status', (req, res) => {
  res.json({
    api: 'TaskFlow API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

export { apiRouter };
