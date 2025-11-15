.PHONY: help install dev test lint format clean build deploy-staging deploy-prod db-migrate db-seed

# Default target
help:
	@echo "TaskFlow Development Commands"
	@echo "============================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install              Install dependencies"
	@echo "  make setup                Complete setup (install + db:migrate + db:seed)"
	@echo ""
	@echo "Development:"
	@echo "  make dev                  Start development server"
	@echo "  make dev-watch            Start with watch mode"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate           Run database migrations"
	@echo "  make db-seed              Seed database with sample data"
	@echo "  make db-reset             Reset database (migrate + seed)"
	@echo ""
	@echo "Testing:"
	@echo "  make test                 Run all tests"
	@echo "  make test-unit            Run unit tests"
	@echo "  make test-integration     Run integration tests"
	@echo "  make test-e2e             Run end-to-end tests"
	@echo "  make test-coverage        Run tests with coverage report"
	@echo "  make test-watch           Run tests in watch mode"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint                 Run ESLint"
	@echo "  make format               Format code with Prettier"
	@echo "  make type-check           Run TypeScript type checking"
	@echo ""
	@echo "Build & Deployment:"
	@echo "  make build                Build for production"
	@echo "  make build-docker         Build Docker images"
	@echo "  make deploy-staging       Deploy to staging environment"
	@echo "  make deploy-prod          Deploy to production environment"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean                Clean build artifacts and cache"
	@echo "  make clean-all            Deep clean (includes node_modules)"
	@echo ""

# Installation
install:
	@echo "Installing dependencies..."
	pnpm install

setup: install db-migrate db-seed
	@echo "Setup complete!"

# Development
dev:
	@echo "Starting development server..."
	pnpm dev

dev-watch:
	@echo "Starting development server with watch mode..."
	pnpm dev --watch

# Database
db-migrate:
	@echo "Running database migrations..."
	pnpm db:migrate

db-seed:
	@echo "Seeding database with sample data..."
	pnpm db:seed

db-reset: db-migrate db-seed
	@echo "Database reset complete!"

# Testing
test:
	@echo "Running all tests..."
	pnpm test

test-unit:
	@echo "Running unit tests..."
	pnpm test:unit

test-integration:
	@echo "Running integration tests..."
	pnpm test:integration

test-e2e:
	@echo "Running end-to-end tests..."
	pnpm test:e2e

test-coverage:
	@echo "Running tests with coverage..."
	pnpm test:coverage

test-watch:
	@echo "Running tests in watch mode..."
	pnpm test:watch

# Code Quality
lint:
	@echo "Running ESLint..."
	pnpm lint

format:
	@echo "Formatting code with Prettier..."
	pnpm format

type-check:
	@echo "Running TypeScript type checking..."
	pnpm type-check

# Build
build:
	@echo "Building for production..."
	pnpm build

build-docker:
	@echo "Building Docker images..."
	docker-compose build

# Deployment
deploy-staging:
	@echo "Deploying to staging environment..."
	pnpm run deploy:staging

deploy-prod:
	@echo "Deploying to production environment..."
	pnpm run deploy:production

# Cleanup
clean:
	@echo "Cleaning build artifacts and cache..."
	rm -rf dist build .next out .turbo coverage .jest-cache .eslintcache

clean-all: clean
	@echo "Deep cleaning (removing node_modules)..."
	rm -rf node_modules pnpm-lock.yaml

# Development workflow
dev-setup: install db-migrate db-seed
	@echo "Development environment ready!"

pre-commit: lint type-check test
	@echo "Pre-commit checks passed!"

# Docker commands
docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f

# Git hooks
install-hooks:
	@echo "Installing git hooks..."
	husky install

# CI/CD
ci: lint type-check test build
	@echo "CI pipeline completed successfully!"
