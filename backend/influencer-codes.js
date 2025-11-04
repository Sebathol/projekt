/**
 * Influencer Code System
 * Allows influencers to give away free workflows to their audience
 */

const crypto = require('crypto');

/**
 * Initialize influencer codes database tables
 */
function initInfluencerCodesTables(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Influencer codes table
      db.run(`
        CREATE TABLE IF NOT EXISTS influencer_codes (
          code_id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          workflows_amount INTEGER NOT NULL DEFAULT 20,
          max_uses INTEGER DEFAULT NULL,
          current_uses INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME DEFAULT NULL,
          active INTEGER DEFAULT 1,
          description TEXT DEFAULT NULL
        )
      `);

      // Code redemptions tracking
      db.run(`
        CREATE TABLE IF NOT EXISTS code_redemptions (
          redemption_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          code_id INTEGER NOT NULL,
          workflows_granted INTEGER NOT NULL,
          redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id),
          FOREIGN KEY (code_id) REFERENCES influencer_codes(code_id),
          UNIQUE(user_id, code_id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

/**
 * Generate a random influencer code
 */
function generateCode(prefix = 'INF') {
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${random}`;
}

/**
 * Create a new influencer code
 */
async function createInfluencerCode(db, options = {}) {
  const {
    code = generateCode(),
    workflowsAmount = 20,
    maxUses = null,
    expiresAt = null,
    description = null
  } = options;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO influencer_codes (code, workflows_amount, max_uses, expires_at, description)
       VALUES (?, ?, ?, ?, ?)`,
      [code, workflowsAmount, maxUses, expiresAt, description],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            reject(new Error('Dieser Code existiert bereits'));
          } else {
            reject(err);
          }
        } else {
          resolve({
            codeId: this.lastID,
            code,
            workflowsAmount,
            maxUses,
            expiresAt,
            description
          });
        }
      }
    );
  });
}

/**
 * Validate a code before redemption
 */
async function validateCode(db, code, userId) {
  return new Promise((resolve, reject) => {
    // Get code details
    db.get(
      `SELECT * FROM influencer_codes WHERE code = ? AND active = 1`,
      [code.toUpperCase()],
      (err, codeData) => {
        if (err) {
          reject(err);
          return;
        }

        if (!codeData) {
          resolve({ valid: false, reason: 'Code ungültig oder deaktiviert' });
          return;
        }

        // Check if expired
        if (codeData.expires_at) {
          const now = new Date();
          const expiresAt = new Date(codeData.expires_at);
          if (now > expiresAt) {
            resolve({ valid: false, reason: 'Code ist abgelaufen' });
            return;
          }
        }

        // Check if max uses reached
        if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
          resolve({ valid: false, reason: 'Code-Limit erreicht' });
          return;
        }

        // Check if user already redeemed this code
        db.get(
          `SELECT * FROM code_redemptions WHERE user_id = ? AND code_id = ?`,
          [userId, codeData.code_id],
          (err, redemption) => {
            if (err) {
              reject(err);
              return;
            }

            if (redemption) {
              resolve({ valid: false, reason: 'Code bereits eingelöst' });
              return;
            }

            // Code is valid!
            resolve({
              valid: true,
              codeId: codeData.code_id,
              workflowsAmount: codeData.workflows_amount,
              description: codeData.description
            });
          }
        );
      }
    );
  });
}

/**
 * Redeem a code for a user
 */
async function redeemCode(db, userId, code) {
  // Validate code first
  const validation = await validateCode(db, code, userId);

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Record redemption
      db.run(
        `INSERT INTO code_redemptions (user_id, code_id, workflows_granted)
         VALUES (?, ?, ?)`,
        [userId, validation.codeId, validation.workflowsAmount],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }

          const redemptionId = this.lastID;

          // Increment code usage counter
          db.run(
            `UPDATE influencer_codes
             SET current_uses = current_uses + 1
             WHERE code_id = ?`,
            [validation.codeId],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }

              // Grant workflows to user by creating a special subscription
              db.run(
                `INSERT INTO subscriptions (user_id, plan, start_date, workflows_used, workflows_limit, source)
                 VALUES (?, 'influencer_bonus', datetime('now'), 0, ?, 'code:' || ?)`,
                [userId, validation.workflowsAmount, code.toUpperCase()],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                  }

                  const subscriptionId = this.lastID;

                  // Activate the bonus subscription
                  db.run(
                    `INSERT INTO active_subscriptions (user_id, subscription_id, active)
                     VALUES (?, ?, 1)`,
                    [userId, subscriptionId],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                      }

                      db.run('COMMIT', (err) => {
                        if (err) {
                          db.run('ROLLBACK');
                          reject(err);
                        } else {
                          resolve({
                            success: true,
                            redemptionId,
                            subscriptionId,
                            workflowsGranted: validation.workflowsAmount,
                            message: `Code erfolgreich eingelöst! Du hast ${validation.workflowsAmount} Workflows erhalten.`
                          });
                        }
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}

/**
 * Get code statistics
 */
async function getCodeStats(db, codeId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT
        ic.*,
        COUNT(cr.redemption_id) as total_redemptions,
        SUM(cr.workflows_granted) as total_workflows_granted
       FROM influencer_codes ic
       LEFT JOIN code_redemptions cr ON ic.code_id = cr.code_id
       WHERE ic.code_id = ?
       GROUP BY ic.code_id`,
      [codeId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

/**
 * List all codes (admin function)
 */
async function listAllCodes(db) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        ic.*,
        COUNT(cr.redemption_id) as redemptions,
        SUM(cr.workflows_granted) as total_workflows_granted
       FROM influencer_codes ic
       LEFT JOIN code_redemptions cr ON ic.code_id = cr.code_id
       GROUP BY ic.code_id
       ORDER BY ic.created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

/**
 * Deactivate a code
 */
async function deactivateCode(db, codeId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE influencer_codes SET active = 0 WHERE code_id = ?`,
      [codeId],
      function(err) {
        if (err) reject(err);
        else resolve({ success: true, affectedRows: this.changes });
      }
    );
  });
}

/**
 * Get user's redeemed codes
 */
async function getUserRedeemedCodes(db, userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        cr.*,
        ic.code,
        ic.description
       FROM code_redemptions cr
       JOIN influencer_codes ic ON cr.code_id = ic.code_id
       WHERE cr.user_id = ?
       ORDER BY cr.redeemed_at DESC`,
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

module.exports = {
  initInfluencerCodesTables,
  generateCode,
  createInfluencerCode,
  validateCode,
  redeemCode,
  getCodeStats,
  listAllCodes,
  deactivateCode,
  getUserRedeemedCodes
};
