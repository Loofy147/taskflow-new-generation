# TaskFlow System Design

This document describes the overall system architecture, design patterns, and key architectural decisions for TaskFlow.

## Architecture Overview

TaskFlow follows a modern three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│              React 19 Frontend Application                   │
│  Dashboard | Tasks | Projects | Team | Analytics | Settings │
└────────────────────────┬────────────────────────────────────┘
                         │
                    tRPC Gateway
                    (/api/trpc)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Application Layer                         │
│              Node.js/Express Backend Services                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         tRPC Routers (Type-Safe APIs)                │   │
│  │  Auth | Tasks | Projects | Teams | Comments | Time  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Business Logic Services Layer                  │   │
│  │  TaskService | ProjectService | AIService | etc.    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Database Access & Query Layer (Drizzle ORM)       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Database │    │  Cache  │    │   AI    │
    │(Supabase)│    │ (Redis) │    │ Services│
    └──────────┘    └─────────┘    └─────────┘
```

## Technology Stack

### Frontend

- **React 19**: Modern UI library with hooks and concurrent rendering
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **Shadcn/ui**: High-quality React components built on Radix UI
- **Wouter**: Lightweight client-side router
- **TanStack Query**: Powerful data synchronization library
- **Streamdown**: Markdown rendering with streaming support

### Backend

- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Lightweight web framework
- **tRPC**: End-to-end typesafe APIs
- **TypeScript**: Type safety for backend code
- **Drizzle ORM**: Type-safe SQL query builder
- **Supabase**: PostgreSQL database with built-in features
- **Redis**: In-memory data store for caching

### AI/ML

- **Claude (Anthropic)**: Advanced language model for task analysis
- **GPT-4 (OpenAI)**: High-performance language model
- **Cohere**: Natural language processing capabilities
- **Custom ML Models**: Task prioritization and prediction

### Infrastructure

- **Kubernetes**: Container orchestration
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipelines
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **ELK Stack**: Centralized logging
- **Jaeger**: Distributed tracing

## Core Design Patterns

### 1. Separation of Concerns

The codebase is organized into distinct layers:

- **Presentation Layer**: React components handling UI
- **API Layer**: tRPC routers exposing type-safe procedures
- **Service Layer**: Business logic encapsulated in service classes
- **Data Access Layer**: Database queries using Drizzle ORM
- **Infrastructure Layer**: External services and utilities

### 2. Type-Safe APIs with tRPC

All backend APIs are defined using tRPC, providing end-to-end type safety:

```typescript
// Backend definition
export const taskRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await taskService.getTasks(ctx.user.id, input.projectId);
    }),
});

// Frontend usage - fully typed
const { data: tasks } = trpc.task.list.useQuery({ projectId: '123' });
```

### 3. Service-Oriented Architecture

Business logic is encapsulated in service classes:

```typescript
class TaskService {
  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    // Validation
    // Business logic
    // Event emission
    // Database operations
  }
}
```

### 4. Dependency Injection

Services receive their dependencies through constructor injection:

```typescript
class TaskService {
  constructor(
    private db: Database,
    private aiService: AIService,
    private notificationService: NotificationService
  ) {}
}
```

### 5. Repository Pattern

Data access is abstracted through repository interfaces:

```typescript
interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findByProject(projectId: string): Promise<Task[]>;
  create(task: CreateTaskInput): Promise<Task>;
  update(id: string, task: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}
```

## Database Design

### Schema Organization

The database is organized into logical domains:

- **Authentication**: Users, sessions, OAuth tokens
- **Projects**: Projects, team members, roles
- **Tasks**: Tasks, subtasks, status, priority
- **Collaboration**: Comments, mentions, activity logs
- **Time Tracking**: Time logs, billable hours
- **Analytics**: Events, metrics, aggregations
- **Notifications**: Notification preferences, history

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | id, openId, email, role |
| teams | Team organizations | id, name, owner_id |
| projects | Project management | id, team_id, name, status |
| tasks | Task management | id, project_id, title, status, priority |
| comments | Task comments | id, task_id, user_id, content |
| time_logs | Time tracking | id, task_id, user_id, duration |
| task_dependencies | Task relationships | id, blocking_task_id, blocked_task_id |
| notifications | User notifications | id, user_id, type, content |

### Relationships

```
users
  ├── teams (owner)
  ├── projects (owner)
  ├── tasks (assignee)
  ├── comments (author)
  ├── time_logs (user)
  └── notifications (recipient)

teams
  ├── users (members)
  ├── projects
  └── team_members

projects
  ├── tasks
  ├── team_members
  └── analytics

tasks
  ├── comments
  ├── time_logs
  ├── dependencies (blocking/blocked)
  └── activity_logs
```

## API Design

### tRPC Router Structure

```typescript
export const appRouter = router({
  auth: router({
    me: publicProcedure.query(...),
    logout: publicProcedure.mutation(...),
  }),
  
  task: router({
    list: protectedProcedure.query(...),
    create: protectedProcedure.mutation(...),
    update: protectedProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
    getById: protectedProcedure.query(...),
  }),
  
  project: router({
    list: protectedProcedure.query(...),
    create: protectedProcedure.mutation(...),
    // ... more procedures
  }),
  
  // ... more routers
});
```

### Procedure Types

- **publicProcedure**: Accessible without authentication
- **protectedProcedure**: Requires authenticated user
- **adminProcedure**: Requires admin role

## Authentication & Authorization

### Authentication Flow

1. User initiates OAuth login
2. Redirected to OAuth provider
3. Provider redirects back with authorization code
4. Backend exchanges code for tokens
5. Session cookie created
6. User authenticated for subsequent requests

### Authorization

Role-based access control (RBAC) with three roles:

- **Admin**: Full system access
- **Manager**: Project and team management
- **User**: Basic task operations

```typescript
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

## Caching Strategy

### Cache Layers

1. **Browser Cache**: Static assets with long expiration
2. **Query Cache**: TanStack Query for API responses
3. **Redis Cache**: Server-side caching for expensive operations
4. **Database Query Cache**: Drizzle ORM query caching

### Cache Invalidation

Cache is invalidated on:
- Data mutations
- Time-based expiration
- Manual invalidation through API

## Real-Time Features

### WebSocket Implementation

Real-time updates are provided through WebSocket connections:

1. Client establishes WebSocket connection
2. Server broadcasts updates to connected clients
3. Client updates local state
4. UI re-renders with new data

### Events

Key events that trigger real-time updates:

- Task created/updated/deleted
- Comment added
- Time log recorded
- Task status changed
- Team member joined/left

## Error Handling

### Error Classification

Errors are classified into categories:

- **Validation Errors**: Invalid input data
- **Authentication Errors**: Missing or invalid credentials
- **Authorization Errors**: Insufficient permissions
- **Not Found Errors**: Resource doesn't exist
- **Conflict Errors**: Resource already exists
- **Server Errors**: Unexpected server issues

### Error Response Format

```typescript
{
  code: 'INVALID_INPUT' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR',
  message: 'Human-readable error message',
  details?: {
    field: 'Field-specific error details'
  }
}
```

## Performance Optimization

### Frontend Optimization

- Code splitting with dynamic imports
- Image optimization and lazy loading
- CSS minification and tree-shaking
- Bundle analysis and monitoring
- Virtual scrolling for large lists

### Backend Optimization

- Database query optimization with indexes
- N+1 query prevention with eager loading
- Caching frequently accessed data
- Pagination for large datasets
- Async processing for long-running tasks

### Database Optimization

- Proper indexing on frequently queried columns
- Query optimization and analysis
- Connection pooling
- Read replicas for scaling reads

## Security Measures

### Data Protection

- TLS 1.3 for all communications
- Password hashing with bcrypt
- Secure session management
- CSRF protection
- XSS prevention

### Access Control

- Row-level security (RLS) in database
- API-level authorization checks
- Rate limiting on sensitive endpoints
- Audit logging of sensitive operations

### Compliance

- GDPR compliance for data privacy
- HIPAA compliance for healthcare data
- SOC 2 Type II readiness
- Regular security audits

## Monitoring & Observability

### Metrics

Application metrics collected via Prometheus:

- Request latency
- Error rates
- Database query performance
- Cache hit rates
- User activity metrics

### Logging

Centralized logging via ELK Stack:

- Application logs
- Error logs
- Audit logs
- Performance logs

### Tracing

Distributed tracing via Jaeger:

- Request flow tracking
- Service dependency visualization
- Performance bottleneck identification

### Alerting

Automated alerts for:

- High error rates
- Slow response times
- Database issues
- Service unavailability

## Scalability Considerations

### Horizontal Scaling

- Stateless backend services
- Load balancing
- Database read replicas
- Cache distribution

### Vertical Scaling

- Resource optimization
- Query optimization
- Caching strategies
- Async processing

### Future Considerations

- Microservices architecture
- Event-driven architecture
- CQRS pattern
- Eventual consistency

## Deployment Strategy

### Environments

- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live environment for users

### Deployment Process

1. Code committed to feature branch
2. CI/CD pipeline runs tests and builds
3. Merge to main triggers staging deployment
4. Manual approval for production deployment
5. Blue-green deployment for zero downtime

## Conclusion

TaskFlow's architecture is designed for scalability, maintainability, and performance. The separation of concerns, type-safe APIs, and comprehensive monitoring ensure a robust and reliable system. Future enhancements can be implemented while maintaining backward compatibility and system stability.
