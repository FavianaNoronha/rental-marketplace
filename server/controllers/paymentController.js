const Transaction = require('../models/Transaction');
const Rental = require('../models/Rental');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key_here'
});

// Create Razorpay order with pre-authorization
exports.createRentalOrder = async (req, res) => {
  try {
    const { rentalId } = req.body;

    const rental = await Rental.findById(rentalId).populate('product');
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Calculate total amount (rental + deposit for pre-authorization)
    const totalAmount = rental.rentalAmount + rental.securityDeposit;

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `rental_${rentalId}`,
      payment_capture: 0, // Manual capture - don't auto-capture
      notes: {
        rental_id: rentalId,
        product_id: rental.product._id.toString(),
        renter_id: rental.renter.toString(),
        owner_id: rental.owner.toString(),
        rental_amount: rental.rentalAmount,
        security_deposit: rental.securityDeposit,
        type: 'rental_with_deposit'
      }
    });

    // Update rental with order details
    rental.razorpayOrderId = order.id;
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        rentalAmount: rental.rentalAmount,
        securityDeposit: rental.securityDeposit,
        productTitle: rental.product.title
      }
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Order creation failed',
      error: error.message
    });
  }
};

// Verify Razorpay payment and capture rental amount
exports.verifyAndCapturePayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      rentalId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Capture only the rental amount (not deposit - deposit stays authorized)
    const captureResponse = await razorpayInstance.payments.capture(
      razorpay_payment_id,
      Math.round(rental.rentalAmount * 100), // Capture only rental amount in paise
      'INR'
    );

    // Create rental payment transaction
    const rentalTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: rental.rentalAmount,
      securityDeposit: rental.securityDeposit,
      type: 'rental_payment',
      status: 'completed',
      paymentMethod: 'razorpay',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      description: `Rental payment for booking #${rentalId}`
    });

    // Create security deposit transaction (held, not captured)
    const depositTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: rental.securityDeposit,
      securityDeposit: rental.securityDeposit,
      type: 'security_deposit',
      status: 'held',
      paymentMethod: 'razorpay',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      description: `Security deposit held for booking #${rentalId}`
    });

    // Update rental status
    rental.status = 'confirmed';
    rental.razorpayPaymentId = razorpay_payment_id;
    rental.paymentStatus = 'paid';
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: {
        rental,
        rentalTransaction,
        depositTransaction
      }
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Process security deposit refund (with Razorpay)
exports.refundSecurityDeposit = async (req, res) => {
  try {
    const { rentalId, deductions = 0, deductionReason = '' } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Only owner can initiate refund
    if (rental.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (rental.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Rental must be completed before refunding deposit'
      });
    }

    if (rental.depositRefunded) {
      return res.status(400).json({
        success: false,
        message: 'Deposit already refunded'
      });
    }

    // Find the held deposit transaction
    const depositTransaction = await Transaction.findOne({
      rentalId,
      type: 'security_deposit',
      status: 'held'
    });

    if (!depositTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Deposit transaction not found'
      });
    }

    // Calculate refund amount (deposit - deductions)
    const refundAmount = rental.securityDeposit - deductions;

    if (refundAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Deduction cannot exceed deposit amount'
      });
    }

    // Process Razorpay refund
    let razorpayRefund = null;
    if (refundAmount > 0 && depositTransaction.razorpayPaymentId) {
      razorpayRefund = await razorpayInstance.payments.refund(
        depositTransaction.razorpayPaymentId,
        {
          amount: Math.round(refundAmount * 100), // Amount in paise
          notes: {
            rental_id: rentalId,
            reason: deductionReason || 'Deposit refund after rental return',
            deductions: deductions
          }
        }
      );
    }

    // Create refund transaction
    const refundTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: refundAmount,
      securityDeposit: 0,
      type: 'deposit_refund',
      status: 'completed',
      paymentMethod: 'razorpay',
      razorpayRefundId: razorpayRefund?.id,
      description: `Security deposit refund for booking #${rentalId}${deductions > 0 ? ` (₹${deductions} deducted: ${deductionReason})` : ''}`
    });

    // If there were deductions, create deduction transaction
    if (deductions > 0) {
      await Transaction.create({
        rentalId,
        product: rental.product,
        renter: rental.renter,
        owner: rental.owner,
        amount: deductions,
        securityDeposit: 0,
        type: 'damage_charge',
        status: 'completed',
        paymentMethod: 'razorpay',
        description: `Deduction from deposit: ${deductionReason}`
      });
    }

    // Update deposit transaction status
    depositTransaction.status = 'refunded';
    depositTransaction.refundId = refundTransaction._id;
    await depositTransaction.save();

    // Mark deposit as refunded in rental
    rental.depositRefunded = true;
    rental.depositRefundAmount = refundAmount;
    rental.depositDeductionAmount = deductions;
    rental.depositDeductionReason = deductionReason;
    await rental.save();

    res.status(200).json({
      success: true,
      message: `Security deposit ${refundAmount > 0 ? 'refunded' : 'processed'} successfully`,
      data: {
        refundTransaction,
        refundAmount,
        deductions,
        razorpayRefundId: razorpayRefund?.id
      }
    });
  } catch (error) {
    console.error('Refund processing failed:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
};

// Process additional charge (damage/late fee)
exports.processAdditionalCharge = async (req, res) => {
  try {
    const { rentalId, chargeType, amount, description } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Create charge transaction
    const transaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount,
      securityDeposit: 0,
      type: chargeType,
      status: 'completed',
      paymentMethod: 'deducted_from_deposit',
      description
    });

    res.status(200).json({
      success: true,
      message: 'Additional charge processed successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Charge processing failed',
      error: error.message
    });
  }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { renter: req.user._id },
        { owner: req.user._id }
      ]
    })
    .populate('product', 'title images')
    .populate('renter', 'name email')
    .populate('owner', 'name email')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Calculate earnings from completed rentals
    const earnings = await Transaction.aggregate([
      {
        $match: {
          owner: req.user._id,
          type: 'rental_payment',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const balance = earnings.length > 0 ? earnings[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        balance,
        currency: 'USD'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet balance',
      error: error.message
    });
  }
};
