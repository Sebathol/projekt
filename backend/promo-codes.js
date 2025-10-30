/**
 * Promo Codes Module
 * Secure hash-based promo code system for influencers and partners
 */

const crypto = require('crypto');
const { authenticateToken } = require('./auth');

let db;

// Rate limiting: Max 5 Versuche pro Stunde pro User
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

/**
 * Initialize promo codes module
 */
function init(app, database) {
  db = database;

  // Routes
  app.post('/api/promo/redeem', authenticateToken, redeemCode);
  app.get('/api/promo/my-codes', authenticateToken, getMyRedemptions);
  app.post('/api/promo/start-trial', authenticateToken, startTrialPeriod); // Wird bei erster Generierung aufgerufen
}

/**
 * Hash a promo code using SHA256
 */
function hashCode(code) {
  return crypto.createHash('sha256').update(code.toUpperCase().trim()).digest('hex');
}

/**
 * Check rate limit for user
 */
function checkRateLimit(userId) {
  const now = Date.now();
  const userAttempts = rateLimitMap.get(userId) || [];

  // Remove old attempts outside the time window
  const recentAttempts = userAttempts.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentAttempts.length >= RATE_LIMIT_MAX) {
    const oldestAttempt = Math.min(...recentAttempts);
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestAttempt)) / 60000);
    return {
      allowed: false,
      waitMinutes: waitTime
    };
  }

  // Add current attempt
  recentAttempts.push(now);
  rateLimitMap.set(userId, recentAttempts);

  return { allowed: true };
}

/**
 * Redeem a promo code
 */
async function redeemCode(req, res) {
  try {
    const { code } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Ungültiger Code' });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Zu viele Versuche',
        message: `Bitte warte ${rateLimit.waitMinutes} Minuten und versuche es erneut.`
      });
    }

    // Hash the code
    const codeHash = hashCode(code);

    // Find promo code
    const promoCode = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_promo_codes
         WHERE code_hash = ?
         AND has_uses_remaining = 1
         AND is_valid_time = 1`,
        [codeHash],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!promoCode) {
      return res.status(404).json({
        error: 'Code ungültig',
        message: 'Dieser Code ist ungültig, abgelaufen oder bereits vollständig verwendet.'
      });
    }

    // Check if user already redeemed this code
    const existingRedemption = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM code_redemptions
         WHERE promo_code_id = ? AND user_id = ?`,
        [promoCode.id, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existingRedemption) {
      return res.status(409).json({
        error: 'Bereits eingelöst',
        message: 'Du hast diesen Code bereits eingelöst.'
      });
    }

    // Calculate expiration (if duration_days is set)
    let expiresAt = null;
    if (promoCode.duration_days > 0) {
      // Wichtig: Ablauf beginnt erst bei erster Nutzung (first_usage_at)
      // Wir setzen expires_at auf NULL und setzen es später wenn first_usage_at gesetzt wird
      expiresAt = null; // Wird bei startTrialPeriod() gesetzt
    }

    // Create redemption
    const redemptionId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO code_redemptions
         (promo_code_id, user_id, workflows_granted, tokens_granted, duration_days, expires_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          promoCode.id,
          userId,
          promoCode.workflows_bonus,
          promoCode.tokens_bonus,
          promoCode.duration_days,
          expiresAt
        ],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // Increment usage counter
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE promo_codes
         SET current_uses = current_uses + 1
         WHERE id = ?`,
        [promoCode.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Grant workflows/tokens to user's subscription
    await grantBonusToUser(userId, promoCode.workflows_bonus, promoCode.tokens_bonus);

    res.json({
      success: true,
      message: 'Code erfolgreich eingelöst!',
      bonus: {
        workflows: promoCode.workflows_bonus,
        tokens: promoCode.tokens_bonus,
        durationDays: promoCode.duration_days,
        description: promoCode.description
      },
      note: promoCode.duration_days > 0
        ? `Deine ${promoCode.duration_days}-Tage Testphase beginnt mit deiner ersten Generierung.`
        : 'Bonus wurde sofort aktiviert.'
    });

  } catch (error) {
    console.error('Redeem code error:', error);
    res.status(500).json({ error: 'Fehler beim Einlösen des Codes' });
  }
}

/**
 * Start trial period (called when user starts first generation)
 */
async function startTrialPeriod(req, res) {
  try {
    const userId = req.user.userId;

    // Find active redemptions without first_usage_at
    const pendingRedemptions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM code_redemptions
         WHERE user_id = ?
         AND first_usage_at IS NULL
         AND duration_days > 0`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    if (pendingRedemptions.length === 0) {
      return res.json({
        success: true,
        message: 'Keine ausstehenden Testphasen'
      });
    }

    // Start trial period for all pending redemptions
    const now = new Date().toISOString();
    const started = [];

    for (const redemption of pendingRedemptions) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + redemption.duration_days);

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE code_redemptions
           SET first_usage_at = ?,
               expires_at = ?
           WHERE id = ?`,
          [now, expiresAt.toISOString(), redemption.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      started.push({
        workflows: redemption.workflows_granted,
        tokens: redemption.tokens_granted,
        days: redemption.duration_days,
        expiresAt: expiresAt.toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Testphase gestartet!',
      trials: started
    });

  } catch (error) {
    console.error('Start trial period error:', error);
    res.status(500).json({ error: 'Fehler beim Starten der Testphase' });
  }
}

/**
 * Grant bonus workflows/tokens to user
 */
async function grantBonusToUser(userId, workflows, tokens) {
  // Get current subscription
  const subscription = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM subscriptions WHERE user_id = ? AND active = 1 ORDER BY id DESC LIMIT 1`,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });

  if (!subscription) {
    throw new Error('Kein aktives Abonnement gefunden');
  }

  // Update subscription limits
  await new Promise((resolve, reject) => {
    db.run(
      `UPDATE subscriptions
       SET workflows_limit = workflows_limit + ?,
           tokens_limit = tokens_limit + ?
       WHERE id = ?`,
      [workflows, tokens, subscription.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Get user's code redemptions
 */
async function getMyRedemptions(req, res) {
  try {
    const userId = req.user.userId;

    const redemptions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM user_code_redemptions WHERE user_id = ? ORDER BY redeemed_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    res.json({ redemptions });

  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Einlösungen' });
  }
}

/**
 * Generate a secure promo code
 */
function generatePromoCode(prefix = 'PROMO', length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Ohne 0, O, 1, I zur Vermeidung von Verwechslungen
  let code = prefix + '-';

  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

/**
 * Insert a promo code (for admin use)
 */
async function insertPromoCode(codeString, config) {
  const codeHash = hashCode(codeString);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO promo_codes
       (code_hash, code_type, name, description, workflows_bonus, tokens_bonus, duration_days, valid_until, max_uses, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codeHash,
        config.type || 'special',
        config.name,
        config.description,
        config.workflows || 0,
        config.tokens || 0,
        config.durationDays || 0,
        config.validUntil || null,
        config.maxUses || null,
        config.createdBy || 'system'
      ],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, code: codeString });
      }
    );
  });
}

module.exports = {
  init,
  hashCode,
  generatePromoCode,
  insertPromoCode
};
