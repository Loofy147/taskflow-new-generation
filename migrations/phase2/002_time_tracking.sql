-- Time Tracking Migration
CREATE TABLE IF NOT EXISTS timer_sessions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  paused_at TIMESTAMP,
  stopped_at TIMESTAMP,
  total_seconds BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_task_timers (task_id),
  INDEX idx_user_timers (user_id),
  INDEX idx_active_timers (stopped_at)
);

CREATE TABLE IF NOT EXISTS time_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timer_session_id BIGINT REFERENCES timer_sessions(id),
  duration_seconds BIGINT NOT NULL,
  description VARCHAR(500),
  is_billable BOOLEAN DEFAULT true,
  logged_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT duration_positive CHECK (duration_seconds > 0),
  INDEX idx_task_logs (task_id),
  INDEX idx_user_logs (user_id),
  INDEX idx_billable_logs (is_billable)
);
