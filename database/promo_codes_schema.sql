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
