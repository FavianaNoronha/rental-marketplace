const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['style_pass_basic', 'style_pass_premium', 'style_pass_elite'],
    required: true
  },
  planDetails: {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true // ₹2,999/month for basic
    },
    currency: {
      type: String,
      default: 'INR'
    },
    // Benefits
    monthlyRentals: {
      type: Number,
      required: true,
      default: 2 // 2 high-end rentals per month for basic
    },
    maxRentalValue: {
      type: Number,
      default: 10000 // Max ₹10,000 per rental
    },
    freeShipping: {
      type: Boolean,
      default: true
    },
    expressDelivery: {
      type: Boolean,
      default: false
    },
    conciergeAccess: {
      type: Boolean,
      default: false // Only for premium/elite
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    vaultStorage: {
      type: Boolean,
      default: false // White-glove vault service
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'paused', 'payment_failed'],
    default: 'active'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  // Usage tracking
  currentPeriodUsage: {
    rentalsUsed: {
      type: Number,
      default: 0
    },
    rentalsRemaining: {
      type: Number,
      default: 2
    },
    totalValue: {
      type: Number,
      default: 0
    }
  },
  // Payment details
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet']
    },
    last4: String,
    brand: String,
    razorpayCustomerId: String,
    razorpaySubscriptionId: String
  },
  // History
  paymentHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending', 'refunded']
    },
    paymentId: String,
    invoiceId: String
  }],
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', 'system']
  },
  // Trial period
  trialEnd: Date,
  isTrialActive: {
    type: Boolean,
    default: false
  },
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: true
  },
  // Discounts
  discount: {
    code: String,
    percentage: Number,
    amount: Number,
    validUntil: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

// Reset monthly usage on period rollover
subscriptionSchema.methods.resetMonthlyUsage = function() {
  this.currentPeriodUsage.rentalsUsed = 0;
  this.currentPeriodUsage.rentalsRemaining = this.planDetails.monthlyRentals;
  this.currentPeriodUsage.totalValue = 0;
  return this.save();
};

// Check if user can rent under subscription
subscriptionSchema.methods.canRent = function(rentalValue) {
  if (this.status !== 'active') return false;
  if (this.currentPeriodUsage.rentalsRemaining <= 0) return false;
  if (rentalValue > this.planDetails.maxRentalValue) return false;
  return true;
};

// Use a rental quota
subscriptionSchema.methods.useRental = function(rentalValue) {
  if (!this.canRent(rentalValue)) {
    throw new Error('Subscription quota exceeded or inactive');
  }
  this.currentPeriodUsage.rentalsUsed += 1;
  this.currentPeriodUsage.rentalsRemaining -= 1;
  this.currentPeriodUsage.totalValue += rentalValue;
  return this.save();
};

// Calculate next billing date
subscriptionSchema.methods.calculateNextBilling = function() {
  const current = new Date(this.currentPeriodEnd);
  
  switch(this.billingCycle) {
    case 'monthly':
      current.setMonth(current.getMonth() + 1);
      break;
    case 'quarterly':
      current.setMonth(current.getMonth() + 3);
      break;
    case 'yearly':
      current.setFullYear(current.getFullYear() + 1);
      break;
  }
  
  this.nextBillingDate = current;
  return current;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
