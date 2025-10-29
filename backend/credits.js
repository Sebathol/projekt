/**
 * Credits Module
 * Handles workflows and tokens management
 *
 * LOGIC:
 * - 1 Workflow = 4 Tokens (Ideen, Brainstorming, PRD, Prototyp)
 * - Individual tool usage = 1 Token
 * - Customers can buy: 5 Workflows (€5) OR 10 Tokens (€5)
 */

const { authenticateToken } = require('./auth');

let db;

// Pricing Configuration
const PRICING = {
  workflows_pack: {
    amount: 5,
    price: 5.00,
    tokens_equivalent: 20 // 5 workflows * 4 tokens
  },
  tokens_pack: {
    amount: 10,
    price: 5.00
  },
  free_signup_bonus: {
    workflows: 3,
    tokens: 12 // 3 workflows * 4 tokens
  }
};

const TOKENS_PER_WORKFLOW = 4;
const TOOLS = ['ideas', 'brainstorming', 'prd', 'prototype'];

/**
 * Initialize credits module
 */
function init(app, database) {
  db = database;

  // Register routes
  app.get('/api/credits/status', authenticateToken, getCreditsStatus);
  app.post('/api/credits/use-token', authenticateToken, useToken);
  app.post('/api/credits/use-workflow', authenticateToken, useWorkflow);
  app.post('/api/credits/purchase-workflows', authenticateToken, purchaseWorkflows);
  app.post('/api/credits/purchase-tokens', authenticateToken, purchaseTokens);
  app.get('/api/credits/pricing', getPricing);
  app.get('/api/credits/history', authenticateToken, getPurchaseHistory);
}

/**
 * Get credits status for user
 */
async function getCreditsStatus(req, res) {
  try {
    const userId = req.user.userId;

    const credits = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM user_credits_view WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!credits) {
      return res.status(404).json({ error: 'Credits nicht gefunden' });
    }

    // Calculate total available tokens
    const workflowTokens = credits.available_workflows * TOKENS_PER_WORKFLOW;
    const totalAvailableTokens = workflowTokens + credits.available_tokens;

    // Can start full workflow?
    const canStartFullWorkflow = credits.available_workflows > 0 || credits.available_tokens >= TOKENS_PER_WORKFLOW;

    res.json({
      availableWorkflows: credits.available_workflows,
      availableTokens: credits.available_tokens,
      totalAvailableTokens,
      canStartFullWorkflow,
      tokensPerWorkflow: TOKENS_PER_WORKFLOW,
      subscription: {
        plan: credits.plan || 'free',
        active: credits.subscription_active,
        daysRemaining: credits.days_remaining
      },
      statistics: {
        totalWorkflowsPurchased: credits.total_workflows_purchased,
        totalTokensPurchased: credits.total_tokens_purchased
      }
    });

  } catch (error) {
    console.error('Get credits status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Credits' });
  }
}

/**
 * Use a single token for individual tool usage
 */
async function useToken(req, res) {
  const { tool, workflowId } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!tool || !TOOLS.includes(tool)) {
    return res.status(400).json({ error: 'Ungültiges Tool' });
  }

  try {
    // Get current credits
    const credits = await getUserCredits(userId);

    if (!credits) {
      return res.status(404).json({ error: 'Credits nicht gefunden' });
    }

    // Check if user has tokens available
    const totalTokens = (credits.available_workflows * TOKENS_PER_WORKFLOW) + credits.available_tokens;

    if (totalTokens < 1) {
      return res.status(403).json({
        error: 'Nicht genügend Tokens verfügbar',
        requiresPurchase: true,
        availableTokens: credits.available_tokens,
        availableWorkflows: credits.available_workflows
      });
    }

    // Deduct token (prefer individual tokens first, then workflow tokens)
    if (credits.available_tokens > 0) {
      await deductTokens(userId, 1, 0);
    } else {
      // Convert 1 workflow to 4 tokens, use 1, keep 3
      await deductTokens(userId, 1, -1); // -1 workflows, +3 tokens (net: -1 token)
      await addTokens(userId, 3); // Add remaining 3 tokens
    }

    // Record token usage
    await recordTokenUsage(userId, workflowId, tool, 1, 'individual');

    // Get updated credits
    const updatedCredits = await getUserCredits(userId);

    res.json({
      message: `Token für ${tool} erfolgreich verwendet`,
      tool,
      tokensRemaining: updatedCredits.available_tokens,
      workflowsRemaining: updatedCredits.available_workflows,
      totalAvailableTokens: (updatedCredits.available_workflows * TOKENS_PER_WORKFLOW) + updatedCredits.available_tokens
    });

  } catch (error) {
    console.error('Use token error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Verwenden des Tokens' });
  }
}

/**
 * Start a full workflow (allocates 4 tokens)
 */
async function useWorkflow(req, res) {
  const userId = req.user.userId;

  try {
    // Get current credits
    const credits = await getUserCredits(userId);

    if (!credits) {
      return res.status(404).json({ error: 'Credits nicht gefunden' });
    }

    // Check if user can start a full workflow
    const canStartWorkflow = credits.available_workflows > 0 || credits.available_tokens >= TOKENS_PER_WORKFLOW;

    if (!canStartWorkflow) {
      return res.status(403).json({
        error: 'Nicht genügend Credits für einen vollständigen Workflow',
        requiresPurchase: true,
        availableTokens: credits.available_tokens,
        availableWorkflows: credits.available_workflows,
        tokensNeeded: TOKENS_PER_WORKFLOW
      });
    }

    // Deduct workflow or equivalent tokens
    if (credits.available_workflows > 0) {
      await deductWorkflows(userId, 1);
    } else {
      await deductTokens(userId, TOKENS_PER_WORKFLOW, 0);
    }

    // Create new workflow entry
    const workflowResult = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO workflows (user_id, workflow_type, current_step, tokens_allocated)
         VALUES (?, 'full', 'ideas', ?)`,
        [userId, TOKENS_PER_WORKFLOW],
        function(err) {
          if (err) reject(err);
          else resolve({ workflowId: this.lastID });
        }
      );
    });

    // Get updated credits
    const updatedCredits = await getUserCredits(userId);

    res.json({
      message: 'Workflow erfolgreich gestartet',
      workflowId: workflowResult.workflowId,
      tokensAllocated: TOKENS_PER_WORKFLOW,
      workflowsRemaining: updatedCredits.available_workflows,
      tokensRemaining: updatedCredits.available_tokens,
      totalAvailableTokens: (updatedCredits.available_workflows * TOKENS_PER_WORKFLOW) + updatedCredits.available_tokens
    });

  } catch (error) {
    console.error('Use workflow error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Starten des Workflows' });
  }
}

/**
 * Purchase workflows pack (5 workflows for €5)
 */
async function purchaseWorkflows(req, res) {
  const { paymentId, paymentStatus = 'completed' } = req.body;
  const userId = req.user.userId;

  try {
    const pack = PRICING.workflows_pack;

    // Record purchase
    await recordPurchase(userId, 'workflows', pack.amount, pack.price, paymentId, paymentStatus);

    // Add workflows to user credits
    await addWorkflows(userId, pack.amount);

    // Get updated credits
    const updatedCredits = await getUserCredits(userId);

    res.json({
      message: `${pack.amount} Workflows erfolgreich gekauft!`,
      purchased: pack.amount,
      price: pack.price,
      workflowsRemaining: updatedCredits.available_workflows,
      tokensRemaining: updatedCredits.available_tokens,
      totalAvailableTokens: (updatedCredits.available_workflows * TOKENS_PER_WORKFLOW) + updatedCredits.available_tokens
    });

  } catch (error) {
    console.error('Purchase workflows error:', error);
    res.status(500).json({ error: 'Fehler beim Kauf der Workflows' });
  }
}

/**
 * Purchase tokens pack (10 tokens for €5)
 */
async function purchaseTokens(req, res) {
  const { paymentId, paymentStatus = 'completed' } = req.body;
  const userId = req.user.userId;

  try {
    const pack = PRICING.tokens_pack;

    // Record purchase
    await recordPurchase(userId, 'tokens', pack.amount, pack.price, paymentId, paymentStatus);

    // Add tokens to user credits
    await addTokens(userId, pack.amount);

    // Get updated credits
    const updatedCredits = await getUserCredits(userId);

    res.json({
      message: `${pack.amount} Tokens erfolgreich gekauft!`,
      purchased: pack.amount,
      price: pack.price,
      workflowsRemaining: updatedCredits.available_workflows,
      tokensRemaining: updatedCredits.available_tokens,
      totalAvailableTokens: (updatedCredits.available_workflows * TOKENS_PER_WORKFLOW) + updatedCredits.available_tokens
    });

  } catch (error) {
    console.error('Purchase tokens error:', error);
    res.status(500).json({ error: 'Fehler beim Kauf der Tokens' });
  }
}

/**
 * Get pricing information
 */
function getPricing(req, res) {
  res.json({
    pricing: PRICING,
    tokensPerWorkflow: TOKENS_PER_WORKFLOW,
    tools: TOOLS,
    explanation: {
      workflows: `1 Workflow = ${TOKENS_PER_WORKFLOW} Tokens (für alle ${TOOLS.length} Tools)`,
      tokens: 'Tokens können einzeln für jedes Tool verwendet werden',
      packages: {
        workflows: `${PRICING.workflows_pack.amount} Workflows für €${PRICING.workflows_pack.price}`,
        tokens: `${PRICING.tokens_pack.amount} Tokens für €${PRICING.tokens_pack.price}`
      }
    }
  });
}

/**
 * Get purchase history
 */
async function getPurchaseHistory(req, res) {
  try {
    const userId = req.user.userId;

    const history = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM purchase_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({ purchases: history });

  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kaufhistorie' });
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get user credits
 */
function getUserCredits(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM credits WHERE user_id = ?`,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

/**
 * Add workflows to user
 */
function addWorkflows(userId, amount) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE credits
       SET available_workflows = available_workflows + ?,
           total_workflows_purchased = total_workflows_purchased + ?
       WHERE user_id = ?`,
      [amount, amount, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Add tokens to user
 */
function addTokens(userId, amount) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE credits
       SET available_tokens = available_tokens + ?,
           total_tokens_purchased = total_tokens_purchased + ?
       WHERE user_id = ?`,
      [amount, amount, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Deduct workflows from user
 */
function deductWorkflows(userId, amount) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE credits
       SET available_workflows = available_workflows - ?
       WHERE user_id = ? AND available_workflows >= ?`,
      [amount, userId, amount],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Nicht genügend Workflows verfügbar'));
        else resolve();
      }
    );
  });
}

/**
 * Deduct tokens from user
 */
function deductTokens(userId, tokenAmount, workflowAmount = 0) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE credits
       SET available_tokens = available_tokens - ?,
           available_workflows = available_workflows - ?
       WHERE user_id = ?`,
      [tokenAmount, workflowAmount, userId],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Nicht genügend Tokens verfügbar'));
        else resolve();
      }
    );
  });
}

/**
 * Record purchase in database
 */
function recordPurchase(userId, type, amount, price, paymentId, paymentStatus) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO purchases (user_id, purchase_type, amount, price_eur, payment_id, payment_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, type, amount, price, paymentId, paymentStatus],
      function(err) {
        if (err) reject(err);
        else resolve({ purchaseId: this.lastID });
      }
    );
  });
}

/**
 * Record token usage
 */
function recordTokenUsage(userId, workflowId, tool, tokensConsumed, usageType) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO token_usage (user_id, workflow_id, tool_name, tokens_consumed, usage_type)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, workflowId, tool, tokensConsumed, usageType],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

/**
 * Grant free signup bonus
 */
async function grantFreeSignupBonus(userId) {
  const bonus = PRICING.free_signup_bonus;
  await addWorkflows(userId, bonus.workflows);
  // Tokens are already included in workflows, so no need to add separately
  console.log(`✅ Granted ${bonus.workflows} free workflows to user ${userId}`);
}

module.exports = {
  init,
  getUserCredits,
  addWorkflows,
  addTokens,
  deductWorkflows,
  deductTokens,
  grantFreeSignupBonus,
  TOKENS_PER_WORKFLOW,
  TOOLS,
  PRICING
};
