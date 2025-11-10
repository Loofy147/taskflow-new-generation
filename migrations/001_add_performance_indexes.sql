-- Phase 1: Database Optimization - Performance Indexes
-- Purpose: Add indexes for frequently queried columns to improve query performance
-- Created: November 7, 2025
-- Author: Manus AI

BEGIN;

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_open_id ON users(openId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt DESC);

-- Teams table indexes
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(createdAt DESC);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(userId);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(teamId);
CREATE INDEX IF NOT EXISTS idx_team_members_unique ON team_members(teamId, userId);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(teamId);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(createdAt DESC);

-- Tasks table indexes (most critical)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(userId);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(teamId);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(projectId);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(dueDate);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_team_status ON tasks(teamId, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(userId, status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(projectId, status);

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(taskId);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(userId);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(createdAt DESC);

-- Time logs table indexes
CREATE INDEX IF NOT EXISTS idx_time_logs_task_id ON time_logs(taskId);
CREATE INDEX IF NOT EXISTS idx_time_logs_user_id ON time_logs(userId);
CREATE INDEX IF NOT EXISTS idx_time_logs_date ON time_logs(logDate);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(isRead);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(createdAt DESC);

-- Task dependencies indexes
CREATE INDEX IF NOT EXISTS idx_task_dependencies_blocker ON task_dependencies(blockerTaskId);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_blocked ON task_dependencies(blockedTaskId);

-- AI suggestions indexes
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_task_id ON ai_suggestions(taskId);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at ON ai_suggestions(createdAt DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_comments_search ON comments USING gin(to_tsvector('english', content));

COMMIT;
