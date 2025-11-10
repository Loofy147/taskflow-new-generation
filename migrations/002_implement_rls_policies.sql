-- Phase 1: Row-Level Security (RLS) Policies
-- Purpose: Implement comprehensive RLS policies for multi-tenant data isolation
-- Created: November 7, 2025
-- Author: Manus AI

BEGIN;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can view all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- TEAMS TABLE POLICIES
-- ============================================================

-- Users can view teams they are members of
CREATE POLICY "teams_select_member" ON teams
  FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Team leads can update their teams
CREATE POLICY "teams_update_lead" ON teams
  FOR UPDATE
  USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'lead'
    )
  )
  WITH CHECK (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'lead'
    )
  );

-- ============================================================
-- TEAM MEMBERS TABLE POLICIES
-- ============================================================

-- Users can view team members of their teams
CREATE POLICY "team_members_select" ON team_members
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Team leads can manage team members
CREATE POLICY "team_members_insert" ON team_members
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'lead'
    )
  );

CREATE POLICY "team_members_update" ON team_members
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'lead'
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'lead'
    )
  );

-- ============================================================
-- PROJECTS TABLE POLICIES
-- ============================================================

-- Users can view projects in their teams
CREATE POLICY "projects_select" ON projects
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Users can create projects in their teams
CREATE POLICY "projects_insert" ON projects
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Users can update projects in their teams
CREATE POLICY "projects_update" ON projects
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- TASKS TABLE POLICIES
-- ============================================================

-- Users can view tasks in their teams
CREATE POLICY "tasks_select" ON tasks
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Users can create tasks in their teams
CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Users can update tasks in their teams
CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- COMMENTS TABLE POLICIES
-- ============================================================

-- Users can view comments on tasks in their teams
CREATE POLICY "comments_select" ON comments
  FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can create comments on tasks in their teams
CREATE POLICY "comments_insert" ON comments
  FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update their own comments
CREATE POLICY "comments_update" ON comments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TIME LOGS TABLE POLICIES
-- ============================================================

-- Users can view time logs for tasks in their teams
CREATE POLICY "time_logs_select" ON time_logs
  FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can create time logs for tasks in their teams
CREATE POLICY "time_logs_insert" ON time_logs
  FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================

-- Users can view their own notifications
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications
CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TASK DEPENDENCIES TABLE POLICIES
-- ============================================================

-- Users can view task dependencies for tasks in their teams
CREATE POLICY "task_dependencies_select" ON task_dependencies
  FOR SELECT
  USING (
    blocker_task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- AI SUGGESTIONS TABLE POLICIES
-- ============================================================

-- Users can view AI suggestions for tasks in their teams
CREATE POLICY "ai_suggestions_select" ON ai_suggestions
  FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

COMMIT;
