const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Subscription = sequelize.define('Subscription', {
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
  plan: {
    type: DataTypes.ENUM('individual', 'ultimate', 'enterprise'),
    allowNull: false,
    defaultValue: 'individual'
  },
  billingCycle: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'EUR'
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'expired', 'trial', 'suspended'),
    defaultValue: 'trial'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  canceledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paypalSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maxTeamMembers: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '1 for individual, 5 for ultimate, 10 for enterprise'
  },
  maxApis: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    comment: 'Maximum number of APIs that can be managed'
  },
  features: {
    type: DataTypes.JSONB,
    defaultValue: {
      teamChat: false,
      fileSharing: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiWhiteListing: false
    }
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Static methods for plan configurations
Subscription.PLANS = {
  individual: {
    daily: 4.99,
    weekly: 9.99,
    monthly: 19.99,
    yearly: 179.99,
    maxTeamMembers: 1,
    maxApis: 20,
    features: {
      teamChat: false,
      fileSharing: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiWhiteListing: false
    }
  },
  ultimate: {
    monthly: 99.99,
    yearly: 999.99,
    maxTeamMembers: 5,
    maxApis: 50,
    features: {
      teamChat: true,
      fileSharing: true,
      advancedAnalytics: true,
      prioritySupport: false,
      customBranding: false,
      apiWhiteListing: true
    }
  },
  enterprise: {
    monthly: 299.99,
    yearly: 2999.99,
    maxTeamMembers: 10,
    maxApis: 100,
    features: {
      teamChat: true,
      fileSharing: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: true,
      apiWhiteListing: true
    }
  }
};

module.exports = Subscription;
