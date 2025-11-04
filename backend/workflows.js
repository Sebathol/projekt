/**
 * Workflows Module
 * Handles workflow CRUD operations with HYBRID API System
 * FREE users → Gemini API (Google)
 * Paid users → Claude API (Anthropic)
 */

const { authenticateToken } = require('./auth');
const { hasWorkflowsRemaining, decrementWorkflowCount } = require('./subscriptions');
const apiRouter = require('./api-router');

let db;

/**
 * Initialize workflows module
 */
function init(app, database) {
  db = database;

  // Register routes
  app.post('/api/workflows/generate-ideas', authenticateToken, generateIdeas);
  app.post('/api/workflows/chat', authenticateToken, chatIteration);
  app.post('/api/workflows/create-prd', authenticateToken, createPRD);
  app.post('/api/workflows/generate-prototype', authenticateToken, generatePrototype);
  app.get('/api/workflows/list', authenticateToken, listWorkflows);
  app.get('/api/workflows/:id', authenticateToken, getWorkflow);
  app.delete('/api/workflows/:id', authenticateToken, deleteWorkflow);
  app.post('/api/workflows/:id/update', authenticateToken, updateWorkflow);
}

/**
 * Generate ideas (Step 1)
 */
async function generateIdeas(req, res) {
  const { mode, input, lang = 'de' } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!mode || (mode === 'brainstorming' && !input)) {
    return res.status(400).json({ error: 'Mode und Input sind erforderlich' });
  }

  try {
    // Check if user has workflows remaining
    const hasRemaining = await hasWorkflowsRemaining(userId);
    if (!hasRemaining) {
      return res.status(403).json({
        error: 'Workflow-Limit erreicht. Bitte upgraden Sie Ihr Abonnement.',
        upgrade: true
      });
    }

    // Get active subscription with plan info
    const subscription = await new Promise((resolve, reject) => {
      db.get(
        `SELECT a.subscription_id, s.plan
         FROM active_subscriptions a
         JOIN subscriptions s ON a.subscription_id = s.subscription_id
         WHERE a.user_id = ? AND a.active = 1`,
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

    // Create new workflow
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO workflows (user_id, subscription_id, workflow_type, current_step)
         VALUES (?, ?, 'partial', 'ideas')`,
        [userId, subscription.subscription_id],
        function(err) {
          if (err) reject(err);
          else resolve({ workflowId: this.lastID });
        }
      );
    });

    const workflowId = result.workflowId;

    // Generate ideas using HYBRID API (Gemini for FREE, Claude for paid)
    const apiInfo = apiRouter.getApiInfo(subscription.plan);
    console.log(`🤖 Using ${apiInfo.name} API for user ${userId} (${subscription.plan} plan)`);

    const { ideas, cost, usedApi, provider } = await apiRouter.callWithFallback(
      subscription.plan,
      'generateIdeas',
      db,
      workflowId,
      mode,
      input,
      lang
    );

    // Save ideas to workflow
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE workflows SET ideas_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [JSON.stringify(ideas), workflowId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Decrement workflow count
    await decrementWorkflowCount(userId);

    res.json({
      message: 'Ideen erfolgreich generiert',
      workflowId,
      ideas,
      cost: typeof cost === 'number' ? cost.toFixed(4) : '0.00',
      api: {
        name: usedApi,
        provider: provider,
        plan: subscription.plan
      }
    });

  } catch (error) {
    console.error('Generate ideas error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Generieren der Ideen' });
  }
}

/**
 * Chat iteration (refine ideas)
 */
async function chatIteration(req, res) {
  const { workflowId, chatMessages, ideas, lang = 'de' } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!workflowId || !chatMessages || !ideas) {
    return res.status(400).json({ error: 'WorkflowId, chatMessages und ideas sind erforderlich' });
  }

  try {
    // Verify workflow belongs to user and get subscription plan
    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT w.id, w.user_id, w.subscription_id, s.plan
         FROM workflows w
         JOIN subscriptions s ON w.subscription_id = s.subscription_id
         WHERE w.id = ? AND w.user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Call HYBRID API for chat
    const { response, cost, usedApi, provider } = await apiRouter.callWithFallback(
      workflow.plan,
      'chatIteration',
      db,
      workflowId,
      chatMessages,
      ideas,
      lang
    );

    // Try to extract updated ideas from response
    let updatedIdeas = ideas;
    const jsonMatch = response.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      try {
        const cleanedJson = jsonMatch[0].replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedIdeas = JSON.parse(cleanedJson);
        if (Array.isArray(parsedIdeas) && parsedIdeas.length > 0) {
          updatedIdeas = parsedIdeas;

          // Update workflow
          await new Promise((resolve, reject) => {
            db.run(
              `UPDATE workflows SET ideas_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
              [JSON.stringify(updatedIdeas), workflowId],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }
      } catch (e) {
        // JSON parsing failed, just return the text response
      }
    }

    res.json({
      message: 'Chat erfolgreich',
      response,
      updatedIdeas,
      cost: cost.toFixed(4)
    });

  } catch (error) {
    console.error('Chat iteration error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Chat' });
  }
}

/**
 * Create PRD (Step 2)
 */
async function createPRD(req, res) {
  const { workflowId, idea, lang = 'de' } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!workflowId || !idea) {
    return res.status(400).json({ error: 'WorkflowId und idea sind erforderlich' });
  }

  try {
    // Verify workflow belongs to user and get subscription plan
    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT w.id, w.user_id, w.subscription_id, s.plan
         FROM workflows w
         JOIN subscriptions s ON w.subscription_id = s.subscription_id
         WHERE w.id = ? AND w.user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Generate PRD using HYBRID API
    const { prd, cost, usedApi, provider } = await apiRouter.callWithFallback(
      workflow.plan,
      'createPRD',
      db,
      workflowId,
      idea,
      lang
    );

    // Update workflow
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE workflows SET
          selected_idea_json = ?,
          prd_text = ?,
          current_step = 'prd',
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [JSON.stringify(idea), prd, workflowId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      message: 'PRD erfolgreich erstellt',
      prd,
      cost: cost.toFixed(4)
    });

  } catch (error) {
    console.error('Create PRD error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Erstellen des PRD' });
  }
}

/**
 * Generate prototype (Step 3)
 */
async function generatePrototype(req, res) {
  const { workflowId, prd, lang = 'de' } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!workflowId || !prd) {
    return res.status(400).json({ error: 'WorkflowId und PRD sind erforderlich' });
  }

  try {
    // Verify workflow belongs to user and get subscription plan
    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT w.id, w.user_id, w.subscription_id, s.plan
         FROM workflows w
         JOIN subscriptions s ON w.subscription_id = s.subscription_id
         WHERE w.id = ? AND w.user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Generate prototype using HYBRID API
    const { prototype, cost, usedApi, provider } = await apiRouter.callWithFallback(
      workflow.plan,
      'generatePrototype',
      db,
      workflowId,
      prd,
      lang
    );

    // Update workflow
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE workflows SET
          prototype_html = ?,
          current_step = 'prototype',
          completed = 1,
          workflow_type = 'full',
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [prototype, workflowId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      message: 'Prototyp erfolgreich generiert',
      prototype,
      cost: cost.toFixed(4)
    });

  } catch (error) {
    console.error('Generate prototype error:', error);
    res.status(500).json({ error: error.message || 'Fehler beim Generieren des Prototyps' });
  }
}

/**
 * List all workflows for user
 */
async function listWorkflows(req, res) {
  try {
    const userId = req.user.userId;

    const workflows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT
          w.id,
          w.workflow_type,
          w.current_step,
          w.completed,
          w.created_at,
          w.updated_at,
          COALESCE(SUM(au.cost_eur), 0) as total_cost
         FROM workflows w
         LEFT JOIN api_usage au ON w.id = au.workflow_id
         WHERE w.user_id = ?
         GROUP BY w.id
         ORDER BY w.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({ workflows });

  } catch (error) {
    console.error('List workflows error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Workflows' });
  }
}

/**
 * Get workflow by ID
 */
async function getWorkflow(req, res) {
  try {
    const workflowId = req.params.id;
    const userId = req.user.userId;

    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM workflows WHERE id = ? AND user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Get API usage for this workflow
    const apiUsage = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM api_usage WHERE workflow_id = ? ORDER BY created_at ASC`,
        [workflowId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Parse JSON fields
    const result = {
      ...workflow,
      ideas: workflow.ideas_json ? JSON.parse(workflow.ideas_json) : null,
      selectedIdea: workflow.selected_idea_json ? JSON.parse(workflow.selected_idea_json) : null,
      apiUsage
    };

    delete result.ideas_json;
    delete result.selected_idea_json;

    res.json({ workflow: result });

  } catch (error) {
    console.error('Get workflow error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Workflows' });
  }
}

/**
 * Update workflow (save partial progress)
 */
async function updateWorkflow(req, res) {
  const workflowId = req.params.id;
  const userId = req.user.userId;
  const { step, data } = req.body;

  try {
    // Verify workflow belongs to user
    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id, user_id FROM workflows WHERE id = ? AND user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Update based on step
    let updateQuery = 'UPDATE workflows SET updated_at = CURRENT_TIMESTAMP';
    let params = [];

    if (step === 'ideas' && data.ideas) {
      updateQuery += ', ideas_json = ?';
      params.push(JSON.stringify(data.ideas));
    } else if (step === 'brainstorming' && data.brainstorming) {
      updateQuery += ', brainstorming_json = ?';
      params.push(JSON.stringify(data.brainstorming));
    } else if (step === 'prd' && data.prd) {
      updateQuery += ', prd_text = ?, current_step = "prd"';
      params.push(data.prd);
    } else if (step === 'prototype' && data.prototype) {
      updateQuery += ', prototype_html = ?, current_step = "prototype", completed = 1';
      params.push(data.prototype);
    }

    updateQuery += ' WHERE id = ?';
    params.push(workflowId);

    await new Promise((resolve, reject) => {
      db.run(updateQuery, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Workflow erfolgreich aktualisiert' });

  } catch (error) {
    console.error('Update workflow error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Workflows' });
  }
}

/**
 * Delete workflow
 */
async function deleteWorkflow(req, res) {
  try {
    const workflowId = req.params.id;
    const userId = req.user.userId;

    // Verify workflow belongs to user
    const workflow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id, user_id FROM workflows WHERE id = ? AND user_id = ?`,
        [workflowId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow nicht gefunden' });
    }

    // Delete workflow (CASCADE will delete api_usage)
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM workflows WHERE id = ?`,
        [workflowId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Workflow erfolgreich gelöscht' });

  } catch (error) {
    console.error('Delete workflow error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Workflows' });
  }
}

module.exports = {
  init
};
