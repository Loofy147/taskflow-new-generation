-- Sprint 1: Row-Level Security (RLS) Policies
-- Created: November 10, 2025
-- Purpose: Implement multi-tenant data isolation using RLS
-- Security Level: Production-grade

-- ============================================
-- STEP 1: Enable RLS on all tables
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create helper functions
-- ============================================

-- Get current user ID from JWT
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb->>'sub')::TEXT;
$$ LANGUAGE SQL STABLE;

-- Get user role
CREATE OR REPLACE FUNCTION current_user_role() RETURNS TEXT AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb->>'role')::TEXT;
$$ LANGUAGE SQL STABLE;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT current_user_role() = 'admin';
$$ LANGUAGE SQL STABLE;

-- Get user's team IDs
CREATE OR REPLACE FUNCTION user_team_ids() RETURNS SETOF INT AS $$
  SELECT team_id FROM team_members WHERE user_id = current_user_id();
$$ LANGUAGE SQL STABLE;

-- ============================================
-- STEP 3: Users table policies
-- ============================================

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (openId = current_user_id() OR is_admin());

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (openId = current_user_id())
  WITH CHECK (openId = current_user_id());

-- ============================================
-- STEP 4: Teams table policies
-- ============================================

-- Users can view teams they belong to
CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    OR owner_id = current_user_id()
    OR is_admin()
  );

-- Team owners can update their teams
CREATE POLICY "Team owners can update teams"
  ON teams FOR UPDATE
  USING (owner_id = current_user_id() OR is_admin())
  WITH CHECK (owner_id = current_user_id() OR is_admin());

-- ============================================
-- STEP 5: Team members table policies
-- ============================================

-- Users can view team members in their teams
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    OR is_admin()
  );

-- Team owners can manage team members
CREATE POLICY "Team owners can manage members"
  ON team_members FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = current_user_id())
    OR is_admin()
  );

-- ============================================
-- STEP 6: Projects table policies
-- ============================================

-- Users can view projects in their teams
CREATE POLICY "Users can view team projects"
  ON projects FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    OR is_admin()
  );

-- Users can create projects in their teams
CREATE POLICY "Users can create team projects"
  ON projects FOR INSERT
  WITH CHECK (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    OR is_admin()
  );

-- Users can update projects in their teams
CREATE POLICY "Users can update team projects"
  ON projects FOR UPDATE
  USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    OR is_admin()
  );

-- ============================================
-- STEP 7: Tasks table policies
-- ============================================

-- Users can view tasks in their projects
CREATE POLICY "Users can view team tasks"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    )
    OR is_admin()
  );

-- Users can create tasks in their projects
CREATE POLICY "Users can create team tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    )
    OR is_admin()
  );

-- Users can update tasks in their projects
CREATE POLICY "Users can update team tasks"
  ON tasks FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
    )
    OR is_admin()
  );

-- ============================================
-- STEP 8: Comments table policies
-- ============================================

-- Users can view comments on tasks in their projects
CREATE POLICY "Users can view task comments"
  ON comments FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
    OR is_admin()
  );

-- Users can create comments on tasks in their projects
CREATE POLICY "Users can create task comments"
  ON comments FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
    OR is_admin()
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (user_id = current_user_id() OR is_admin())
  WITH CHECK (user_id = current_user_id() OR is_admin());

-- ============================================
-- STEP 9: Time logs table policies
-- ============================================

-- Users can view time logs for tasks in their projects
CREATE POLICY "Users can view task time logs"
  ON time_logs FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
    OR user_id = current_user_id()
    OR is_admin()
  );

-- Users can create time logs for their tasks
CREATE POLICY "Users can create time logs"
  ON time_logs FOR INSERT
  WITH CHECK (
    user_id = current_user_id()
    AND task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
  );

-- ============================================
-- STEP 10: Notifications table policies
-- ============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = current_user_id() OR is_admin());

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = current_user_id())
  WITH CHECK (user_id = current_user_id());

-- ============================================
-- STEP 11: Task dependencies table policies
-- ============================================

-- Users can view dependencies for tasks in their projects
CREATE POLICY "Users can view task dependencies"
  ON task_dependencies FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
    OR is_admin()
  );

-- ============================================
-- STEP 12: AI suggestions table policies
-- ============================================

-- Users can view suggestions for their tasks
CREATE POLICY "Users can view task suggestions"
  ON ai_suggestions FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE team_id IN (SELECT team_id FROM team_members WHERE user_id = current_user_id())
      )
    )
    OR user_id = current_user_id()
    OR is_admin()
  );

-- ============================================
-- STEP 13: Grant permissions to service role
-- ============================================

-- Service role (backend) can bypass RLS
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE teams FORCE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE comments FORCE ROW LEVEL SECURITY;
ALTER TABLE time_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies FORCE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions FORCE ROW LEVEL SECURITY;
ALTER TABLE team_members FORCE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role (backend)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- STEP 14: Verification queries
-- ============================================

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;

-- Verify policies are created
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
