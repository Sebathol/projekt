require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize, testConnection } = require('../config/database');
const ChatSocketService = require('./team/chat.socket');

// Import routes
const authRoutes = require('./api/auth.routes');
const apiKeysRoutes = require('./api/apikeys.routes');
const subscriptionsRoutes = require('./api/subscriptions.routes');
const teamsRoutes = require('./api/teams.routes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Chat Socket Service
const chatSocketService = new ChatSocketService(io);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Master Backend is running',
    version: '1.0.0-alpha',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/keys', apiKeysRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/teams', teamsRoutes);

// Proxy endpoint (this is where external apps send requests using proxy keys)
app.all('/api/proxy/:proxyKey/*', async (req, res) => {
  try {
    const { proxyKey } = req.params;
    const path = req.params[0];

    const apiProxyService = require('./proxy/apiProxy');

    const requestConfig = {
      method: req.method,
      url: `/${path}`,
      headers: {
        ...req.headers,
        host: undefined // Remove host header
      },
      params: req.query,
      data: req.body
    };

    const result = await apiProxyService.proxyRequest(proxyKey, requestConfig);

    if (result.success) {
      res.status(result.status).json(result.data);
    } else {
      res.status(result.status).json({
        success: false,
        error: result.error,
        data: result.data
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Proxy request failed'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models (in production use migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synchronized');
    }

    // Start server
    server.listen(PORT, () => {
      console.log('🚀 ========================================');
      console.log(`🚀 API Master Backend v1.0.0-alpha`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Health check: http://localhost:${PORT}/health`);
      console.log(`🚀 WebSocket server ready`);
      console.log('🚀 ========================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();

module.exports = { app, server, io, chatSocketService };
