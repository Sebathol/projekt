/**
 * Von der Idee zum Prototyp - Backend Server
 * Node.js + Express + SQLite
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Import modules
const creditsModule = require('./credits');
const authModule = require('./auth');
const subscriptionsModule = require('./subscriptions_v2'); // V3: Tool-specific tracking
const workflowsModule = require('./workflows');
const usageModule = require('./usage');
const promoCodesModule = require('./promo-codes'); // Promo codes for influencers
const werbeLinksModule = require('./werbe-links'); // Werbe-Links system

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Database setup
const dbPath = path.join(__dirname, '../database/app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Initialize database schema (V3 with tool-specific tracking)
const schemaPath = path.join(__dirname, '../database/schema_v3.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Database schema error:', err);
    process.exit(1);
  }
  console.log('✅ Database schema V3 initialized (Tool-specific tracking system)');
});

// Make db available to all modules
app.locals.db = db;

// Initialize modules (order matters: credits before auth)
creditsModule.init(app, db);
authModule.init(app, db, creditsModule);
subscriptionsModule.init(app, db);
workflowsModule.init(app, db);
usageModule.init(app, db);
promoCodesModule.init(app, db); // Promo codes
werbeLinksModule.init(app); // Werbe-Links (no db needed)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user (requires auth)',
        'POST /api/auth/logout': 'Logout user'
      },
      subscriptions: {
        'GET /api/subscriptions/status': 'Get subscription status (requires auth)',
        'GET /api/subscriptions/usage': 'Get tool-specific usage status with smart recommendations (requires auth)',
        'POST /api/subscriptions/create': 'Create new subscription (requires auth)',
        'POST /api/subscriptions/cancel': 'Cancel subscription (requires auth)',
        'POST /api/subscriptions/purchase-extra': 'Purchase extra workflows/tokens (requires paid subscription)',
        'GET /api/subscriptions/plans': 'Get available plans'
      },
      workflows: {
        'POST /api/workflows/generate-ideas': 'Generate ideas (requires auth)',
        'POST /api/workflows/brainstorm': 'Brainstorm ideas (requires auth)',
        'POST /api/workflows/create-prd': 'Create PRD (requires auth)',
        'POST /api/workflows/generate-prototype': 'Generate prototype (requires auth)',
        'GET /api/workflows/list': 'List all workflows (requires auth)',
        'GET /api/workflows/:id': 'Get workflow by ID (requires auth)',
        'DELETE /api/workflows/:id': 'Delete workflow (requires auth)'
      },
      usage: {
        'GET /api/usage/stats': 'Get usage statistics (requires auth)',
        'GET /api/usage/costs': 'Get cost tracking (requires auth)'
      },
      werbeLinks: {
        'GET /api/werbe-links': 'Get all werbe-links',
        'GET /api/werbe-links/:location': 'Get werbe-links by location (sidebar, footer, dashboard)',
        'POST /api/werbe-links/reload': 'Reload werbe-links from directory'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🎨 Von der Idee zum Prototyp - Backend       ║
║  🚀 Server running on http://localhost:${PORT}  ║
║  📚 API Docs: http://localhost:${PORT}/api/docs ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('✅ Database closed');
    }
    process.exit(0);
  });
});

module.exports = app;
