const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { calculateCommission } = require('../utils/paymentSplit');

/**
 * @desc    Get subscription plans
 * @route   GET /api/subscriptions/plans
 * @access  Public
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'style_pass_basic',
        name: 'Style Pass Basic',
        price: 2999,
        currency: 'INR',
        billingCycle: 'monthly',
        benefits: {
          monthlyRentals: 2,
          maxRentalValue: 10000,
          freeShipping: true,
          expressDelivery: false,
          conciergeAccess: false,
          prioritySupport: false,
          vaultStorage: false
        },
        description: '2 high-end rentals per month with free city-wide shipping'
      },
      {
        id: 'style_pass_premium',
        name: 'Style Pass Premium',
        price: 5999,
        currency: 'INR',
        billingCycle: 'monthly',
        benefits: {
          monthlyRentals: 4,
          maxRentalValue: 20000,
          freeShipping: true,
          expressDelivery: true,
          conciergeAccess: true,
          prioritySupport: true,
          vaultStorage: false
        },
        description: '4 premium rentals with express delivery and concierge service'
      },
      {
        id: 'style_pass_elite',
        name: 'Style Pass Elite',
        price: 9999,
        currency: 'INR',
        billingCycle: 'monthly',
        benefits: {
          monthlyRentals: 8,
          maxRentalValue: 50000,
          freeShipping: true,
          expressDelivery: true,
          conciergeAccess: true,
          prioritySupport: true,
          vaultStorage: true
        },
        description: 'Unlimited luxury with vault storage and white-glove service'
      }
    ];

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans',
      error: error.message
    });
  }
};

/**
 * @desc    Create new subscription
 * @route   POST /api/subscriptions
 * @access  Private
 */
exports.createSubscription = async (req, res) => {
  try {
    const { plan, billingCycle, paymentMethodId } = req.body;
    
    // Check if user already has active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription'
      });
    }
    
    // Get plan details
    const planDetails = getPlanDetails(plan);
    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }
    
    // Calculate billing dates
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    
    // Create subscription
    const subscription = await Subscription.create({
      user: req.user.id,
      plan,
      planDetails,
      billingCycle: billingCycle || 'monthly',
      startDate: now,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      nextBillingDate: periodEnd,
      currentPeriodUsage: {
        rentalsUsed: 0,
        rentalsRemaining: planDetails.monthlyRentals,
        totalValue: 0
      }
    });
    
    // Update user's active subscription
    await User.findByIdAndUpdate(req.user.id, {
      activeSubscription: subscription._id,
      'premium.isActive': true,
      'premium.tier': plan === 'style_pass_elite' ? 'elite' : plan === 'style_pass_premium' ? 'pro' : 'basic',
      'premium.startDate': now,
      'premium.endDate': periodEnd
    });
    
    res.status(201).json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's subscription
 * @route   GET /api/subscriptions/me
 * @access  Private
 */
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel subscription
 * @route   PUT /api/subscriptions/cancel
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.cancelledBy = 'user';
    subscription.autoRenew = false;
    
    await subscription.save();
    
    // Update user premium status
    await User.findByIdAndUpdate(req.user.id, {
      'premium.isActive': false,
      activeSubscription: null
    });
    
    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

/**
 * @desc    Use rental quota from subscription
 * @route   POST /api/subscriptions/use-rental
 * @access  Private
 */
exports.useRentalQuota = async (req, res) => {
  try {
    const { rentalValue } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    if (!subscription.canRent(rentalValue)) {
      return res.status(400).json({
        success: false,
        message: 'Subscription quota exceeded or rental value too high',
        quota: subscription.currentPeriodUsage
      });
    }
    
    await subscription.useRental(rentalValue);
    
    res.status(200).json({
      success: true,
      message: 'Rental quota used successfully',
      data: subscription.currentPeriodUsage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Helper function to get plan details
 */
function getPlanDetails(planId) {
  const plans = {
    style_pass_basic: {
      name: 'Style Pass Basic',
      price: 2999,
      currency: 'INR',
      monthlyRentals: 2,
      maxRentalValue: 10000,
      freeShipping: true,
      expressDelivery: false,
      conciergeAccess: false,
      prioritySupport: false,
      vaultStorage: false
    },
    style_pass_premium: {
      name: 'Style Pass Premium',
      price: 5999,
      currency: 'INR',
      monthlyRentals: 4,
      maxRentalValue: 20000,
      freeShipping: true,
      expressDelivery: true,
      conciergeAccess: true,
      prioritySupport: true,
      vaultStorage: false
    },
    style_pass_elite: {
      name: 'Style Pass Elite',
      price: 9999,
      currency: 'INR',
      monthlyRentals: 8,
      maxRentalValue: 50000,
      freeShipping: true,
      expressDelivery: true,
      conciergeAccess: true,
      prioritySupport: true,
      vaultStorage: true
    }
  };
  
  return plans[planId] || null;
}

module.exports = exports;
