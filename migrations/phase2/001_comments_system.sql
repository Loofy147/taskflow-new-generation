-- Comments System Migration
CREATE TABLE IF NOT EXISTS comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT comment_content_not_empty CHECK (LENGTH(content) > 0),
  INDEX idx_task_comments (task_id),
  INDEX idx_user_comments (user_id),
  INDEX idx_comment_created (created_at DESC)
);

CREATE TABLE IF NOT EXISTS comment_reactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (comment_id, user_id, emoji),
  INDEX idx_comment_reactions (comment_id)
);

CREATE TABLE IF NOT EXISTS comment_mentions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  mentioned_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_comment_mentions (comment_id),
  INDEX idx_mentioned_user (mentioned_user_id)
);

CREATE TABLE IF NOT EXISTS comment_attachments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  file_url VARCHAR(2048) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_comment_attachments (comment_id)
);

-- Full-text search index
CREATE FULLTEXT INDEX idx_comment_search ON comments(content);
