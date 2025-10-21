const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  apiName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the API service (e.g., OpenAI, Stripe, etc.)'
  },
  apiProvider: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Provider of the API'
  },
  originalKeyEncrypted: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Original API key (encrypted with AES-256-GCM)'
  },
  originalKeyIV: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'IV for encrypted original key'
  },
  originalKeyAuthTag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Auth tag for encrypted original key'
  },
  originalKeyHash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hash of original key for verification'
  },
  proxyKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Proxy key shown to user (APM_xxx format)'
  },
  testKey: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Test API key (encrypted)'
  },
  testKeyIV: {
    type: DataTypes.STRING,
    allowNull: true
  },
  testKeyAuthTag: {
    type: DataTypes.STRING,
    allowNull: true
  },
  environment: {
    type: DataTypes.ENUM('test', 'production'),
    defaultValue: 'test',
    comment: 'Current active environment'
  },
  apiEndpoint: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Base endpoint for the API'
  },
  apiVersion: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'API version'
  },
  rateLimitPerMinute: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Rate limit per minute'
  },
  rateLimitPerDay: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    comment: 'Rate limit per day'
  },
  requestsToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalRequests: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional API-specific metadata'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User notes about this API key'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Tags for organizing API keys'
  },
  webhookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Webhook URL for API events'
  },
  autoRotate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Enable automatic key rotation'
  },
  rotationSchedule: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Cron schedule for auto-rotation'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Expiration date for the API key'
  }
});

// Instance methods
ApiKey.prototype.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

ApiKey.prototype.incrementUsage = async function() {
  this.requestsToday += 1;
  this.totalRequests += 1;
  this.lastUsedAt = new Date();
  await this.save();
};

ApiKey.prototype.resetDailyUsage = async function() {
  this.requestsToday = 0;
  await this.save();
};

module.exports = ApiKey;
