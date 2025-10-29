/**
 * Subscriptions Module
 * Handles subscription plans and management
 */

const { authenticateToken } = require('./auth');

let db;

// Subscription plans
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    workflows: 3,
    duration: null // Lifetime
  },
  daily: {
    name: 'Täglich',
    price: 5,
    workflows: 3,
    duration: 1 // days
  },
  monthly: {
    name: 'Monatlich',
    price: 29,
    workflows: 20,
    duration: 30 // days
  },
  yearly: {
    name: 'Jährlich',
    price: 249,
    workflows: 240, // 20 per month * 12 months
    duration: 365 // days
  }
};

/**
 * Initialize subscriptions module
 */
function init(app, database) {
  db = database;

  // Register routes
  app.get('/api/subscriptions/plans', getPlans);
  app.get('/api/subscriptions/status', authenticateToken, getStatus);
  app.post('/api/subscriptions/create', authenticateToken, createSubscription);
  app.post('/api/subscriptions/cancel', authenticateToken, cancelSubscription);
  app.post('/api/subscriptions/upgrade', authenticateToken, upgradeSubscription);
}

/**
 * Get available plans
 */
function getPlans(req, res) {
  res.json({ plans: PLANS });
}

/**
 * Get subscription status
 */
async function getStatus(req, res) {
  try {
    const userId = req.user.userId;

    // Get active subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE user_id = ? ORDER BY subscription_id DESC LIMIT 1`,
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

    res.json({
      id: subscription.subscription_id,
      plan: subscription.plan,
      planName: PLANS[subscription.plan].name,
      price: PLANS[subscription.plan].price,
      workflowsLimit: subscription.workflows_limit,
      workflowsUsed: subscription.workflows_used,
      workflowsRemaining: subscription.workflows_remaining,
      startDate: subscription.start_date,
      endDate: subscription.end_date,
      daysRemaining: subscription.days_remaining,
      active: subscription.active
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Abonnementstatus' });
  }
}

/**
 * Create new subscription
 */
async function createSubscription(req, res) {
  const { plan, paymentId } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: 'Ungültiger Plan' });
  }

  if (plan === 'free') {
    return res.status(400).json({ error: 'Free Plan kann nicht gekauft werden' });
  }

  try {
    // Deactivate old subscriptions
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE subscriptions SET active = 0 WHERE user_id = ? AND active = 1',
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Calculate end date
    let endDate = null;
    if (PLANS[plan].duration) {
      const startDate = new Date();
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + PLANS[plan].duration);
    }

    // Create new subscription
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (user_id, plan, workflows_limit, workflows_used, end_date, payment_id, payment_status, active)
         VALUES (?, ?, ?, 0, ?, ?, 'completed', 1)`,
        [userId, plan, PLANS[plan].workflows, endDate ? endDate.toISOString() : null, paymentId || null],
        function(err) {
          if (err) reject(err);
          else resolve({ subscriptionId: this.lastID });
        }
      );
    });

    // Get the new subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE subscription_id = ?`,
        [result.subscriptionId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    res.status(201).json({
      message: 'Abonnement erfolgreich erstellt',
      subscription: {
        id: subscription.subscription_id,
        plan: subscription.plan,
        planName: PLANS[subscription.plan].name,
        price: PLANS[subscription.plan].price,
        workflowsLimit: subscription.workflows_limit,
        workflowsUsed: subscription.workflows_used,
        workflowsRemaining: subscription.workflows_remaining,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        daysRemaining: subscription.days_remaining,
        active: subscription.active
      }
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Abonnements' });
  }
}

/**
 * Cancel subscription
 */
async function cancelSubscription(req, res) {
  try {
    const userId = req.user.userId;

    // Get current subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE user_id = ? ORDER BY subscription_id DESC LIMIT 1`,
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

    if (subscription.plan === 'free') {
      return res.status(400).json({ error: 'Free Plan kann nicht gekündigt werden' });
    }

    // Deactivate subscription
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE subscriptions SET active = 0 WHERE id = ?',
        [subscription.subscription_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Create new free subscription
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (user_id, plan, workflows_limit, workflows_used, active)
         VALUES (?, 'free', 3, 0, 1)`,
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      message: 'Abonnement erfolgreich gekündigt',
      newPlan: 'free'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Fehler beim Kündigen des Abonnements' });
  }
}

/**
 * Upgrade subscription
 */
async function upgradeSubscription(req, res) {
  const { newPlan, paymentId } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!newPlan || !PLANS[newPlan]) {
    return res.status(400).json({ error: 'Ungültiger Plan' });
  }

  if (newPlan === 'free') {
    return res.status(400).json({ error: 'Kann nicht auf Free Plan upgraden' });
  }

  try {
    // Get current subscription
    const currentSubscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE user_id = ? ORDER BY subscription_id DESC LIMIT 1`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!currentSubscription) {
      return res.status(404).json({ error: 'Kein aktives Abonnement gefunden' });
    }

    // Check if upgrade makes sense
    const planHierarchy = ['free', 'daily', 'monthly', 'yearly'];
    const currentIndex = planHierarchy.indexOf(currentSubscription.plan);
    const newIndex = planHierarchy.indexOf(newPlan);

    if (newIndex <= currentIndex) {
      return res.status(400).json({ error: 'Neuer Plan muss höher sein als aktueller Plan' });
    }

    // Deactivate current subscription
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE subscriptions SET active = 0 WHERE id = ?',
        [currentSubscription.subscription_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Calculate end date
    let endDate = null;
    if (PLANS[newPlan].duration) {
      const startDate = new Date();
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + PLANS[newPlan].duration);
    }

    // Create new subscription
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (user_id, plan, workflows_limit, workflows_used, end_date, payment_id, payment_status, active)
         VALUES (?, ?, ?, 0, ?, ?, 'completed', 1)`,
        [userId, newPlan, PLANS[newPlan].workflows, endDate ? endDate.toISOString() : null, paymentId || null],
        function(err) {
          if (err) reject(err);
          else resolve({ subscriptionId: this.lastID });
        }
      );
    });

    // Get the new subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM active_subscriptions WHERE subscription_id = ?`,
        [result.subscriptionId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    res.json({
      message: 'Abonnement erfolgreich geupgradet',
      subscription: {
        id: subscription.subscription_id,
        plan: subscription.plan,
        planName: PLANS[subscription.plan].name,
        price: PLANS[subscription.plan].price,
        workflowsLimit: subscription.workflows_limit,
        workflowsUsed: subscription.workflows_used,
        workflowsRemaining: subscription.workflows_remaining,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        daysRemaining: subscription.days_remaining,
        active: subscription.active
      }
    });

  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Fehler beim Upgraden des Abonnements' });
  }
}

/**
 * Check if user has workflows remaining
 */
async function hasWorkflowsRemaining(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT workflows_remaining FROM active_subscriptions WHERE user_id = ? AND active = 1`,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row && row.workflows_remaining > 0);
      }
    );
  });
}

/**
 * Decrement workflow count
 */
async function decrementWorkflowCount(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE subscriptions
       SET workflows_used = workflows_used + 1
       WHERE user_id = ? AND active = 1`,
      [userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  init,
  PLANS,
  hasWorkflowsRemaining,
  decrementWorkflowCount
};
