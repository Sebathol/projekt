-- Von der Idee zum Prototyp - Database Schema V2
-- SQLite Database
-- Tokens & Workflows System

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Credits table (NEW: Replaces subscriptions workflow counting)
-- Stores available workflows and tokens for each user
CREATE TABLE IF NOT EXISTS credits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  available_workflows INTEGER DEFAULT 0,  -- Full workflows (4 tokens each)
  available_tokens INTEGER DEFAULT 0,      -- Individual tokens
  total_workflows_purchased INTEGER DEFAULT 0,
  total_tokens_purchased INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);

-- Subscriptions table (Modified: Now only for plan management, not workflow counting)
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK(plan IN ('free', 'daily', 'monthly', 'yearly')),
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  active BOOLEAN DEFAULT 1,
  payment_id TEXT,
  payment_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(active);

-- Purchases table (NEW: Track all workflow and token purchases)
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  purchase_type TEXT NOT NULL CHECK(purchase_type IN ('workflows', 'tokens', 'subscription')),
  amount INTEGER NOT NULL,  -- Number of workflows or tokens purchased
  price_eur REAL NOT NULL,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- Workflows table (Modified: tracks which tokens were used)
CREATE TABLE IF NOT EXISTS workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workflow_type TEXT NOT NULL CHECK(workflow_type IN ('full', 'partial')),
  current_step TEXT NOT NULL DEFAULT 'ideas', -- 'ideas', 'brainstorming', 'prd', 'prototype'

  -- Token usage tracking (NEW)
  tokens_used INTEGER DEFAULT 0,  -- How many tokens used so far (1-4)
  tokens_allocated INTEGER DEFAULT 0,  -- How many tokens allocated (workflow vs individual)

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

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_completed ON workflows(completed);

-- Token Usage table (NEW: Track individual token consumption)
CREATE TABLE IF NOT EXISTS token_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workflow_id INTEGER,
  tool_name TEXT NOT NULL CHECK(tool_name IN ('ideas', 'brainstorming', 'prd', 'prototype')),
  tokens_consumed INTEGER DEFAULT 1,
  usage_type TEXT NOT NULL CHECK(usage_type IN ('workflow', 'individual')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_workflow_id ON token_usage(workflow_id);

-- API Usage table (track costs - unchanged)
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

CREATE INDEX IF NOT EXISTS idx_api_usage_workflow_id ON api_usage(workflow_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Ad Rewards table (Modified: rewards now give tokens instead of workflows)
CREATE TABLE IF NOT EXISTS ad_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ad_type TEXT NOT NULL CHECK(ad_type IN ('rewarded_video', 'interstitial')),
  tokens_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ad_rewards_user_id ON ad_rewards(user_id);

-- ==========================================
-- VIEWS
-- ==========================================

-- View: User credits with subscription info
CREATE VIEW IF NOT EXISTS user_credits_view AS
SELECT
  u.id AS user_id,
  u.email,
  c.available_workflows,
  c.available_tokens,
  c.total_workflows_purchased,
  c.total_tokens_purchased,
  s.plan,
  s.active AS subscription_active,
  s.end_date AS subscription_end_date,
  CASE
    WHEN s.end_date IS NULL THEN 9999
    WHEN s.end_date > datetime('now') THEN
      CAST((julianday(s.end_date) - julianday('now')) AS INTEGER)
    ELSE 0
  END AS days_remaining
FROM users u
LEFT JOIN credits c ON u.id = c.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.active = 1;

-- View: Total API costs per user (unchanged)
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

-- View: Workflows with costs (unchanged)
CREATE VIEW IF NOT EXISTS workflows_with_costs AS
SELECT
  w.id AS workflow_id,
  w.user_id,
  u.email,
  w.workflow_type,
  w.current_step,
  w.tokens_used,
  w.tokens_allocated,
  w.completed,
  w.created_at,
  COUNT(au.id) AS api_calls,
  SUM(au.total_tokens) AS total_api_tokens,
  SUM(au.cost_eur) AS total_cost_eur
FROM workflows w
JOIN users u ON w.user_id = u.id
LEFT JOIN api_usage au ON w.id = au.workflow_id
GROUP BY w.id, w.user_id, u.email, w.workflow_type, w.current_step, w.tokens_used, w.tokens_allocated, w.completed, w.created_at;

-- View: Purchase history
CREATE VIEW IF NOT EXISTS purchase_history AS
SELECT
  p.id AS purchase_id,
  p.user_id,
  u.email,
  p.purchase_type,
  p.amount,
  p.price_eur,
  p.payment_id,
  p.payment_status,
  p.created_at
FROM purchases p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger: Auto-create credits entry for new users
CREATE TRIGGER IF NOT EXISTS create_credits_for_new_user
AFTER INSERT ON users
BEGIN
  INSERT INTO credits (user_id, available_workflows, available_tokens)
  VALUES (NEW.id, 0, 0);
END;

-- Trigger: Update credits.updated_at on change
CREATE TRIGGER IF NOT EXISTS update_credits_timestamp
AFTER UPDATE ON credits
BEGIN
  UPDATE credits SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger: Update workflows.updated_at on change
CREATE TRIGGER IF NOT EXISTS update_workflows_timestamp
AFTER UPDATE ON workflows
BEGIN
  UPDATE workflows SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ==========================================
-- INITIAL DATA / PRICING
-- ==========================================

-- Package Pricing (as comments for reference)
-- FREE: 3 workflows included on registration (12 tokens)
-- 5 Workflows = €5 (20 tokens)
-- 10 Tokens = €5
-- Daily Subscription: €5 = 3 workflows/day
-- Monthly Subscription: €29 = 20 workflows/month
-- Yearly Subscription: €249 = 240 workflows/year

-- Conversion:
-- 1 Workflow = 4 Tokens (ideas + brainstorming + prd + prototype)
