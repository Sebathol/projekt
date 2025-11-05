const jwtService = require('./jwt');
const { User, Subscription } = require('../../database/models');

/**
 * Authenticate JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwtService.verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Check if user has active subscription
 */
const requireSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId: req.userId,
        status: 'active'
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required'
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking subscription'
    });
  }
};

/**
 * Check if user has specific plan
 */
const requirePlan = (...plans) => {
  return async (req, res, next) => {
    if (!req.subscription) {
      return res.status(403).json({
        success: false,
        message: 'Subscription required'
      });
    }

    if (!plans.includes(req.subscription.plan)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${plans.join(' or ')} plan`
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireSubscription,
  requirePlan,
  requireAdmin
};
