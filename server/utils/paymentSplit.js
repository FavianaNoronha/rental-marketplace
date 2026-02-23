/**
 * Payment Split and Escrow Utilities
 * For Razorpay Route / Cashfree Easy Split integration
 */

/**
 * Calculate commission based on transaction type and amount
 * @param {String} type - 'rental' | 'sale'
 * @param {Number} amount - Transaction amount
 * @param {Object} options - Additional options
 * @returns {Object} Commission breakdown
 */
const calculateCommission = (type, amount, options = {}) => {
  let commissionRate = 0;
  
  // Commission rates from strategic blueprint
  if (type === 'rental') {
    // 15% to 30% for rentals (use 20% as default)
    commissionRate = options.commissionRate || 20;
  } else if (type === 'sale') {
    // 10% to 20% for sales (use 15% as default)
    commissionRate = options.commissionRate || 15;
  }
  
  // Service/Protection fee (₹200-₹500)
  const serviceFee = options.serviceFee || 300;
  
  const commissionAmount = Math.round((amount * commissionRate) / 100);
  const netAmount = amount - commissionAmount;
  
  return {
    grossAmount: amount,
    commissionRate,
    commissionAmount,
    netAmount,
    serviceFee,
    platformEarnings: commissionAmount + serviceFee
  };
};

/**
 * Create split payment breakdown
 * Example: Renter pays ₹10,000 (₹8,000 rental + ₹2,000 security deposit)
 * Split: ₹2,000 escrow, ₹1,600 platform (20%), ₹6,400 to lender
 * 
 * @param {Object} params - Payment parameters
 * @returns {Object} Split payment breakdown
 */
const createSplitPayment = (params) => {
  const {
    rentalAmount = 0,
    securityDeposit = 0,
    transactionType = 'rental', // 'rental' | 'sale'
    commissionRate = null,
    serviceFee = 300
  } = params;
  
  const commission = calculateCommission(transactionType, rentalAmount, {
    commissionRate,
    serviceFee
  });
  
  const totalAmount = rentalAmount + securityDeposit + serviceFee;
  
  return {
    totalAmount,
    breakdown: {
      rentalAmount,
      securityDeposit,
      serviceFee
    },
    commission: {
      rate: commission.commissionRate,
      amount: commission.commissionAmount
    },
    splits: {
      escrow: securityDeposit, // Held in escrow
      platform: commission.platformEarnings, // Commission + Service fee
      owner: commission.netAmount // Payout to lender
    },
    ownerPayout: {
      amount: commission.netAmount,
      status: 'pending'
    }
  };
};

/**
 * Generate Razorpay Route transfer request
 * @param {Object} params - Transfer parameters
 * @returns {Object} Razorpay transfer request
 */
const createRazorpayTransfer = (params) => {
  const {
    paymentId,
    accountId, // Lender's Razorpay account ID
    amount,
    currency = 'INR',
    notes = {}
  } = params;
  
  return {
    account: accountId,
    amount: amount * 100, // Convert to paise
    currency,
    on_hold: 0, // 0 = immediate transfer, 1 = hold
    notes: {
      ...notes,
      payout_type: 'rental_commission'
    }
  };
};

/**
 * Create Cashfree Easy Split configuration
 * @param {Object} params - Split parameters
 * @returns {Object} Cashfree split config
 */
const createCashfreeSplit = (params) => {
  const {
    orderId,
    vendorId, // Lender's vendor ID
    vendorAmount,
    platformAmount,
    splitType = 'ABSOLUTE' // or 'PERCENTAGE'
  } = params;
  
  return {
    order_id: orderId,
    split: [
      {
        vendor_id: vendorId,
        amount: vendorAmount,
        percentage: null
      }
    ],
    split_type: splitType
  };
};

/**
 * Calculate security deposit pre-authorization
 * This "blocks" the amount on the renter's card without charging
 * 
 * @param {Number} depositAmount - Security deposit amount
 * @param {Number} rentalDays - Number of rental days
 * @returns {Object} Pre-auth details
 */
const createSecurityDepositPreAuth = (depositAmount, rentalDays) => {
  // Hold period should cover rental + buffer
  const holdDays = rentalDays + 7; // 7 days buffer for return
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + holdDays);
  
  return {
    amount: depositAmount,
    type: 'pre_authorization',
    autoCapture: false,
    holdUntil: expiryDate,
    description: `Security deposit for ${rentalDays} day rental`,
    notes: {
      purpose: 'security_deposit',
      rental_days: rentalDays
    }
  };
};

/**
 * Process escrow release or refund
 * @param {Object} escrow - Escrow object from transaction
 * @param {String} action - 'release_to_owner' | 'refund_to_renter' | 'partial'
 * @param {Object} params - Additional parameters
 * @returns {Object} Escrow settlement
 */
const settleEscrow = (escrow, action, params = {}) => {
  const { amount, deductions = [] } = params;
  
  let settlement = {
    originalAmount: escrow.amount,
    action,
    timestamp: new Date()
  };
  
  switch (action) {
    case 'release_to_owner':
      // Full release to owner (no damages)
      settlement.ownerPayout = escrow.amount;
      settlement.renterRefund = 0;
      settlement.status = 'released_to_owner';
      break;
      
    case 'refund_to_renter':
      // Full refund to renter
      settlement.ownerPayout = 0;
      settlement.renterRefund = escrow.amount;
      settlement.status = 'refunded_to_renter';
      break;
      
    case 'partial':
      // Partial deduction for damages/late fees
      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      settlement.deductions = deductions;
      settlement.totalDeducted = totalDeductions;
      settlement.ownerPayout = Math.min(totalDeductions, escrow.amount);
      settlement.renterRefund = Math.max(0, escrow.amount - totalDeductions);
      settlement.status = 'partially_refunded';
      break;
      
    default:
      throw new Error('Invalid escrow action');
  }
  
  return settlement;
};

/**
 * Calculate late return fees
 * @param {Date} expectedReturnDate - Expected return date
 * @param {Date} actualReturnDate - Actual return date
 * @param {Number} dailyRate - Daily rental rate
 * @returns {Object} Late fee calculation
 */
const calculateLateFee = (expectedReturnDate, actualReturnDate, dailyRate) => {
  const expected = new Date(expectedReturnDate);
  const actual = new Date(actualReturnDate);
  
  const diffTime = actual - expected;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return {
      isLate: false,
      daysLate: 0,
      lateFee: 0
    };
  }
  
  // Late fee: 1.5x daily rate per day + ₹100 penalty per day
  const lateFeePerDay = (dailyRate * 1.5) + 100;
  const totalLateFee = Math.round(diffDays * lateFeePerDay);
  
  return {
    isLate: true,
    daysLate: diffDays,
    dailyRate,
    lateFeePerDay,
    totalLateFee,
    expectedReturn: expected,
    actualReturn: actual
  };
};

/**
 * Calculate sponsored listing cost (PPC)
 * @param {Number} clicks - Number of clicks
 * @param {Number} costPerClick - Cost per click (default ₹5)
 * @param {Number} budget - Maximum budget
 * @returns {Object} Sponsored listing cost
 */
const calculateSponsoredCost = (clicks, costPerClick = 5, budget = null) => {
  const totalCost = clicks * costPerClick;
  const actualCost = budget ? Math.min(totalCost, budget) : totalCost;
  
  return {
    clicks,
    costPerClick,
    totalCost,
    budget,
    actualCost,
    budgetRemaining: budget ? Math.max(0, budget - actualCost) : null,
    budgetExhausted: budget ? actualCost >= budget : false
  };
};

/**
 * Generate invoice for transaction
 * @param {Object} transaction - Transaction object
 * @param {Object} user - User object
 * @returns {Object} Invoice data
 */
const generateInvoice = (transaction, user) => {
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  return {
    invoiceNumber,
    date: new Date(),
    customer: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    lineItems: [
      {
        description: 'Rental Amount',
        amount: transaction.splitPayment.breakdown.rentalAmount
      },
      {
        description: 'Security Deposit (Refundable)',
        amount: transaction.splitPayment.breakdown.securityDeposit
      },
      {
        description: 'Service Fee',
        amount: transaction.splitPayment.breakdown.serviceFee
      }
    ],
    subtotal: transaction.splitPayment.totalAmount - transaction.splitPayment.breakdown.serviceFee,
    fees: transaction.splitPayment.breakdown.serviceFee,
    total: transaction.splitPayment.totalAmount,
    paymentMethod: transaction.paymentMethod,
    status: transaction.status
  };
};

/**
 * Validate payment gateway webhook signature
 * @param {String} signature - Webhook signature
 * @param {Object} payload - Webhook payload
 * @param {String} secret - Webhook secret
 * @param {String} provider - 'razorpay' | 'cashfree'
 * @returns {Boolean} Valid signature
 */
const validateWebhookSignature = (signature, payload, secret, provider = 'razorpay') => {
  const crypto = require('crypto');
  
  if (provider === 'razorpay') {
    // Razorpay signature verification
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  } else if (provider === 'cashfree') {
    // Cashfree signature verification
    const timestamp = payload.timestamp;
    const signedPayload = `${timestamp}.${JSON.stringify(payload.data)}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
    
    return signature === expectedSignature;
  }
  
  return false;
};

module.exports = {
  calculateCommission,
  createSplitPayment,
  createRazorpayTransfer,
  createCashfreeSplit,
  createSecurityDepositPreAuth,
  settleEscrow,
  calculateLateFee,
  calculateSponsoredCost,
  generateInvoice,
  validateWebhookSignature
};
