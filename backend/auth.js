/**
 * Authentication Module
 * Handles user registration, login, and JWT tokens
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret (In production, use environment variable!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

let db;
let creditsModule;

/**
 * Initialize authentication module
 */
function init(app, database, creditsModuleInstance) {
  db = database;
  creditsModule = creditsModuleInstance;

  // Register routes
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', authenticateToken, getCurrentUser);
  app.post('/api/auth/logout', authenticateToken, logout);
}

/**
 * Register new user
 */
async function register(req, res) {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
  }

  try {
    // Check if user exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(409).json({ error: 'E-Mail bereits registriert' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, passwordHash],
        function(err) {
          if (err) reject(err);
          else resolve({ userId: this.lastID });
        }
      );
    });

    const userId = result.userId;

    // Create free subscription
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (user_id, plan, active)
         VALUES (?, 'free', 1)`,
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Grant free signup bonus (3 workflows = 12 tokens)
    // Note: Credits table is auto-created via trigger
    if (creditsModule) {
      await creditsModule.grantFreeSignupBonus(userId);
    }

    // Get credits status
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

    // Generate JWT token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: 'Registrierung erfolgreich',
      userId,
      email,
      token,
      credits: {
        availableWorkflows: credits?.available_workflows || 0,
        availableTokens: credits?.available_tokens || 0,
        totalAvailableTokens: (credits?.available_workflows || 0) * 4 + (credits?.available_tokens || 0)
      },
      subscription: {
        plan: 'free'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
  }

  try {
    // Get user
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, email, password_hash FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Update last login
    db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Get credits and subscription status
    const userCredits = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM user_credits_view WHERE user_id = ?`,
        [user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: 'Login erfolgreich',
      userId: user.id,
      email: user.email,
      token,
      credits: userCredits ? {
        availableWorkflows: userCredits.available_workflows,
        availableTokens: userCredits.available_tokens,
        totalAvailableTokens: (userCredits.available_workflows * 4) + userCredits.available_tokens
      } : null,
      subscription: userCredits ? {
        plan: userCredits.plan || 'free',
        active: userCredits.subscription_active,
        daysRemaining: userCredits.days_remaining
      } : null
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
}

/**
 * Get current user
 */
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;

    // Get user
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, email, created_at, last_login FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Get credits and subscription status
    const userCredits = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM user_credits_view WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login
      },
      credits: userCredits ? {
        availableWorkflows: userCredits.available_workflows,
        availableTokens: userCredits.available_tokens,
        totalAvailableTokens: (userCredits.available_workflows * 4) + userCredits.available_tokens
      } : null,
      subscription: userCredits ? {
        plan: userCredits.plan || 'free',
        active: userCredits.subscription_active,
        daysRemaining: userCredits.days_remaining
      } : null
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Benutzerdaten' });
  }
}

/**
 * Logout user (just a placeholder, client should delete token)
 */
function logout(req, res) {
  res.json({ message: 'Logout erfolgreich' });
}

/**
 * Middleware to authenticate JWT token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentifizierung erforderlich' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ungültiger oder abgelaufener Token' });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  init,
  authenticateToken
};
