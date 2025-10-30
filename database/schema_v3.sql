-- Von der Idee zum Prototyp - Database Schema V3
-- SQLite Database
-- Tool Usage Tracking & Smart Workflow Validation

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT DEFAULT '06853/8579828',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Subscriptions table (Updated with Weekly plan)
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK(plan IN ('free', 'daily', 'weekly', 'monthly', 'yearly')),
  workflows_limit INTEGER NOT NULL,
  tokens_limit INTEGER NOT NULL,
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  active BOOLEAN DEFAULT 1,
  payment_id TEXT,
  payment_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans Configuration
-- Free: 3 workflows (12 tokens) - Testversion
-- Daily: 3 workflows OR 12 tokens
-- Weekly: 8 workflows OR 32 tokens
-- Monthly: 24 workflows OR 96 tokens
-- Yearly: 24 workflows/month OR 96 tokens/month

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(active);

-- Tool Usage Tracking (NEW: Track individual tool usage per subscription period)
CREATE TABLE IF NOT EXISTS tool_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  tool_name TEXT NOT NULL CHECK(tool_name IN ('ideas', 'brainstorming', 'prd', 'prototype')),
  workflow_id INTEGER,
  usage_type TEXT NOT NULL CHECK(usage_type IN ('workflow', 'individual')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_subscription_id ON tool_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);

-- Tool Limits per Subscription (NEW: Define limits per tool per subscription type)
CREATE TABLE IF NOT EXISTS tool_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan TEXT NOT NULL UNIQUE CHECK(plan IN ('free', 'daily', 'weekly', 'monthly', 'yearly')),
  ideas_limit INTEGER NOT NULL,
  brainstorming_limit INTEGER NOT NULL,
  prd_limit INTEGER NOT NULL,
  prototype_limit INTEGER NOT NULL,
  min_complete_workflows INTEGER NOT NULL, -- Minimum vollständige Workflows garantiert
  UNIQUE(plan)
);

-- Insert tool limits for each plan
INSERT OR REPLACE INTO tool_limits (plan, ideas_limit, brainstorming_limit, prd_limit, prototype_limit, min_complete_workflows) VALUES
  ('free', 2, 2, 2, 1, 3),      -- Testversion: mindestens 3 komplette Workflows möglich
  ('daily', 3, 3, 3, 3, 3),     -- Tagesabo: 3 komplette Workflows
  ('weekly', 8, 8, 8, 8, 8),    -- Wochenabo: 8 komplette Workflows
  ('monthly', 24, 24, 24, 24, 24), -- Monatsabo: 24 komplette Workflows
  ('yearly', 24, 24, 24, 24, 24);  -- Jahresabo: 24/Monat

-- Workflows table (Enhanced with completion tracking)
CREATE TABLE IF NOT EXISTS workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  workflow_type TEXT NOT NULL CHECK(workflow_type IN ('full', 'partial')),

  -- Current state
  current_step TEXT NOT NULL DEFAULT 'ideas', -- 'ideas', 'brainstorming', 'prd', 'prototype', 'completed'

  -- Step completion tracking
  ideas_completed BOOLEAN DEFAULT 0,
  brainstorming_completed BOOLEAN DEFAULT 0,
  prd_completed BOOLEAN DEFAULT 0,
  prototype_completed BOOLEAN DEFAULT 0,

  -- Workflow data
  ideas_json TEXT,
  selected_idea_json TEXT,
  brainstorming_json TEXT,
  prd_text TEXT,
  prototype_html TEXT,

  -- Metadata
  completed BOOLEAN DEFAULT 0,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_subscription_id ON workflows(subscription_id);
CREATE INDEX IF NOT EXISTS idx_workflows_completed ON workflows(completed);

-- Purchases table (Updated: Only available with active paid subscription)
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  purchase_type TEXT NOT NULL CHECK(purchase_type IN ('workflows', 'tokens')),
  amount INTEGER NOT NULL,
  price_eur REAL NOT NULL,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_subscription_id ON purchases(subscription_id);

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

-- Ad Rewards table
CREATE TABLE IF NOT EXISTS ad_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  ad_type TEXT NOT NULL CHECK(ad_type IN ('rewarded_video', 'interstitial')),
  tokens_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ad_rewards_user_id ON ad_rewards(user_id);

-- ==========================================
-- VIEWS
-- ==========================================

-- View: Tool usage summary per user and subscription
CREATE VIEW IF NOT EXISTS tool_usage_summary AS
SELECT
  tu.user_id,
  tu.subscription_id,
  s.plan,
  COUNT(CASE WHEN tu.tool_name = 'ideas' THEN 1 END) AS ideas_used,
  COUNT(CASE WHEN tu.tool_name = 'brainstorming' THEN 1 END) AS brainstorming_used,
  COUNT(CASE WHEN tu.tool_name = 'prd' THEN 1 END) AS prd_used,
  COUNT(CASE WHEN tu.tool_name = 'prototype' THEN 1 END) AS prototype_used,
  tl.ideas_limit,
  tl.brainstorming_limit,
  tl.prd_limit,
  tl.prototype_limit,
  tl.min_complete_workflows
FROM tool_usage tu
JOIN subscriptions s ON tu.subscription_id = s.id
JOIN tool_limits tl ON s.plan = tl.plan
WHERE s.active = 1
GROUP BY tu.user_id, tu.subscription_id, s.plan, tl.ideas_limit, tl.brainstorming_limit, tl.prd_limit, tl.prototype_limit, tl.min_complete_workflows;

-- View: Workflow completion summary
CREATE VIEW IF NOT EXISTS workflow_completion_summary AS
SELECT
  w.user_id,
  w.subscription_id,
  s.plan,
  COUNT(*) AS total_workflows,
  COUNT(CASE WHEN w.completed = 1 THEN 1 END) AS completed_workflows,
  COUNT(CASE WHEN w.workflow_type = 'partial' THEN 1 END) AS partial_workflows,
  tl.min_complete_workflows,
  tl.min_complete_workflows - COUNT(CASE WHEN w.completed = 1 THEN 1 END) AS workflows_remaining_guaranteed
FROM workflows w
JOIN subscriptions s ON w.subscription_id = s.id
JOIN tool_limits tl ON s.plan = tl.plan
WHERE s.active = 1
GROUP BY w.user_id, w.subscription_id, s.plan, tl.min_complete_workflows;

-- View: User status (complete overview)
CREATE VIEW IF NOT EXISTS user_status_view AS
SELECT
  u.id AS user_id,
  u.email,
  u.phone,
  s.id AS subscription_id,
  s.plan,
  s.workflows_limit,
  s.tokens_limit,
  s.active AS subscription_active,
  s.start_date AS subscription_start,
  s.end_date AS subscription_end,
  CASE
    WHEN s.end_date IS NULL THEN 9999
    WHEN s.end_date > datetime('now') THEN
      CAST((julianday(s.end_date) - julianday('now')) AS INTEGER)
    ELSE 0
  END AS days_remaining,

  -- Tool usage
  COALESCE(tus.ideas_used, 0) AS ideas_used,
  COALESCE(tus.brainstorming_used, 0) AS brainstorming_used,
  COALESCE(tus.prd_used, 0) AS prd_used,
  COALESCE(tus.prototype_used, 0) AS prototype_used,

  -- Tool limits
  COALESCE(tl.ideas_limit, 0) AS ideas_limit,
  COALESCE(tl.brainstorming_limit, 0) AS brainstorming_limit,
  COALESCE(tl.prd_limit, 0) AS prd_limit,
  COALESCE(tl.prototype_limit, 0) AS prototype_limit,
  COALESCE(tl.min_complete_workflows, 0) AS min_complete_workflows,

  -- Remaining usage
  COALESCE(tl.ideas_limit, 0) - COALESCE(tus.ideas_used, 0) AS ideas_remaining,
  COALESCE(tl.brainstorming_limit, 0) - COALESCE(tus.brainstorming_used, 0) AS brainstorming_remaining,
  COALESCE(tl.prd_limit, 0) - COALESCE(tus.prd_used, 0) AS prd_remaining,
  COALESCE(tl.prototype_limit, 0) - COALESCE(tus.prototype_used, 0) AS prototype_remaining,

  -- Workflow completion
  COALESCE(wcs.completed_workflows, 0) AS completed_workflows,
  COALESCE(wcs.workflows_remaining_guaranteed, tl.min_complete_workflows) AS workflows_remaining_guaranteed

FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.active = 1
LEFT JOIN tool_limits tl ON s.plan = tl.plan
LEFT JOIN tool_usage_summary tus ON u.id = tus.user_id AND s.id = tus.subscription_id
LEFT JOIN workflow_completion_summary wcs ON u.id = wcs.user_id AND s.id = wcs.subscription_id;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger: Update workflow updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_workflow_timestamp
AFTER UPDATE ON workflows
BEGIN
  UPDATE workflows SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger: Mark workflow as completed when all steps done
CREATE TRIGGER IF NOT EXISTS check_workflow_completion
AFTER UPDATE ON workflows
WHEN NEW.ideas_completed = 1
  AND NEW.brainstorming_completed = 1
  AND NEW.prd_completed = 1
  AND NEW.prototype_completed = 1
  AND NEW.completed = 0
BEGIN
  UPDATE workflows
  SET completed = 1,
      completed_at = CURRENT_TIMESTAMP,
      current_step = 'completed'
  WHERE id = NEW.id;
END;

-- ==========================================
-- FUNCTIONS (Implemented in backend)
-- ==========================================

-- Function: canUseToolAgain(userId, subscriptionId, toolName)
--   Returns: boolean - whether user can use this tool again
--   Logic: Check tool_usage count vs tool_limits for this plan

-- Function: canCompleteWorkflow(userId, subscriptionId)
--   Returns: boolean - whether user can still complete a full workflow
--   Logic: Check if enough of each tool is available to complete at least min_complete_workflows

-- Function: recommendedAction(userId, subscriptionId)
--   Returns: string - recommendation for user
--   Logic: Based on current usage, recommend which tools to use to maximize completed workflows
-- Promo Codes System für Influencer & Testphase
-- Sicheres Hash-basiertes System

-- Promo Codes Tabelle
CREATE TABLE IF NOT EXISTS promo_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_hash TEXT NOT NULL UNIQUE, -- SHA256 Hash des Codes
  code_type TEXT NOT NULL CHECK(code_type IN ('influencer', 'partner', 'special')),
  name TEXT NOT NULL, -- z.B. "INFLUENCER2024"
  description TEXT,

  -- Benefits
  workflows_bonus INTEGER DEFAULT 0,
  tokens_bonus INTEGER DEFAULT 0,
  duration_days INTEGER DEFAULT 0, -- 0 = unbegrenzt

  -- Validity
  valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
  valid_until DATETIME, -- NULL = unbegrenzt

  -- Usage limits
  max_uses INTEGER, -- NULL = unbegrenzt
  current_uses INTEGER DEFAULT 0,

  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT, -- z.B. "admin" oder "system"
  active INTEGER DEFAULT 1 CHECK(active IN (0, 1))
);

-- Code Redemptions Tabelle (wer hat welchen Code eingelöst)
CREATE TABLE IF NOT EXISTS code_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  promo_code_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- Was wurde gewährt
  workflows_granted INTEGER NOT NULL,
  tokens_granted INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,

  -- Zeitstempel
  redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME, -- Wann läuft der Bonus ab

  -- Tracking
  first_usage_at DATETIME, -- Wann wurde erste Generierung gestartet (Testphase beginnt)

  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id),
  FOREIGN KEY (user_id) REFERENCES users(id),

  -- Ein User kann einen Code nur einmal einlösen
  UNIQUE(promo_code_id, user_id)
);

-- Index für schnelle Lookups
CREATE INDEX IF NOT EXISTS idx_code_hash ON promo_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON code_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_promo ON code_redemptions(promo_code_id);

-- View: Aktive Promo Codes
CREATE VIEW IF NOT EXISTS active_promo_codes AS
SELECT
  pc.*,
  (pc.max_uses IS NULL OR pc.current_uses < pc.max_uses) AS has_uses_remaining,
  (pc.valid_until IS NULL OR pc.valid_until > CURRENT_TIMESTAMP) AS is_valid_time
FROM promo_codes pc
WHERE pc.active = 1;

-- View: User Redemptions mit Details
CREATE VIEW IF NOT EXISTS user_code_redemptions AS
SELECT
  cr.*,
  pc.name AS code_name,
  pc.code_type,
  pc.description,
  u.email AS user_email,
  CASE
    WHEN cr.expires_at IS NULL THEN 1
    WHEN cr.expires_at > CURRENT_TIMESTAMP THEN 1
    ELSE 0
  END AS is_active,
  CASE
    WHEN cr.first_usage_at IS NULL THEN 'unused'
    WHEN cr.expires_at IS NULL THEN 'active_lifetime'
    WHEN cr.expires_at > CURRENT_TIMESTAMP THEN 'active'
    ELSE 'expired'
  END AS status
FROM code_redemptions cr
JOIN promo_codes pc ON cr.promo_code_id = pc.id
JOIN users u ON cr.user_id = u.id;

-- Influencer Code einfügen (wird im Backend gehasht)
-- SHA256("INFLUENCER-2W-FREE-2025") = gehashed
-- Dieser Code wird separat generiert und eingefügt
