-- Von der Idee zum Prototyp - Database Schema
-- SQLite Database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK(plan IN ('free', 'daily', 'monthly', 'yearly')),
  workflows_limit INTEGER NOT NULL,
  workflows_used INTEGER DEFAULT 0,
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  active BOOLEAN DEFAULT 1,
  payment_id TEXT,
  payment_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(active);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  workflow_type TEXT NOT NULL CHECK(workflow_type IN ('full', 'partial')),
  current_step TEXT NOT NULL DEFAULT 'ideas', -- 'ideas', 'brainstorming', 'prd', 'prototype'

  -- Workflow data
  ideas_json TEXT,
  selected_idea_json TEXT,
  brainstorming_json TEXT,
  prd_text TEXT,
  prototype_html TEXT,

  -- Metadata
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- Create index for faster workflow lookups
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_subscription_id ON workflows(subscription_id);

-- API Usage table (track costs)
CREATE TABLE IF NOT EXISTS api_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  step TEXT NOT NULL CHECK(step IN ('ideas', 'brainstorming', 'prd', 'prototype', 'chat')),
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cost_eur REAL NOT NULL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

-- Create index for cost tracking
CREATE INDEX IF NOT EXISTS idx_api_usage_workflow_id ON api_usage(workflow_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Ad Rewards table (bonus workflows from watching videos)
CREATE TABLE IF NOT EXISTS ad_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  ad_type TEXT NOT NULL CHECK(ad_type IN ('rewarded_video', 'interstitial')),
  workflows_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- Create index for ad rewards
CREATE INDEX IF NOT EXISTS idx_ad_rewards_user_id ON ad_rewards(user_id);

-- Insert default free subscription for new users
-- This will be done in code when user registers

-- Views for easier querying

-- View: Active subscriptions with user info
CREATE VIEW IF NOT EXISTS active_subscriptions AS
SELECT
  s.id AS subscription_id,
  s.user_id,
  u.email,
  s.plan,
  s.workflows_limit,
  s.workflows_used,
  s.workflows_limit - s.workflows_used AS workflows_remaining,
  s.start_date,
  s.end_date,
  CASE
    WHEN s.end_date IS NULL THEN 9999
    WHEN s.end_date > datetime('now') THEN
      CAST((julianday(s.end_date) - julianday('now')) AS INTEGER)
    ELSE 0
  END AS days_remaining,
  s.active
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.active = 1;

-- View: Total API costs per user
CREATE VIEW IF NOT EXISTS user_api_costs AS
SELECT
  u.id AS user_id,
  u.email,
  COUNT(DISTINCT w.id) AS total_workflows,
  SUM(au.total_tokens) AS total_tokens,
  SUM(au.cost_eur) AS total_cost_eur,
  AVG(au.cost_eur) AS avg_cost_per_call
FROM users u
LEFT JOIN workflows w ON u.id = w.user_id
LEFT JOIN api_usage au ON w.id = au.workflow_id
GROUP BY u.id, u.email;

-- View: Workflows with costs
CREATE VIEW IF NOT EXISTS workflows_with_costs AS
SELECT
  w.id AS workflow_id,
  w.user_id,
  u.email,
  w.workflow_type,
  w.current_step,
  w.completed,
  w.created_at,
  COUNT(au.id) AS api_calls,
  SUM(au.total_tokens) AS total_tokens,
  SUM(au.cost_eur) AS total_cost_eur
FROM workflows w
JOIN users u ON w.user_id = u.id
LEFT JOIN api_usage au ON w.id = au.workflow_id
GROUP BY w.id, w.user_id, u.email, w.workflow_type, w.current_step, w.completed, w.created_at;
