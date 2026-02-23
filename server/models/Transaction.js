const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  rentalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  // Service/Protection Fee (₹200-₹500)
  serviceFee: {
    type: Number,
    default: 0,
    min: 0
  },
  // Split payment breakdown
  splitPayment: {
    totalAmount: {
      type: Number,
      required: true
    },
    rentalAmount: Number,
    securityDepositAmount: Number,
    serviceFeeAmount: Number,
    // Platform commission (15-30% for rental, 10-20% for sale)
    platformCommission: {
      amount: Number,
      percentage: Number
    },
    // Owner payout
    ownerPayout: {
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'processed', 'paid', 'held', 'refunded'],
        default: 'pending'
      },
      paidAt: Date,
      transferId: String // Razorpay Route transfer ID
    }
  },
  // Escrow for security deposit
  escrow: {
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['held', 'released_to_owner', 'refunded_to_renter', 'partially_refunded'],
      default: 'held'
    },
    heldAt: Date,
    releasedAt: Date,
    releaseReason: String,
    // Deductions from escrow
    deductions: [{
      amount: Number,
      reason: {
        type: String,
        enum: ['damage', 'late_return', 'cleaning', 'other']
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    amountRefunded: Number
  },
  type: {
    type: String,
    enum: [
      'rental_payment',
      'sale_payment',
      'security_deposit',
      'deposit_refund',
      'damage_charge',
      'late_fee',
      'service_fee',
      'subscription_payment',
      'sponsored_listing'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'authorized', 'captured', 'completed', 'failed', 'refunded', 'held', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cashfree', 'stripe', 'paypal', 'upi', 'card', 'netbanking', 'wallet'],
    required: true
  },
  // Payment gateway details
  paymentGateway: {
    provider: {
      type: String,
      enum: ['razorpay', 'cashfree', 'stripe']
    },
    orderId: String,
    paymentId: String,
    transferId: String, // For Razorpay Route / Cashfree Easy Split
    signature: String,
    // Pre-authorization for security deposits
    authorizationId: String,
    isPreAuth: {
      type: Boolean,
      default: false
    },
    capturedAt: Date
  },
  paymentIntentId: String,
  refundId: String,
  description: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
