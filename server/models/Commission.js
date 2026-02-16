const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  },
  transactionType: {
    type: String,
    enum: ['rental', 'sale', 'service_fee', 'premium'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // The person who earns revenue
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // The person who pays
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  // Amounts
  grossAmount: {
    type: Number,
    required: true, // Total transaction amount
    min: 0
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 10, // Default 10% commission
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true, // Amount after commission deduction
    min: 0
  },
  // Payment processing
  platformEarnings: {
    type: Number,
    required: true,
    default: 0
  },
  ownerPayout: {
    type: Number,
    required: true
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid_out', 'refunded', 'disputed'],
    default: 'pending'
  },
  paidOutAt: Date,
  paidOutMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'wallet']
  },
  paidOutReference: String,
  // Periods for accounting
  periodMonth: {
    type: Number,
    min: 1,
    max: 12
  },
  periodYear: {
    type: Number
  },
  // Additional fees
  additionalFees: [{
    type: {
      type: String,
      enum: ['payment_processing', 'insurance', 'late_fee', 'damage_fee', 'boost', 'premium']
    },
    amount: Number,
    description: String
  }],
  totalAdditionalFees: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for reporting and queries
commissionSchema.index({ owner: 1, status: 1, createdAt: -1 });
commissionSchema.index({ transactionType: 1, status: 1 });
commissionSchema.index({ periodYear: 1, periodMonth: 1 });
commissionSchema.index({ transaction: 1 }, { unique: true });

// Calculate commission before saving
commissionSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('grossAmount') || this.isModified('commissionRate')) {
    this.commissionAmount = (this.grossAmount * this.commissionRate) / 100;
    this.netAmount = this.grossAmount - this.commissionAmount;
    this.platformEarnings = this.commissionAmount + this.totalAdditionalFees;
    this.ownerPayout = this.netAmount - this.totalAdditionalFees;
    
    // Set accounting period
    const now = new Date();
    this.periodMonth = now.getMonth() + 1;
    this.periodYear = now.getFullYear();
  }
  next();
});

// Static method to calculate earnings report
commissionSchema.statics.getEarningsReport = async function(filters = {}) {
  const { userId, startDate, endDate, status } = filters;
  
  const matchStage = {};
  if (userId) matchStage.owner = mongoose.Types.ObjectId(userId);
  if (status) matchStage.status = status;
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const report = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalGross: { $sum: '$grossAmount' },
        totalCommission: { $sum: '$commissionAmount' },
        totalNet: { $sum: '$netAmount' },
        totalPlatformEarnings: { $sum: '$platformEarnings' },
        totalOwnerPayout: { $sum: '$ownerPayout' },
        avgCommissionRate: { $avg: '$commissionRate' }
      }
    }
  ]);

  return report[0] || {
    totalTransactions: 0,
    totalGross: 0,
    totalCommission: 0,
    totalNet: 0,
    totalPlatformEarnings: 0,
    totalOwnerPayout: 0,
    avgCommissionRate: 0
  };
};

// Static method for monthly breakdown
commissionSchema.statics.getMonthlyBreakdown = async function(year, userId = null) {
  const matchStage = { periodYear: year };
  if (userId) matchStage.owner = mongoose.Types.ObjectId(userId);

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$periodMonth',
        transactions: { $sum: 1 },
        gross: { $sum: '$grossAmount' },
        commission: { $sum: '$commissionAmount' },
        net: { $sum: '$netAmount' },
        platformEarnings: { $sum: '$platformEarnings' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('Commission', commissionSchema);
