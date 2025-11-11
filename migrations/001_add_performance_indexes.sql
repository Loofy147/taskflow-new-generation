-- Sprint 1: Performance Optimization Indexes
-- Created: November 10, 2025
-- Purpose: Add comprehensive indexes for query performance optimization
-- Target: 50%+ query performance improvement

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt);

-- Teams table indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_team_status ON projects(team_id, status);

-- Tasks table indexes (most critical)
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_team_status ON tasks(team_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_team_created ON tasks(team_id, created_at);

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_user_created ON comments(user_id, created_at);

-- Time logs table indexes
CREATE INDEX IF NOT EXISTS idx_time_logs_task_id ON time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_user_id ON time_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_date ON time_logs(date);
CREATE INDEX IF NOT EXISTS idx_time_logs_user_date ON time_logs(user_id, date);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Task dependencies table indexes
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_depends_on_id ON task_dependencies(depends_on_id);

-- AI suggestions table indexes
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_task_id ON ai_suggestions(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at ON ai_suggestions(created_at);

-- Full-text search indexes (if using PostgreSQL)
-- CREATE INDEX IF NOT EXISTS idx_tasks_title_search ON tasks USING GIN (to_tsvector('english', title));
-- CREATE INDEX IF NOT EXISTS idx_tasks_description_search ON tasks USING GIN (to_tsvector('english', description));
-- CREATE INDEX IF NOT EXISTS idx_comments_content_search ON comments USING GIN (to_tsvector('english', content));

-- Analyze tables to update statistics
ANALYZE users;
ANALYZE teams;
ANALYZE projects;
ANALYZE tasks;
ANALYZE comments;
ANALYZE time_logs;
ANALYZE notifications;
ANALYZE task_dependencies;
ANALYZE ai_suggestions;
