/**
 * TaskFlow Backend Server
 * 
 * Main entry point for the TaskFlow backend application.
 * Initializes Express server, middleware, routes, and database connections.
 * 
 * @module backend
 * @version 1.0.0
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Import routes and middleware
import { apiRouter } from './api';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimiter';
import { database } from './database';

/**
 * Initialize and configure Express application
 */
const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Security Middleware
 */
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Performance Middleware
 */
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Logging Middleware
 */
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(requestLogger);

/**
 * Rate Limiting
 */
app.use(rateLimiter);

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

/**
 * API Routes
 */
app.use('/api', apiRouter);

/**
 * Authentication Middleware for Protected Routes
 */
app.use(authMiddleware);

/**
 * WebSocket Connection Handler
 */
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });

  // Example: Task update event
  socket.on('task:update', (data) => {
    io.emit('task:updated', data);
  });

  // Example: Comment event
  socket.on('comment:add', (data) => {
    io.emit('comment:added', data);
  });
});

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error Handler Middleware
 */
app.use(errorHandler);

/**
 * Database Connection
 */
async function initializeDatabase() {
  try {
    await database.initialize();
    console.log('[Database] Connected successfully');
  } catch (error) {
    console.error('[Database] Connection failed:', error);
    process.exit(1);
  }
}

/**
 * Start Server
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                  TaskFlow Backend Server                   ║
╠════════════════════════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(47)}║
║ Port: ${String(PORT).padEnd(55)}║
║ Status: Running ✓${' '.repeat(48)}║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, httpServer, io };
