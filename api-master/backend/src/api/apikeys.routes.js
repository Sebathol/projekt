const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ApiKey } = require('../../database/models');
const apiProxyService = require('../proxy/apiProxy');
const { authenticate, requireSubscription } = require('../auth/middleware');

/**
 * @route   POST /api/keys
 * @desc    Create new API key with proxy
 * @access  Private
 */
router.post('/',
  authenticate,
  requireSubscription,
  [
    body('apiName').trim().notEmpty(),
    body('apiProvider').trim().notEmpty(),
    body('originalKey').trim().notEmpty(),
    body('apiEndpoint').optional().isURL()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { apiName, apiProvider, originalKey, testKey, apiEndpoint, apiVersion, metadata, notes, tags } = req.body;

      // Check subscription limits
      const userApiCount = await ApiKey.count({
        where: { userId: req.userId, isActive: true }
      });

      if (userApiCount >= req.subscription.maxApis) {
        return res.status(403).json({
          success: false,
          message: `Your plan allows maximum ${req.subscription.maxApis} APIs. Please upgrade.`
        });
      }

      // Create API key with proxy
      const result = await apiProxyService.createApiKeyWithProxy({
        userId: req.userId,
        apiName,
        apiProvider,
        originalKey,
        testKey,
        apiEndpoint,
        apiVersion,
        metadata
      });

      // Update notes and tags if provided
      if (notes || tags) {
        const apiKey = await ApiKey.findByPk(result.id);
        if (notes) apiKey.notes = notes;
        if (tags) apiKey.tags = tags;
        await apiKey.save();
      }

      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        data: result
      });
    } catch (error) {
      console.error('Create API key error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating API key'
      });
    }
  }
);

/**
 * @route   GET /api/keys
 * @desc    Get all user API keys
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: { userId: req.userId, isActive: true },
      attributes: {
        exclude: ['originalKeyEncrypted', 'originalKeyIV', 'originalKeyAuthTag', 'testKey', 'testKeyIV', 'testKeyAuthTag']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { apiKeys }
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API keys'
    });
  }
});

/**
 * @route   GET /api/keys/:id
 * @desc    Get single API key
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, userId: req.userId },
      attributes: {
        exclude: ['originalKeyEncrypted', 'originalKeyIV', 'originalKeyAuthTag', 'originalKeyHash', 'testKey', 'testKeyIV', 'testKeyAuthTag']
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    res.json({
      success: true,
      data: { apiKey }
    });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API key'
    });
  }
});

/**
 * @route   PUT /api/keys/:id/environment
 * @desc    Switch between test and production
 * @access  Private
 */
router.put('/:id/environment', authenticate, async (req, res) => {
  try {
    const { environment } = req.body;

    if (!['test', 'production'].includes(environment)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid environment. Must be "test" or "production"'
      });
    }

    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const result = await apiProxyService.switchEnvironment(apiKey.proxyKey, environment);

    res.json({
      success: true,
      message: 'Environment switched successfully',
      data: result
    });
  } catch (error) {
    console.error('Switch environment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error switching environment'
    });
  }
});

/**
 * @route   POST /api/keys/:id/rotate
 * @desc    Rotate proxy key
 * @access  Private
 */
router.post('/:id/rotate', authenticate, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const result = await apiProxyService.rotateProxyKey(apiKey.proxyKey);

    res.json({
      success: true,
      message: 'Proxy key rotated successfully',
      data: result
    });
  } catch (error) {
    console.error('Rotate key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rotating proxy key'
    });
  }
});

/**
 * @route   GET /api/keys/:id/usage
 * @desc    Get API key usage statistics
 * @access  Private
 */
router.get('/:id/usage', authenticate, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const stats = await apiProxyService.getUsageStats(apiKey.proxyKey);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching usage statistics'
    });
  }
});

/**
 * @route   DELETE /api/keys/:id
 * @desc    Delete API key (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    apiKey.isActive = false;
    await apiKey.save();

    res.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting API key'
    });
  }
});

module.exports = router;
