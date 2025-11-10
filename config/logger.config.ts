/**
 * Pino Logger Configuration
 * Structured logging for backend services
 * Phase 1: Database & Monitoring Implementation
 */

import pino from "pino";
import type { Logger } from "pino";

/**
 * Environment variables for logging configuration
 */
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const LOG_FORMAT = process.env.LOG_FORMAT || "json";
const NODE_ENV = process.env.NODE_ENV || "development";
const LOG_RETENTION_DAYS = parseInt(process.env.LOG_RETENTION_DAYS || "30");

/**
 * Create Pino logger instance with appropriate configuration
 */
export function createLogger(name: string): Logger {
  const isDevelopment = NODE_ENV === "development";

  const loggerConfig = {
    level: LOG_LEVEL,
    // Pretty print in development, JSON in production
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
            singleLine: false,
          },
        }
      : undefined,
    // Structured logging configuration
    base: {
      service: name,
      environment: NODE_ENV,
      version: process.env.APP_VERSION || "unknown",
    },
    // Timestamp configuration
    timestamp: pino.stdTimeFunctions.isoTime,
    // Error serialization
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  };

  return pino(loggerConfig);
}

/**
 * Global logger instance
 */
export const logger = createLogger("taskflow-backend");

/**
 * Logger middleware for Express
 */
export function loggerMiddleware(req: any, res: any, next: any) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?.id,
        teamId: req.user?.teamId,
      },
      "HTTP Request"
    );
  });

  next();
}

/**
 * Log database query
 */
export function logDatabaseQuery(
  query: string,
  params: any[],
  duration: number,
  error?: Error
) {
  if (error) {
    logger.error(
      {
        query,
        params,
        duration: `${duration}ms`,
        error: error.message,
      },
      "Database Query Failed"
    );
  } else {
    logger.debug(
      {
        query,
        params,
        duration: `${duration}ms`,
      },
      "Database Query"
    );
  }
}

/**
 * Log API error
 */
export function logApiError(
  error: Error,
  context: {
    endpoint: string;
    method: string;
    userId?: string;
    teamId?: string;
    statusCode?: number;
  }
) {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
      ...context,
    },
    "API Error"
  );
}

/**
 * Log authentication event
 */
export function logAuthEvent(
  event: "login" | "logout" | "signup" | "password_reset",
  userId: string,
  metadata?: any
) {
  logger.info(
    {
      event,
      userId,
      ...metadata,
    },
    `Authentication: ${event}`
  );
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  details: any
) {
  const logFn = severity === "critical" ? logger.error : logger.warn;
  logFn(
    {
      event,
      severity,
      ...details,
    },
    `Security Event: ${event}`
  );
}

/**
 * Log performance metric
 */
export function logPerformanceMetric(
  metric: string,
  value: number,
  unit: string,
  threshold?: number
) {
  const exceeded = threshold && value > threshold;
  const level = exceeded ? "warn" : "info";

  logger[level](
    {
      metric,
      value,
      unit,
      threshold,
      exceeded,
    },
    `Performance Metric: ${metric}`
  );
}

/**
 * Log task event
 */
export function logTaskEvent(
  event: "created" | "updated" | "completed" | "deleted",
  taskId: string,
  userId: string,
  metadata?: any
) {
  logger.info(
    {
      event,
      taskId,
      userId,
      ...metadata,
    },
    `Task Event: ${event}`
  );
}

/**
 * Log team event
 */
export function logTeamEvent(
  event: "created" | "updated" | "member_added" | "member_removed",
  teamId: string,
  userId: string,
  metadata?: any
) {
  logger.info(
    {
      event,
      teamId,
      userId,
      ...metadata,
    },
    `Team Event: ${event}`
  );
}

/**
 * Log configuration
 */
export const loggerConfig = {
  level: LOG_LEVEL,
  format: LOG_FORMAT,
  retention: LOG_RETENTION_DAYS,
  environment: NODE_ENV,
};

export default logger;
