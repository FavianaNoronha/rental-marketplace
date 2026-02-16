const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  actualReturnDate: Date,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  rentalAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  totalPaid: {
    type: Number,
    required: true
  },
  // OTP for handover and return
  handoverOTP: {
    code: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    expiresAt: Date
  },
  returnOTP: {
    code: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    expiresAt: Date
  },
  // Condition verification
  conditionAtHandover: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    photos: [String],
    notes: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },
  conditionAtReturn: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    photos: [String],
    notes: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },
  // Damage assessment
  damageAssessment: {
    hasDamage: {
      type: Boolean,
      default: false
    },
    damageDescription: String,
    damagePhotos: [String],
    estimatedCost: Number,
    agreedCost: Number,
    status: {
      type: String,
      enum: ['none', 'reported', 'under_review', 'agreed', 'disputed', 'resolved']
    }
  },
  // Insurance
  insurance: {
    opted: {
      type: Boolean,
      default: false
    },
    provider: String,
    policyNumber: String,
    premium: Number,
    coverage: Number
  },
  // Additional charges
  additionalCharges: [{
    type: {
      type: String,
      enum: ['late_fee', 'damage', 'cleaning', 'other']
    },
    amount: Number,
    description: String,
    paid: {
      type: Boolean,
      default: false
    }
  }],
  // Notes and communication
  notes: String,
  cancellationReason: String,
  depositRefunded: {
    type: Boolean,
    default: false
  },
  depositRefundAmount: Number,
  disputeRaised: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate late fees
rentalSchema.methods.calculateLateFee = function() {
  if (this.actualReturnDate && this.actualReturnDate > this.endDate) {
    const daysLate = Math.ceil((this.actualReturnDate - this.endDate) / (1000 * 60 * 60 * 24));
    const dailyRate = this.rentalAmount / Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    return daysLate * dailyRate * 1.5; // 50% penalty for late return
  }
  return 0;
};

module.exports = mongoose.model('Rental', rentalSchema);
