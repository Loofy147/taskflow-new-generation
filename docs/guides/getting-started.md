# Getting Started with TaskFlow

Welcome to TaskFlow! This guide will help you get up and running with the development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8 or higher (package manager)
- **PostgreSQL**: Version 14 or higher
- **Redis**: Version 6 or higher
- **Git**: For version control
- **Docker** (optional): For containerized development

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskflow-new-generation.git
cd taskflow-new-generation
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file and configure it with your credentials. Contact the team for the specific values needed for your environment.

### 4. Setup Database

Run migrations to create database schema:

```bash
pnpm db:migrate
```

Seed the database with sample data:

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
taskflow-new-generation/
├── src/
│   ├── backend/          # Backend services
│   ├── frontend/         # React application
│   └── shared/           # Shared types and utilities
├── docs/                 # Documentation
├── tests/                # Test suites
├── infrastructure/       # Infrastructure as Code
└── package.json          # Dependencies
```

## Common Commands

### Development

```bash
# Start development server
pnpm dev

# Start with watch mode
pnpm dev --watch
```

### Database

```bash
# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Reset database
pnpm db:reset
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test suite
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

### Code Quality

```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Using Make Commands

Alternatively, use Make for common tasks:

```bash
make help              # Show all available commands
make install           # Install dependencies
make setup             # Complete setup
make dev               # Start development server
make test              # Run all tests
make lint              # Run linting
make format            # Format code
make build             # Build for production
```

## Docker Development

If you prefer Docker, use Docker Compose:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Next Steps

1. **Read the Documentation**: Check out the [docs](../README.md) directory
2. **Understand the Architecture**: Review [System Design](../architecture/system-design.md)
3. **Follow Coding Standards**: See [Coding Standards](./coding-standards.md)
4. **Write Tests**: Follow [Testing Guide](./testing-guide.md)
5. **Contribute**: See [Contributing Guide](../../CONTRIBUTING.md)

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Ensure PostgreSQL is running
2. Check DATABASE_URL in environment configuration
3. Verify database exists
4. Run migrations: `pnpm db:migrate`

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Redis Connection Issues

If Redis connection fails:

1. Ensure Redis is running: `redis-cli ping`
2. Check REDIS_URL in environment configuration
3. Start Redis: `redis-server`

## Getting Help

- **Documentation**: https://docs.taskflow.io
- **Issues**: https://github.com/yourusername/taskflow-new-generation/issues
- **Discussions**: https://github.com/yourusername/taskflow-new-generation/discussions
- **Email**: support@taskflow.io

Happy coding! 🚀
