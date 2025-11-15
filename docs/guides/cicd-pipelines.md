# CI/CD Pipelines Guide

This guide provides comprehensive documentation of the TaskFlow CI/CD pipelines, including workflow configurations, triggers, and best practices.

## Overview

TaskFlow implements two primary CI/CD pipelines:

1. **Test Pipeline** (`test.yml`) - Automated testing and quality assurance
2. **Build Pipeline** (`build.yml`) - Application build and Docker deployment

Both pipelines are designed to maintain high code quality, security, and reliability standards.

## Test Pipeline (test.yml)

The test pipeline runs comprehensive quality checks on every push and pull request.

### Triggers

The test pipeline runs on:

- **Push events** to `main`, `develop`, and `feature/**` branches
- **Pull requests** targeting `main` or `develop` branches

### Jobs

#### 1. Setup Environment

**Purpose**: Validates repository structure and prepares build cache

**Steps**:
- Checkout code
- Generate cache key for dependency caching
- Validate enterprise directory structure
- Verify all required directories exist

**Outputs**: Cache key for subsequent jobs

#### 2. Install Dependencies

**Purpose**: Installs project dependencies with caching

**Steps**:
- Setup Node.js (v20.x)
- Setup pnpm package manager
- Restore pnpm cache from previous builds
- Install dependencies with frozen lockfile
- Verify installation

**Caching**: Uses pnpm store path for efficient caching across runs

#### 3. Lint Code

**Purpose**: Enforces code style and quality standards

**Steps**:
- Run ESLint for code quality
- Run Prettier for formatting consistency
- Check for console logs in production code
- Generate quality reports

**Continues on error**: Linting failures don't block the pipeline but are reported

#### 4. Type Check

**Purpose**: Validates TypeScript type safety

**Steps**:
- Run TypeScript compiler in check mode
- Verify all files are properly typed
- Generate type checking report
- Ensure strict mode compliance

**Strict Mode**: All TypeScript code must pass strict mode checks

#### 5. Unit Tests

**Purpose**: Runs unit tests with coverage reporting

**Steps**:
- Run unit tests with Jest
- Generate coverage report
- Upload coverage artifacts
- Verify coverage thresholds

**Coverage Requirements**:
- Lines: 95%+
- Statements: 95%+
- Functions: 95%+
- Branches: 90%+

#### 6. Integration Tests

**Purpose**: Tests component interactions with services

**Services**:
- PostgreSQL 14 (test database)
- Redis 7 (cache service)

**Steps**:
- Setup test database
- Run database migrations
- Seed test data
- Run integration tests
- Generate coverage report

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NODE_ENV`: Set to 'test'

#### 7. Coverage Analysis

**Purpose**: Analyzes and reports test coverage

**Steps**:
- Download coverage reports from unit and integration tests
- Merge coverage reports
- Generate combined coverage report
- Upload to Codecov
- Comment on PR with coverage metrics

**Coverage Report**: Includes lines, statements, functions, and branches coverage

#### 8. Security Scan

**Purpose**: Scans for vulnerabilities and security issues

**Tools**:
- npm audit - Dependency vulnerability scanning
- Semgrep - Static analysis security testing (SAST)

**Checks**:
- Vulnerable dependencies
- OWASP Top 10 issues
- TypeScript security issues
- React security issues

**Severity Levels**: Moderate and above

#### 9. Build Verification

**Purpose**: Verifies application builds successfully

**Steps**:
- Build application with production settings
- Verify build output
- Check for required artifacts
- Upload build artifacts

**Build Artifacts**: Stored for 5 days for debugging

#### 10. Test Summary

**Purpose**: Summarizes test execution results

**Output**: Final status report with all job results

**Status**: Pipeline fails if any critical job fails

### Environment Variables

```bash
NODE_VERSION=20.x
PNPM_VERSION=8
```

### Artifacts

The test pipeline generates and uploads:

- Unit test coverage reports
- Integration test coverage reports
- Security audit reports
- Build artifacts

All artifacts are retained for 5-30 days depending on type.

## Build Pipeline (build.yml)

The build pipeline builds the application and creates Docker images for deployment.

### Triggers

The build pipeline runs on:

- **Push events** to `main` and `develop` branches
- **Tag creation** for semantic version releases (v*)
- **Workflow dispatch** for manual builds

### Jobs

#### 1. Setup Build Context

**Purpose**: Determines version, environment, and deployment eligibility

**Outputs**:
- `version`: Application version
- `docker-tag`: Docker image tag
- `environment`: Target environment (staging/production)
- `should-deploy`: Whether deployment is eligible

**Version Determination**:
- Release tags (v*): Use tag as version
- Main branch: Use 'latest'
- Develop branch: Use 'develop'
- Other branches: Use commit SHA

**Environment Determination**:
- Main branch: Production
- Develop branch: Staging
- Other branches: Development
- Manual input: Override with specified environment

#### 2. Build Application

**Purpose**: Builds the application for production

**Steps**:
- Checkout code
- Setup Node.js and pnpm
- Restore dependency cache
- Install dependencies
- Build application with production settings
- Generate build info file
- Verify build output
- Upload build artifacts

**Build Info**: Includes version, build date, git SHA, and environment

**Retention**: Build artifacts kept for 30 days

#### 3. Build Docker Image

**Purpose**: Creates Docker images for deployment

**Registries**:
- Docker Hub: `docker.io/username/taskflow`
- GitHub Container Registry: `ghcr.io/owner/repo`

**Steps**:
- Download build artifacts
- Setup Docker Buildx for multi-platform builds
- Login to registries
- Extract metadata (tags, labels)
- Build and push Docker image
- Generate build summary

**Tags**:
- Branch name (e.g., `main`, `develop`)
- Semantic version (e.g., `v1.0.0`, `1.0`)
- Commit SHA
- Custom tag (e.g., `latest`, `develop`)

**Caching**: Uses GitHub Actions cache for faster builds

#### 4. Scan Docker Image

**Purpose**: Scans Docker image for vulnerabilities

**Scanner**: Trivy vulnerability scanner

**Severity**: Scans for CRITICAL and HIGH severity issues

**Output**: SARIF format for GitHub Security tab

**Reporting**: Results automatically uploaded to GitHub Security tab

#### 5. Deploy to Staging

**Purpose**: Deploys to staging environment

**Triggers**: 
- Develop branch push
- Staging environment selected in manual dispatch

**Steps**:
- Deploy to staging environment
- Run smoke tests
- Verify deployment

**URL**: https://staging.taskflow.io

**Smoke Tests**: Basic functionality tests to verify deployment success

#### 6. Deploy to Production

**Purpose**: Deploys to production environment

**Restrictions**:
- Only from main branch or release tags
- Requires manual approval in production environment

**Steps**:
- Verify production readiness
- Deploy to production
- Run health checks
- Create GitHub Release (for tags)

**URL**: https://taskflow.io

**Health Checks**: Comprehensive checks to verify production deployment

**GitHub Release**: Automatically created for semantic version tags with:
- Docker image references
- Build information
- Release notes

#### 7. Build Summary

**Purpose**: Summarizes build execution

**Output**: Final status report with all job results

**Status**: Pipeline fails if critical jobs fail

### Environment Variables

```bash
REGISTRY_DOCKER_HUB=docker.io
REGISTRY_GHCR=ghcr.io
IMAGE_NAME_DOCKER=${{ secrets.DOCKER_USERNAME }}/taskflow
IMAGE_NAME_GHCR=${{ github.repository }}
NODE_VERSION=20.x
PNPM_VERSION=8
```

### Required Secrets

Configure these secrets in GitHub repository settings:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `GITHUB_TOKEN`: Automatically provided by GitHub

### Artifacts

The build pipeline generates:

- Application build artifacts (30 days)
- Docker images (pushed to registries)
- Build info file
- Security scan results

## Workflow Configuration

### Branch Protection Rules

Configure these rules for the main branch:

1. **Require status checks to pass before merging**
   - Require: lint, type-check, unit-tests, integration-tests, build-check

2. **Require code reviews before merging**
   - Number of approvals: 1+

3. **Require branches to be up to date before merging**
   - Enabled

4. **Require conversation resolution before merging**
   - Enabled

### Environment Configuration

#### Staging Environment

**URL**: https://staging.taskflow.io

**Settings**:
- Deployment branches: develop
- Required reviewers: None
- Protection rules: None

#### Production Environment

**URL**: https://taskflow.io

**Settings**:
- Deployment branches: main, release tags
- Required reviewers: 1+
- Protection rules: Require status checks

## Secrets Management

### Adding Secrets

1. Go to GitHub repository Settings
2. Select "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Enter secret name and value

### Required Secrets

**Docker Hub**:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token (not password)

**Database**:
- `DATABASE_URL`: PostgreSQL connection string (for integration tests)
- `REDIS_URL`: Redis connection string (for integration tests)

**Deployment**:
- `STAGING_DEPLOY_KEY`: SSH key for staging deployment
- `PRODUCTION_DEPLOY_KEY`: SSH key for production deployment

### Secret Best Practices

- Never commit secrets to version control
- Rotate secrets regularly
- Use separate secrets for each environment
- Use fine-grained access tokens
- Document secret purposes

## Monitoring & Debugging

### Viewing Workflow Runs

1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow to view runs
4. Click run to view job details

### Debugging Failed Workflows

**View logs**:
- Click failed job
- Expand failed step
- Review error messages

**Common issues**:
- Dependency installation failures
- Type checking errors
- Test failures
- Docker build failures
- Deployment failures

**Re-run workflows**:
- Click "Re-run jobs" to retry failed jobs
- Click "Re-run all jobs" to restart entire workflow

### Artifact Downloads

1. Go to workflow run
2. Scroll to "Artifacts" section
3. Click artifact to download

**Available artifacts**:
- Build artifacts (dist/)
- Coverage reports
- Security reports
- Docker build logs

## Performance Optimization

### Caching Strategies

**pnpm cache**:
- Caches dependencies across runs
- Significantly reduces install time
- Automatically restored from cache

**Docker layer caching**:
- Caches Docker build layers
- Reuses unchanged layers
- Speeds up Docker builds

**GitHub Actions cache**:
- Stores build artifacts
- Reduces redundant builds
- Expires after 7 days of inactivity

### Concurrency Control

Both pipelines use concurrency groups to:
- Cancel in-progress runs when new push occurs
- Prevent duplicate builds
- Save GitHub Actions minutes

**Configuration**:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Best Practices

### Code Quality

1. **Run tests locally** before pushing
2. **Fix linting errors** before committing
3. **Ensure type safety** with strict mode
4. **Maintain coverage** above 95%

### Commits & PRs

1. **Write descriptive commit messages** following Conventional Commits
2. **Keep commits atomic** (single logical change)
3. **Create focused PRs** with clear description
4. **Request reviews** before merging

### Deployment

1. **Test in staging** before production
2. **Monitor deployments** for errors
3. **Have rollback plan** ready
4. **Document changes** in release notes

### Security

1. **Scan dependencies** regularly
2. **Update vulnerable packages** promptly
3. **Use least privilege** for secrets
4. **Rotate credentials** periodically

## Troubleshooting

### Workflow Not Triggering

**Check**:
- Branch name matches trigger conditions
- Commit includes changes to monitored paths
- Workflow file syntax is valid
- GitHub Actions is enabled

### Dependency Installation Fails

**Solutions**:
- Clear pnpm cache: Delete `.pnpm-store` directory
- Update lockfile: Run `pnpm install` locally
- Check Node version compatibility
- Verify network connectivity

### Tests Failing in CI but Passing Locally

**Causes**:
- Different environment variables
- Race conditions in async tests
- Database state issues
- Timing-dependent tests

**Solutions**:
- Check environment variables match
- Add explicit waits for async operations
- Reset database state between tests
- Use deterministic test data

### Docker Build Failures

**Common issues**:
- Missing Dockerfile
- Invalid Docker syntax
- Dependency installation failures
- Out of disk space

**Solutions**:
- Verify Dockerfile exists and is valid
- Check Docker build arguments
- Review build logs for errors
- Increase runner disk space if needed

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Trivy Scanner](https://github.com/aquasecurity/trivy)
- [Semgrep SAST](https://semgrep.dev/)
- [Codecov](https://codecov.io/)

## Support

For questions or issues with CI/CD pipelines:

1. Check this documentation
2. Review workflow logs in GitHub Actions
3. Open an issue on GitHub
4. Contact the team at support@taskflow.io
