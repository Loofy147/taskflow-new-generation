import { register, Counter, Histogram, Gauge } from 'prom-client';

// Request metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Database metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

export const dbConnectionPoolSize = new Gauge({
  name: 'db_connection_pool_size',
  help: 'Number of active database connections',
});

// AI metrics
export const aiRequestDuration = new Histogram({
  name: 'ai_request_duration_seconds',
  help: 'Duration of AI API requests',
  labelNames: ['provider', 'model'],
  buckets: [0.5, 1, 2, 5, 10],
});

export const aiTokensUsed = new Counter({
  name: 'ai_tokens_used_total',
  help: 'Total tokens used in AI API calls',
  labelNames: ['provider', 'model'],
});

// Custom metrics
export const tasksCreated = new Counter({
  name: 'tasks_created_total',
  help: 'Total tasks created',
});

export const commentsCreated = new Counter({
  name: 'comments_created_total',
  help: 'Total comments created',
});

export const timeTracked = new Counter({
  name: 'time_tracked_seconds_total',
  help: 'Total seconds of time tracked',
});

export const metricsRegister = register;
