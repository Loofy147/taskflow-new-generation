# TaskFlow Coding Standards

This document outlines the coding standards and best practices for the TaskFlow project. All contributors must follow these guidelines to maintain code quality and consistency.

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React Component Standards](#react-component-standards)
4. [Backend Standards](#backend-standards)
5. [Testing Standards](#testing-standards)
6. [Documentation Standards](#documentation-standards)
7. [Git & Commit Standards](#git--commit-standards)

## General Principles

### Code Quality

All code must be clean, readable, and maintainable. Follow the SOLID principles and DRY (Don't Repeat Yourself) approach. Code should be self-documenting with clear variable names and function purposes.

### Performance

Write performant code from the start. Consider algorithmic complexity, memory usage, and network requests. Profile before optimizing and document performance-critical sections.

### Security

Never commit secrets or credentials. Validate all user input. Use parameterized queries for database operations. Follow OWASP guidelines for web application security.

### Accessibility

Ensure all UI components are accessible to users with disabilities. Use semantic HTML, ARIA labels, and keyboard navigation. Test with screen readers.

## TypeScript Standards

### Type Safety

Use strict TypeScript mode. Avoid `any` type. Use proper typing for all variables, function parameters, and return types.

```typescript
// ❌ Bad
function processData(data: any): any {
  return data.value;
}

// ✅ Good
interface DataItem {
  value: string;
  timestamp: Date;
}

function processData(data: DataItem): string {
  return data.value;
}
```

### Naming Conventions

Use camelCase for variables and functions, PascalCase for classes and types, UPPER_SNAKE_CASE for constants.

```typescript
// Variables and functions
const taskCount = 10;
function calculateTaskDuration(): number {}

// Classes and types
class TaskManager {}
interface TaskData {}
type TaskStatus = 'todo' | 'in-progress' | 'done';

// Constants
const MAX_TASK_TITLE_LENGTH = 255;
const API_TIMEOUT_MS = 5000;
```

### Interfaces vs Types

Use interfaces for object shapes, types for unions and complex types.

```typescript
// ✅ Interface for object shape
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type for union
type TaskStatus = 'todo' | 'in-progress' | 'done';

// ✅ Type for complex types
type TaskWithUser = Task & { user: User };
```

### Error Handling

Create custom error classes for different error scenarios. Always handle errors appropriately.

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  validateInput(data);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

## React Component Standards

### Component Structure

Keep components small and focused. Each component should have a single responsibility.

```typescript
// ✅ Good - Small, focused component
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => onUpdate(task)}>Edit</button>
    </div>
  );
}
```

### Hooks Usage

Use functional components with hooks. Prefer custom hooks for reusable logic.

```typescript
// ✅ Good - Custom hook for reusable logic
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, refetch: fetchTasks };
}
```

### Props Typing

Always type component props explicitly.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, ...props }: ButtonProps) {
  // Implementation
}
```

### Conditional Rendering

Use ternary operators for simple conditions, separate components for complex logic.

```typescript
// ✅ Good - Simple condition
{isLoading ? <Spinner /> : <Content />}

// ✅ Good - Complex logic in separate component
function TaskListContent() {
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (tasks.length === 0) return <EmptyState />;
  return <TaskList tasks={tasks} />;
}
```

### Key Props

Always provide stable keys when rendering lists. Avoid using array index as key.

```typescript
// ❌ Bad - Using index as key
{tasks.map((task, index) => (
  <TaskCard key={index} task={task} />
))}

// ✅ Good - Using stable identifier
{tasks.map((task) => (
  <TaskCard key={task.id} task={task} />
))}
```

## Backend Standards

### API Design

Follow RESTful principles. Use proper HTTP methods and status codes.

```typescript
// ✅ Good tRPC procedure
export const taskRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getTasks(ctx.user.id, input.projectId);
    }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return await createTask(ctx.user.id, input);
    }),
});
```

### Service Layer

Separate business logic from API handlers. Create service classes for domain logic.

```typescript
class TaskService {
  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    // Validate input
    // Create task
    // Emit events
    // Return result
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput): Promise<Task> {
    // Validate ownership
    // Update task
    // Emit events
    // Return result
  }
}
```

### Database Queries

Use parameterized queries. Never concatenate user input into queries.

```typescript
// ✅ Good - Parameterized query
const task = await db
  .select()
  .from(tasks)
  .where(eq(tasks.id, taskId))
  .limit(1);

// ❌ Bad - SQL injection vulnerability
const task = await db.query(`SELECT * FROM tasks WHERE id = ${taskId}`);
```

### Error Handling

Create custom error classes and handle errors appropriately.

```typescript
class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export const taskRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await getTask(input.id);
      if (!task) {
        throw new NotFoundError('Task', input.id);
      }
      return task;
    }),
});
```

## Testing Standards

### Test Structure

Follow the Arrange-Act-Assert pattern. Use descriptive test names.

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid input', () => {
      // Arrange
      const input = { title: 'Test Task', projectId: '123' };

      // Act
      const result = taskService.createTask(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Task');
    });

    it('should throw ValidationError with invalid input', () => {
      // Arrange
      const input = { title: '', projectId: '123' };

      // Act & Assert
      expect(() => taskService.createTask(input)).toThrow(ValidationError);
    });
  });
});
```

### Coverage Requirements

Maintain 95%+ code coverage. Test all public APIs and error paths.

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report
open coverage/index.html
```

### Mocking

Mock external dependencies. Use realistic test data.

```typescript
// ✅ Good - Mock external service
const mockApiClient = {
  getTasks: jest.fn().mockResolvedValue([
    { id: '1', title: 'Task 1' },
    { id: '2', title: 'Task 2' },
  ]),
};

it('should fetch tasks from API', async () => {
  const service = new TaskService(mockApiClient);
  const tasks = await service.getTasks();
  expect(mockApiClient.getTasks).toHaveBeenCalled();
  expect(tasks).toHaveLength(2);
});
```

## Documentation Standards

### Code Comments

Write comments for why code exists, not what it does. Code should be self-documenting.

```typescript
// ❌ Bad - Obvious comment
const count = tasks.length; // Get the number of tasks

// ✅ Good - Explains why
// We need to check if there are any tasks to display
// the empty state message
const count = tasks.length;
```

### JSDoc

Document public APIs with JSDoc comments.

```typescript
/**
 * Calculate task priority based on multiple factors
 * @param task - The task to prioritize
 * @param factors - Weighting factors for priority calculation
 * @returns Priority score between 0 and 100
 * @throws {ValidationError} If task is invalid
 * @example
 * const priority = calculatePriority(task, { urgency: 0.5, impact: 0.5 });
 */
function calculatePriority(task: Task, factors: PriorityFactors): number {
  // Implementation
}
```

### README Files

Include README files in directories with complex logic. Explain the purpose and usage.

```markdown
# Task Service

Handles all task-related business logic including creation, updates, and deletion.

## Usage

```typescript
const service = new TaskService(db);
const task = await service.createTask(userId, { title: 'New Task' });
```

## Key Methods

- `createTask(userId, data)` - Create a new task
- `updateTask(userId, taskId, data)` - Update an existing task
- `deleteTask(userId, taskId)` - Delete a task
```

## Git & Commit Standards

### Branch Naming

Use descriptive branch names following the convention:

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `chore/description` - Maintenance tasks

### Commit Messages

Follow Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

**Examples:**

```
feat(tasks): add task dependency linking

Add ability to link tasks as blocking/dependent relationships
with circular dependency detection.

Closes #123
```

```
fix(comments): prevent duplicate @mentions in notifications

Ensure each user receives only one notification per comment
regardless of mention count.
```

### Pull Request Guidelines

1. Keep PRs focused and reasonably sized (under 400 lines of changes)
2. Write clear PR descriptions
3. Link related issues
4. Request review from at least one maintainer
5. Address all feedback before merging
6. Ensure all CI checks pass

## Tools & Configuration

### ESLint

Configuration in `.eslintrc.js`. Run with `pnpm lint`.

### Prettier

Configuration in `prettier.config.js`. Run with `pnpm format`.

### TypeScript

Configuration in `tsconfig.json`. Run with `pnpm type-check`.

### Testing

Configuration in `jest.config.js`. Run with `pnpm test`.

## Enforcement

These standards are enforced through:

1. **Pre-commit hooks** - Lint and format checks
2. **CI/CD pipeline** - Automated testing and linting
3. **Code review** - Manual review by maintainers
4. **Automated tools** - ESLint, Prettier, TypeScript

## Questions?

If you have questions about these standards, please open an issue or contact the maintainers.
