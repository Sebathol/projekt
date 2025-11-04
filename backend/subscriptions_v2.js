/**
 * Subscriptions Module V3
 * Handles subscription plans with HYBRID API System
 *
 * NEUES HYBRID-MODELL:
 * - FREE: 3 Workflows (Gemini API - kostenlos!)
 * - DAY: 6 Workflows für €4,99/Tag (Claude API)
 * - MONTH: 30 Workflows für €29,99/Monat (Claude API)
 * - YEAR: 360 Workflows für €249,99/Jahr (Claude API)
 *
 * Paid Plans: Nachkauf möglich für €1,99/Workflow
 */

const { authenticateToken } = require('./auth');

let db;

// Subscription Plans Configuration - HYBRID API SYSTEM
const PLANS = {
  free: {
    name: 'Free',
    api: 'gemini',      // Uses Gemini API (Google)
    price: 0,
    workflows: 3,
    tokens: 12,
    duration: null,     // Lifetime
    toolLimits: {
      ideas: 3,
      brainstorming: 3,
      prd: 3,
      prototype: 3
    },
    minCompleteWorkflows: 3,
    canPurchaseExtra: false,  // No purchase option for FREE
    unlimited: false,
    description: 'Kostenlos testen mit Gemini AI'
  },
  day: {
    name: 'Tag-Abo',
    api: 'claude',      // Uses Claude API (Anthropic)
    price: 4.99,
    workflows: 6,
    tokens: 24,
    duration: 1,        // 1 day
    toolLimits: {
      ideas: 6,
      brainstorming: 6,
      prd: 6,
      prototype: 6
    },
    minCompleteWorkflows: 6,
    canPurchaseExtra: true,   // Can buy extra workflows
    extraWorkflowPrice: 1.99, // €1,99 per additional workflow
    unlimited: false,
    description: 'Perfekt für schnelle Projekte'
  },
  month: {
    name: 'Monats-Abo',
    api: 'claude',      // Uses Claude API (Anthropic)
    price: 29.99,
    workflows: 30,
    tokens: 120,
    duration: 30,       // 30 days
    toolLimits: {
      ideas: 30,
      brainstorming: 30,
      prd: 30,
      prototype: 30
    },
    minCompleteWorkflows: 30,
    canPurchaseExtra: true,   // Can buy extra workflows
    extraWorkflowPrice: 1.99, // €1,99 per additional workflow
    unlimited: false,
    description: 'Ideal für regelmäßige Nutzung',
    popular: true       // Most popular plan
  },
  year: {
    name: 'Jahres-Abo',
    api: 'claude',      // Uses Claude API (Anthropic)
    price: 249.99,
    workflows: 360,     // 30 per month
    tokens: 1440,
    duration: 365,      // 365 days
    toolLimits: {
      ideas: 360,
      brainstorming: 360,
      prd: 360,
      prototype: 360
    },
    minCompleteWorkflows: 360,
    canPurchaseExtra: true,   // Can buy extra workflows
    extraWorkflowPrice: 1.99, // €1,99 per additional workflow
    unlimited: false,
    description: 'Beste Ersparnis für Power-User',
    savings: 'Spare €109,89 gegenüber Monats-Abo!' // 12 × 29.99 = 359.88 vs 249.99
  }
};

// Extra Purchase Options (nur mit aktivem Paid-Abo: day, month, year)
const EXTRA_PURCHASES = {
  single_workflow: {
    amount: 1,
    price: 1.99,  // €1,99 per workflow
    description: 'Einzelner Workflow'
  },
  workflow_pack_5: {
    amount: 5,
    price: 8.99,  // €1,80 per workflow (10% discount)
    description: '5er-Pack (10% Ersparnis)'
  },
  workflow_pack_10: {
    amount: 10,
    price: 15.99, // €1,60 per workflow (20% discount)
    description: '10er-Pack (20% Ersparnis)'
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
  app.get('/api/subscriptions/usage', authenticateToken, getUsageStatus);
  app.post('/api/subscriptions/purchase-extra', authenticateToken, purchaseExtra);
}

/**
 * Get available plans
 */
function getPlans(req, res) {
  res.json({ plans: PLANS, extraPurchases: EXTRA_PURCHASES });
}

/**
 * Get subscription status
 */
async function getStatus(req, res) {
  try {
    const userId = req.user.userId;

    const status = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM user_status_view WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!status) {
      return res.status(404).json({ error: 'Kein Abonnement gefunden' });
    }

    const plan = PLANS[status.plan];

    res.json({
      subscription: {
        id: status.subscription_id,
        plan: status.plan,
        planName: plan.name,
        price: plan.price,
        active: status.subscription_active,
        startDate: status.subscription_start,
        endDate: status.subscription_end,
        daysRemaining: status.days_remaining
      },
      toolUsage: {
        ideas: {
          used: status.ideas_used,
          limit: status.ideas_limit,
          remaining: status.ideas_remaining
        },
        brainstorming: {
          used: status.brainstorming_used,
          limit: status.brainstorming_limit,
          remaining: status.brainstorming_remaining
        },
        prd: {
          used: status.prd_used,
          limit: status.prd_limit,
          remaining: status.prd_remaining
        },
        prototype: {
          used: status.prototype_used,
          limit: status.prototype_limit,
          remaining: status.prototype_remaining
        }
      },
      workflows: {
        completed: status.completed_workflows,
        guaranteedRemaining: status.workflows_remaining_guaranteed,
        minGuaranteed: status.min_complete_workflows
      },
      canPurchaseExtra: plan.canPurchaseExtra
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Abonnementstatus' });
  }
}

/**
 * Get detailed usage status with smart recommendations
 */
async function getUsageStatus(req, res) {
  try {
    const userId = req.user.userId;

    const status = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM user_status_view WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!status) {
      return res.status(404).json({ error: 'Status nicht gefunden' });
    }

    // Check if user can still complete full workflows
    const canCompleteWorkflow =
      status.ideas_remaining >= 1 &&
      status.brainstorming_remaining >= 1 &&
      status.prd_remaining >= 1 &&
      status.prototype_remaining >= 1;

    // Calculate potential complete workflows
    const potentialCompleteWorkflows = Math.min(
      status.ideas_remaining,
      status.brainstorming_remaining,
      status.prd_remaining,
      status.prototype_remaining
    );

    // Smart recommendation
    let recommendation = '';
    if (!canCompleteWorkflow) {
      if (status.ideas_remaining === 0) {
        recommendation = 'Ideengenerierung aufgebraucht. Bitte Nachkauf erwägen.';
      } else if (status.brainstorming_remaining === 0) {
        recommendation = 'Brainstorming aufgebraucht. Bitte Nachkauf erwägen.';
      } else if (status.prd_remaining === 0) {
        recommendation = 'PRD-Erstellung aufgebraucht. Bitte Nachkauf erwägen.';
      } else if (status.prototype_remaining === 0) {
        recommendation = 'Prototyp-Generierung aufgebraucht. Bitte Nachkauf erwägen.';
      }
    } else if (potentialCompleteWorkflows < status.workflows_remaining_guaranteed) {
      recommendation = `Achtung: Ungleichmäßige Tool-Nutzung! Sie können nur noch ${potentialCompleteWorkflows} komplette Workflows durchführen, obwohl ${status.workflows_remaining_guaranteed} garantiert sind.`;
    } else {
      recommendation = `Optimal! Sie können noch ${potentialCompleteWorkflows} komplette Workflows durchführen.`;
    }

    res.json({
      canCompleteWorkflow,
      potentialCompleteWorkflows,
      guaranteedCompleteWorkflows: status.workflows_remaining_guaranteed,
      recommendation,
      toolUsage: {
        ideas: { used: status.ideas_used, limit: status.ideas_limit, remaining: status.ideas_remaining },
        brainstorming: { used: status.brainstorming_used, limit: status.brainstorming_limit, remaining: status.brainstorming_remaining },
        prd: { used: status.prd_used, limit: status.prd_limit, remaining: status.prd_remaining },
        prototype: { used: status.prototype_used, limit: status.prototype_limit, remaining: status.prototype_remaining }
      }
    });

  } catch (error) {
    console.error('Get usage status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Nutzungsstatus' });
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
        `INSERT INTO subscriptions (user_id, plan, workflows_limit, tokens_limit, end_date, payment_id, payment_status, active)
         VALUES (?, ?, ?, ?, ?, ?, 'completed', 1)`,
        [userId, plan, PLANS[plan].workflows, PLANS[plan].tokens, endDate ? endDate.toISOString() : null, paymentId || null],
        function(err) {
          if (err) reject(err);
          else resolve({ subscriptionId: this.lastID });
        }
      );
    });

    res.status(201).json({
      message: 'Abonnement erfolgreich erstellt',
      subscription: {
        id: result.subscriptionId,
        plan,
        planName: PLANS[plan].name,
        price: PLANS[plan].price,
        workflowsLimit: PLANS[plan].workflows,
        tokensLimit: PLANS[plan].tokens,
        duration: PLANS[plan].duration,
        endDate: endDate ? endDate.toISOString() : null
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
        `SELECT * FROM subscriptions WHERE user_id = ? AND active = 1`,
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
        [subscription.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      message: 'Abonnement erfolgreich gekündigt',
      note: 'Aktuelle Nutzungsrechte bleiben bis zum Ende der Laufzeit bestehen'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Fehler beim Kündigen des Abonnements' });
  }
}

/**
 * Purchase extra workflows or tokens (nur mit aktivem Paid-Abo)
 */
async function purchaseExtra(req, res) {
  const { type, paymentId } = req.body; // type: 'workflows' or 'tokens'
  const userId = req.user.userId;

  // Validation
  if (!type || !EXTRA_PURCHASES[type]) {
    return res.status(400).json({ error: 'Ungültiger Kauftyp' });
  }

  try {
    // Get current subscription
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM subscriptions WHERE user_id = ? AND active = 1`,
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

    // Check if plan allows extra purchases
    const plan = PLANS[subscription.plan];
    if (!plan.canPurchaseExtra) {
      return res.status(403).json({
        error: 'Nachkauf nur mit aktivem Abo möglich',
        message: 'Bitte upgraden Sie auf ein Tages-, Wochen-, Monats- oder Jahresabo um Workflows/Tokens nachzukaufen.'
      });
    }

    const purchase = EXTRA_PURCHASES[type];

    // Record purchase
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO purchases (user_id, subscription_id, purchase_type, amount, price_eur, payment_id, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
        [userId, subscription.id, type, purchase.amount, purchase.price, paymentId || null],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Update subscription limits
    if (type === 'workflows') {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE subscriptions SET workflows_limit = workflows_limit + ? WHERE id = ?`,
          [purchase.amount, subscription.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else if (type === 'tokens') {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE subscriptions SET tokens_limit = tokens_limit + ? WHERE id = ?`,
          [purchase.amount, subscription.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.json({
      message: `${purchase.amount} ${type === 'workflows' ? 'Workflows' : 'Tokens'} erfolgreich gekauft!`,
      purchased: purchase.amount,
      price: purchase.price,
      type
    });

  } catch (error) {
    console.error('Purchase extra error:', error);
    res.status(500).json({ error: 'Fehler beim Nachkauf' });
  }
}

/**
 * Check if user can use a specific tool
 */
async function canUseTool(userId, subscriptionId, toolName) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT
        CASE WHEN tool_name = ? THEN COUNT(*) ELSE 0 END as used,
        tl.${toolName}_limit as limit
       FROM tool_usage tu
       JOIN subscriptions s ON tu.subscription_id = s.id
       JOIN tool_limits tl ON s.plan = tl.plan
       WHERE tu.user_id = ? AND tu.subscription_id = ? AND tu.tool_name = ?
       GROUP BY tl.${toolName}_limit`,
      [toolName, userId, subscriptionId, toolName],
      (err, row) => {
        if (err) reject(err);
        else {
          const canUse = row ? row.used < row.limit : true;
          resolve(canUse);
        }
      }
    );
  });
}

/**
 * Record tool usage
 */
async function recordToolUsage(userId, subscriptionId, toolName, workflowId, usageType) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tool_usage (user_id, subscription_id, tool_name, workflow_id, usage_type)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, subscriptionId, toolName, workflowId, usageType],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

module.exports = {
  init,
  PLANS,
  EXTRA_PURCHASES,
  canUseTool,
  recordToolUsage
};
