# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [issue list](https://github.com/yourusername/taskflow-new-generation/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the [Coding Standards](docs/guides/coding-standards.md)
- Include appropriate test cases
- Update documentation as needed
- End all files with a newline

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis 6+
- Git

### Local Development

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow-new-generation.git
   cd taskflow-new-generation
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Setup database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Run tests**
   ```bash
   pnpm test
   ```

## Development Workflow

### Branch Naming Convention

Use the following naming convention for branches:

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `chore/description` - Maintenance tasks

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

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

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests and linting**
   ```bash
   pnpm test
   pnpm lint
   pnpm format
   ```

4. **Commit your changes**
   ```bash
   git commit -am "feat(feature): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature
   ```

6. **Create a Pull Request**
   - Use the provided PR template
   - Link related issues
   - Describe your changes clearly
   - Request review from maintainers

7. **Address feedback**
   - Respond to review comments
   - Make requested changes
   - Push updates to the same branch

## Coding Standards

### TypeScript

- Use strict mode: `"strict": true`
- Avoid `any` type; use proper typing
- Export types from modules
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Document complex logic with comments
- Use meaningful component names

### Naming Conventions

- **Files**: Use kebab-case for file names
  - Components: `task-card.tsx`
  - Services: `task-service.ts`
  - Utilities: `date-utils.ts`

- **Variables/Functions**: Use camelCase
  ```typescript
  const taskCount = 10;
  function calculateTaskDuration() {}
  ```

- **Constants**: Use UPPER_SNAKE_CASE
  ```typescript
  const MAX_TASK_TITLE_LENGTH = 255;
  const API_TIMEOUT_MS = 5000;
  ```

- **Classes/Types**: Use PascalCase
  ```typescript
  class TaskManager {}
  interface TaskData {}
  type TaskStatus = 'todo' | 'in-progress' | 'done';
  ```

### Code Organization

**Backend Structure**
```
src/backend/
├── api/v1/
│   ├── tasks/
│   │   ├── create.ts
│   │   ├── read.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   └── ...
├── services/
│   ├── task-service.ts
│   └── ...
├── models/
│   ├── task.ts
│   └── ...
└── utils/
    ├── logger.ts
    └── ...
```

**Frontend Structure**
```
src/frontend/
├── components/
│   ├── common/
│   │   ├── button.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── dashboard.tsx
│   │   └── ...
│   └── features/
│       ├── tasks/
│       │   ├── task-card.tsx
│       │   └── ...
│       └── ...
├── hooks/
│   ├── use-tasks.ts
│   └── ...
└── utils/
    ├── date-utils.ts
    └── ...
```

### Testing

- Write tests for all new features
- Aim for 95%+ code coverage
- Use descriptive test names
- Test both happy path and error cases
- Mock external dependencies

**Test Structure**
```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid input', () => {
      // Arrange
      const input = { title: 'Test Task' };
      
      // Act
      const result = taskService.createTask(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Task');
    });

    it('should throw error with invalid input', () => {
      // Arrange
      const input = { title: '' };
      
      // Act & Assert
      expect(() => taskService.createTask(input)).toThrow();
    });
  });
});
```

### Documentation

- Write clear comments for complex logic
- Document public APIs with JSDoc
- Keep README.md up to date
- Document configuration options
- Include examples in documentation

**JSDoc Example**
```typescript
/**
 * Calculate task priority based on multiple factors
 * @param task - The task to prioritize
 * @param factors - Weighting factors for priority calculation
 * @returns Priority score between 0 and 100
 * @throws {Error} If task is invalid
 */
function calculatePriority(task: Task, factors: PriorityFactors): number {
  // Implementation
}
```

## Testing Guidelines

### Unit Tests

Test individual functions and components in isolation:

```bash
pnpm test:unit
```

### Integration Tests

Test interactions between multiple components:

```bash
pnpm test:integration
```

### End-to-End Tests

Test complete user workflows:

```bash
pnpm test:e2e
```

### Coverage Requirements

- Minimum 95% code coverage
- All public APIs must have tests
- All error paths must be tested
- All user workflows must be tested

## Performance Guidelines

- Minimize bundle size
- Optimize database queries
- Use caching appropriately
- Implement pagination for large datasets
- Profile before optimizing

## Security Guidelines

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries
- Implement proper authentication/authorization
- Follow OWASP guidelines
- Report security issues privately

## Documentation Updates

When making changes that affect documentation:

1. Update relevant documentation files
2. Update API documentation if endpoints change
3. Update architecture diagrams if structure changes
4. Update examples if behavior changes
5. Update CHANGELOG.md

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a release branch: `release/v1.0.0`
4. Create a GitHub release with release notes
5. Tag the commit: `git tag v1.0.0`

## Getting Help

- **Documentation**: https://docs.taskflow.io
- **Issues**: https://github.com/yourusername/taskflow-new-generation/issues
- **Discussions**: https://github.com/yourusername/taskflow-new-generation/discussions
- **Email**: support@taskflow.io

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- GitHub contributors page
- Release notes for significant contributions

Thank you for contributing to TaskFlow! 🎉
