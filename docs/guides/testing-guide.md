# TaskFlow Testing Guide

This guide provides comprehensive information about testing strategies, patterns, and best practices for TaskFlow.

## Testing Overview

TaskFlow maintains 95%+ code coverage across all layers with comprehensive testing:

- **Unit Tests**: Individual functions and components
- **Integration Tests**: Multiple components working together
- **End-to-End Tests**: Complete user workflows
- **Performance Tests**: Load and performance testing

## Running Tests

### All Tests

```bash
pnpm test
```

### Specific Test Suites

```bash
pnpm test:unit          # Unit tests only
pnpm test:integration   # Integration tests only
pnpm test:e2e          # End-to-end tests only
pnpm test:coverage     # With coverage report
pnpm test:watch        # Watch mode for development
```

### Coverage Report

```bash
pnpm test:coverage
open coverage/index.html  # View coverage report
```

## Unit Testing

### Structure

Unit tests follow the Arrange-Act-Assert pattern:

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid input', () => {
      // Arrange - Setup test data and mocks
      const input = { title: 'Test Task', projectId: '123' };
      const mockDb = { insert: jest.fn() };
      const service = new TaskService(mockDb);

      // Act - Execute the function
      const result = service.createTask(input);

      // Assert - Verify the result
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Task');
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });
});
```

### Naming Conventions

Use descriptive test names that explain what is being tested:

```typescript
// ✅ Good - Clear and descriptive
it('should throw ValidationError when title is empty', () => {});
it('should return tasks filtered by status', () => {});
it('should update task priority and emit event', () => {});

// ❌ Bad - Vague and unclear
it('should work', () => {});
it('tests the function', () => {});
```

### Mocking

Mock external dependencies to isolate units:

```typescript
// Mock database
const mockDb = {
  select: jest.fn().mockResolvedValue([]),
  insert: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
};

// Mock external service
const mockAiService = {
  prioritizeTasks: jest.fn().mockResolvedValue([]),
};

// Create service with mocks
const service = new TaskService(mockDb, mockAiService);
```

### Testing Async Code

Use async/await for testing promises:

```typescript
it('should fetch tasks from API', async () => {
  const mockApi = {
    getTasks: jest.fn().mockResolvedValue([
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' },
    ]),
  };

  const service = new TaskService(mockApi);
  const tasks = await service.getTasks();

  expect(tasks).toHaveLength(2);
  expect(mockApi.getTasks).toHaveBeenCalled();
});
```

### Testing Error Cases

Always test error paths:

```typescript
it('should throw ValidationError with invalid input', () => {
  const service = new TaskService();
  const input = { title: '' }; // Invalid

  expect(() => service.createTask(input)).toThrow(ValidationError);
});

it('should handle database errors gracefully', async () => {
  const mockDb = {
    insert: jest.fn().mockRejectedValue(new Error('DB Error')),
  };

  const service = new TaskService(mockDb);

  await expect(service.createTask({})).rejects.toThrow('DB Error');
});
```

## Integration Testing

### Purpose

Integration tests verify that multiple components work together correctly:

```typescript
describe('Task Creation Workflow', () => {
  it('should create task and emit notification', async () => {
    // Setup real database and services
    const db = new Database();
    const notificationService = new NotificationService();
    const taskService = new TaskService(db, notificationService);

    // Create task
    const task = await taskService.createTask({
      title: 'New Task',
      projectId: '123',
    });

    // Verify task was created
    expect(task.id).toBeDefined();

    // Verify notification was sent
    expect(notificationService.notify).toHaveBeenCalledWith({
      type: 'TASK_CREATED',
      taskId: task.id,
    });
  });
});
```

### Database Testing

Use test database for integration tests:

```typescript
beforeAll(async () => {
  // Setup test database
  await db.migrate();
  await db.seed();
});

afterEach(async () => {
  // Clean up after each test
  await db.truncate();
});

it('should find task by id', async () => {
  const task = await taskService.createTask({
    title: 'Test Task',
    projectId: '123',
  });

  const found = await taskService.getTaskById(task.id);
  expect(found.title).toBe('Test Task');
});
```

## End-to-End Testing

### Purpose

E2E tests verify complete user workflows:

```typescript
describe('Task Management Workflow', () => {
  it('should create, update, and delete a task', async () => {
    // 1. User logs in
    await page.goto('http://localhost:3000');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // 2. User creates a task
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title"]', 'New Task');
    await page.click('[data-testid="save-task-button"]');

    // 3. Verify task appears in list
    await expect(page.locator('text=New Task')).toBeVisible();

    // 4. User updates the task
    await page.click('[data-testid="task-edit-button"]');
    await page.fill('[data-testid="task-title"]', 'Updated Task');
    await page.click('[data-testid="save-task-button"]');

    // 5. Verify update
    await expect(page.locator('text=Updated Task')).toBeVisible();

    // 6. User deletes the task
    await page.click('[data-testid="task-delete-button"]');
    await page.click('[data-testid="confirm-delete"]');

    // 7. Verify deletion
    await expect(page.locator('text=Updated Task')).not.toBeVisible();
  });
});
```

## React Component Testing

### Testing with React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('should render task title', () => {
    const task = { id: '1', title: 'Test Task', status: 'todo' };
    render(<TaskCard task={task} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should call onUpdate when edit button is clicked', () => {
    const task = { id: '1', title: 'Test Task', status: 'todo' };
    const onUpdate = jest.fn();

    render(<TaskCard task={task} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onUpdate).toHaveBeenCalledWith(task);
  });

  it('should display priority badge', () => {
    const task = { id: '1', title: 'Test Task', priority: 'high' };
    render(<TaskCard task={task} />);

    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';

describe('useTasks', () => {
  it('should fetch tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.tasks).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('should update task', async () => {
    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.updateTask('1', { title: 'Updated' });
    });

    expect(result.current.tasks[0].title).toBe('Updated');
  });
});
```

## Test Coverage

### Coverage Requirements

Maintain minimum 95% coverage:

- **Statements**: 95%
- **Branches**: 90%
- **Functions**: 95%
- **Lines**: 95%

### Viewing Coverage

```bash
pnpm test:coverage
open coverage/index.html
```

### Coverage Thresholds

Coverage thresholds are enforced in `jest.config.js`:

```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
```

## Performance Testing

### Load Testing

```typescript
describe('Performance', () => {
  it('should handle 1000 tasks efficiently', async () => {
    const startTime = performance.now();

    const tasks = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      title: `Task ${i}`,
    }));

    const result = filterTasks(tasks, { status: 'todo' });

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100); // Should complete in < 100ms
    expect(result).toHaveLength(500);
  });
});
```

### Memory Testing

```typescript
it('should not leak memory', async () => {
  const initialMemory = process.memoryUsage().heapUsed;

  for (let i = 0; i < 1000; i++) {
    await taskService.createTask({ title: `Task ${i}` });
  }

  global.gc(); // Force garbage collection

  const finalMemory = process.memoryUsage().heapUsed;
  const memoryIncrease = finalMemory - initialMemory;

  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // < 10MB increase
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
it('should call setState', () => {
  const setState = jest.fn();
  // ...
});

// ✅ Good - Testing behavior
it('should display task title when loaded', () => {
  render(<TaskCard task={task} />);
  expect(screen.getByText(task.title)).toBeInTheDocument();
});
```

### 2. Use Meaningful Assertions

```typescript
// ❌ Bad - Unclear assertion
expect(result).toBeTruthy();

// ✅ Good - Clear assertion
expect(result.success).toBe(true);
expect(result.taskId).toBeDefined();
```

### 3. Keep Tests Focused

```typescript
// ❌ Bad - Testing too much
it('should create task, send notification, and update cache', () => {
  // ...
});

// ✅ Good - Single responsibility
it('should create task with valid input', () => {
  // ...
});
```

### 4. Use Test Fixtures

```typescript
// Create reusable test data
const createMockTask = (overrides = {}) => ({
  id: '1',
  title: 'Test Task',
  status: 'todo',
  priority: 'medium',
  ...overrides,
});

it('should handle high priority tasks', () => {
  const task = createMockTask({ priority: 'high' });
  // ...
});
```

## Continuous Integration

Tests run automatically on:

- Every push to any branch
- Every pull request
- Before deployment to staging/production

See `.github/workflows/test.yml` for CI configuration.

## Troubleshooting

### Tests Failing Locally

1. Ensure all dependencies are installed: `pnpm install`
2. Clear cache: `pnpm test --clearCache`
3. Check environment variables are set
4. Verify database is running

### Flaky Tests

Flaky tests that intermittently fail should be:

1. Identified and isolated
2. Made deterministic
3. Documented with `@flaky` tag
4. Investigated and fixed

### Debugging Tests

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Or use VS Code debugger
# Add breakpoint and run: Debug Jest Current File
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

## Questions?

For questions about testing, please:

1. Check this guide
2. Review existing test examples
3. Open an issue on GitHub
4. Contact the team
