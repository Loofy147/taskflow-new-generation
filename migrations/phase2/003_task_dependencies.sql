-- Task Dependencies Migration
CREATE TABLE IF NOT EXISTS task_dependencies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type ENUM('blocks', 'blocked_by', 'relates_to') DEFAULT 'blocks',
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (task_id, depends_on_task_id),
  CONSTRAINT no_self_dependency CHECK (task_id != depends_on_task_id),
  INDEX idx_task_dependencies (task_id),
  INDEX idx_depends_on (depends_on_task_id)
);

-- Create helper function for critical path calculation
CREATE FUNCTION calculate_critical_path(start_task_id BIGINT)
RETURNS TABLE(task_id BIGINT, depth INT) AS $$
WITH RECURSIVE critical_path AS (
  SELECT task_id, 1 as depth
  FROM task_dependencies
  WHERE depends_on_task_id = start_task_id
  
  UNION ALL
  
  SELECT td.task_id, cp.depth + 1
  FROM task_dependencies td
  JOIN critical_path cp ON td.depends_on_task_id = cp.task_id
  WHERE cp.depth < 100
)
SELECT * FROM critical_path;
$$ LANGUAGE SQL;
