/**
 * Usage Module
 * Handles usage statistics, cost tracking, and ad rewards
 */

const { authenticateToken } = require('./auth');

let db;

/**
 * Initialize usage module
 */
function init(app, database) {
  db = database;

  // Register routes
  app.get('/api/usage/stats', authenticateToken, getUsageStats);
  app.get('/api/usage/costs', authenticateToken, getCostTracking);
  app.post('/api/usage/ad-reward', authenticateToken, claimAdReward);
}

/**
 * Get usage statistics
 */
async function getUsageStats(req, res) {
  try {
    const userId = req.user.userId;

    // Get total workflows
    const totalWorkflows = await new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM workflows WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        }
      );
    });

    // Get active subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Get total cost
    const costs = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
          SUM(au.cost_eur) as total_cost,
          AVG(au.cost_eur) as avg_cost_per_call
         FROM api_usage au
         JOIN workflows w ON au.workflow_id = w.id
         WHERE w.user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Get cost breakdown by step
    const costsByStep = await new Promise((resolve, reject) => {
      db.all(
        `SELECT
          au.step,
          COUNT(*) as calls,
          SUM(au.total_tokens) as total_tokens,
          SUM(au.cost_eur) as total_cost
         FROM api_usage au
         JOIN workflows w ON au.workflow_id = w.id
         WHERE w.user_id = ?
         GROUP BY au.step`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      totalWorkflows,
      workflowsRemaining: subscription ? subscription.workflows_remaining : 0,
      workflowsLimit: subscription ? subscription.workflows_limit : 0,
      workflowsUsed: subscription ? subscription.workflows_used : 0,
      plan: subscription ? subscription.plan : 'free',
      daysRemaining: subscription ? subscription.days_remaining : 0,
      costs: {
        total: costs.total_cost || 0,
        avgPerCall: costs.avg_cost_per_call || 0,
        avgPerWorkflow: totalWorkflows > 0 ? (costs.total_cost || 0) / totalWorkflows : 0,
        byStep: costsByStep
      }
    });

  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Statistiken' });
  }
}

/**
 * Get cost tracking (detailed)
 */
async function getCostTracking(req, res) {
  try {
    const userId = req.user.userId;

    // Get daily costs (last 30 days)
    const dailyCosts = await new Promise((resolve, reject) => {
      db.all(
        `SELECT
          DATE(au.created_at) as date,
          COUNT(DISTINCT w.id) as workflows,
          COUNT(au.id) as api_calls,
          SUM(au.total_tokens) as total_tokens,
          SUM(au.cost_eur) as total_cost
         FROM api_usage au
         JOIN workflows w ON au.workflow_id = w.id
         WHERE w.user_id = ?
           AND au.created_at >= DATE('now', '-30 days')
         GROUP BY DATE(au.created_at)
         ORDER BY date DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Get monthly costs (last 12 months)
    const monthlyCosts = await new Promise((resolve, reject) => {
      db.all(
        `SELECT
          strftime('%Y-%m', au.created_at) as month,
          COUNT(DISTINCT w.id) as workflows,
          COUNT(au.id) as api_calls,
          SUM(au.total_tokens) as total_tokens,
          SUM(au.cost_eur) as total_cost
         FROM api_usage au
         JOIN workflows w ON au.workflow_id = w.id
         WHERE w.user_id = ?
           AND au.created_at >= DATE('now', '-12 months')
         GROUP BY strftime('%Y-%m', au.created_at)
         ORDER BY month DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Get total cost
    const totalCost = await new Promise((resolve, reject) => {
      db.get(
        `SELECT SUM(au.cost_eur) as total
         FROM api_usage au
         JOIN workflows w ON au.workflow_id = w.id
         WHERE w.user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total || 0);
        }
      );
    });

    res.json({
      dailyCosts,
      monthlyCosts,
      totalCost
    });

  } catch (error) {
    console.error('Get cost tracking error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kostenübersicht' });
  }
}

/**
 * Claim ad reward (bonus workflows)
 */
async function claimAdReward(req, res) {
  const { adType, videosWatched = 1 } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!adType || !['rewarded_video', 'interstitial'].includes(adType)) {
    return res.status(400).json({ error: 'Ungültiger Ad-Typ' });
  }

  try {
    // Get active subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT subscription_id FROM active_subscriptions WHERE user_id = ? AND active = 1`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Kein aktives Abonnement gefunden' });
    }

    // Calculate bonus workflows
    let workflowsEarned = 0;
    if (adType === 'rewarded_video') {
      // 2 videos = 1 bonus workflow
      if (videosWatched >= 2) {
        workflowsEarned = Math.floor(videosWatched / 2);
      }
    } else if (adType === 'interstitial') {
      // Interstitial ads don't give bonuses (mandatory between steps)
      workflowsEarned = 0;
    }

    if (workflowsEarned === 0) {
      return res.json({
        message: 'Noch keine Belohnung verfügbar',
        videosWatched,
        videosNeeded: 2 - (videosWatched % 2)
      });
    }

    // Record ad reward
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO ad_rewards (user_id, subscription_id, ad_type, workflows_earned)
         VALUES (?, ?, ?, ?)`,
        [userId, subscription.subscription_id, adType, workflowsEarned],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Add workflows to subscription
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE subscriptions
         SET workflows_limit = workflows_limit + ?
         WHERE id = ? AND active = 1`,
        [workflowsEarned, subscription.subscription_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Get updated subscription
    const updatedSubscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    res.json({
      message: `${workflowsEarned} Bonus-Workflow(s) erhalten!`,
      workflowsEarned,
      subscription: {
        workflowsLimit: updatedSubscription.workflows_limit,
        workflowsUsed: updatedSubscription.workflows_used,
        workflowsRemaining: updatedSubscription.workflows_remaining
      }
    });

  } catch (error) {
    console.error('Claim ad reward error:', error);
    res.status(500).json({ error: 'Fehler beim Einlösen der Belohnung' });
  }
}

module.exports = {
  init
};
