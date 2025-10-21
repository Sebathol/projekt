const express = require('express');
const router = express.Router();
const { Subscription } = require('../../database/models');
const { authenticate } = require('../auth/middleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @route   GET /api/subscriptions
 * @desc    Get user subscriptions
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { subscriptions }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions'
    });
  }
});

/**
 * @route   GET /api/subscriptions/active
 * @desc    Get active subscription
 * @access  Private
 */
router.get('/active', authenticate, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId: req.userId,
        status: 'active'
      }
    });

    res.json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    console.error('Get active subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active subscription'
    });
  }
});

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: { plans: Subscription.PLANS }
  });
});

/**
 * @route   POST /api/subscriptions/create
 * @desc    Create new subscription
 * @access  Private
 */
router.post('/create', authenticate, async (req, res) => {
  try {
    const { plan, billingCycle, paymentMethod } = req.body;

    // Validate plan and billing cycle
    if (!['individual', 'ultimate', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    const planConfig = Subscription.PLANS[plan];
    if (!planConfig[billingCycle]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing cycle for this plan'
      });
    }

    // Check for existing active subscription
    const existingSubscription = await Subscription.findOne({
      where: {
        userId: req.userId,
        status: 'active'
      }
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription'
      });
    }

    const price = planConfig[billingCycle];

    // Create Stripe customer if not exists
    let stripeCustomerId;
    if (paymentMethod === 'stripe') {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.userId
        }
      });
      stripeCustomerId = customer.id;
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    switch (billingCycle) {
      case 'daily':
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.userId,
      plan,
      billingCycle,
      price,
      currency: 'EUR',
      status: 'active',
      startDate,
      endDate,
      nextBillingDate: endDate,
      stripeCustomerId,
      maxTeamMembers: planConfig.maxTeamMembers,
      maxApis: planConfig.maxApis,
      features: planConfig.features
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: { subscription }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription'
    });
  }
});

/**
 * @route   POST /api/subscriptions/:id/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Subscription already canceled'
      });
    }

    // Cancel in Stripe if applicable
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    subscription.autoRenew = false;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription canceled successfully',
      data: { subscription }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling subscription'
    });
  }
});

/**
 * @route   POST /api/subscriptions/:id/upgrade
 * @desc    Upgrade subscription plan
 * @access  Private
 */
router.post('/:id/upgrade', authenticate, async (req, res) => {
  try {
    const { newPlan } = req.body;

    const subscription = await Subscription.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const planHierarchy = { individual: 1, ultimate: 2, enterprise: 3 };
    if (planHierarchy[newPlan] <= planHierarchy[subscription.plan]) {
      return res.status(400).json({
        success: false,
        message: 'Can only upgrade to a higher plan'
      });
    }

    const newPlanConfig = Subscription.PLANS[newPlan];
    const newPrice = newPlanConfig[subscription.billingCycle];

    subscription.plan = newPlan;
    subscription.price = newPrice;
    subscription.maxTeamMembers = newPlanConfig.maxTeamMembers;
    subscription.maxApis = newPlanConfig.maxApis;
    subscription.features = newPlanConfig.features;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: { subscription }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upgrading subscription'
    });
  }
});

/**
 * @route   POST /api/subscriptions/webhook
 * @desc    Handle Stripe webhook
 * @access  Public (Stripe only)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = await Subscription.findOne({
          where: { stripeSubscriptionId: event.data.object.id }
        });
        if (subscription) {
          subscription.status = 'canceled';
          subscription.canceledAt = new Date();
          await subscription.save();
        }
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment
        const paidSubscription = await Subscription.findOne({
          where: { stripeSubscriptionId: event.data.object.subscription }
        });
        if (paidSubscription) {
          paidSubscription.status = 'active';
          await paidSubscription.save();
        }
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedSubscription = await Subscription.findOne({
          where: { stripeSubscriptionId: event.data.object.subscription }
        });
        if (failedSubscription) {
          failedSubscription.status = 'suspended';
          await failedSubscription.save();
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
