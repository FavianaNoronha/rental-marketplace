const Transaction = require('../models/Transaction');
const Rental = require('../models/Rental');
const User = require('../models/User');

// Note: In production, integrate with actual payment gateway (Stripe/PayPal)

// Process rental payment
exports.processRentalPayment = async (req, res) => {
  try {
    const { rentalId, paymentMethod } = req.body;

    const rental = await Rental.findById(rentalId);
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

    // Create rental payment transaction
    const rentalTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: rental.rentalAmount,
      securityDeposit: rental.securityDeposit,
      type: 'rental_payment',
      status: 'completed', // In production, this would be 'pending' until payment gateway confirms
      paymentMethod,
      description: `Rental payment for booking #${rentalId}`
    });

    // Create security deposit transaction
    const depositTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: rental.securityDeposit,
      securityDeposit: rental.securityDeposit,
      type: 'security_deposit',
      status: 'held', // Deposit is held until rental completion
      paymentMethod,
      description: `Security deposit for booking #${rentalId}`
    });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        rentalTransaction,
        depositTransaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// Process security deposit refund
exports.refundSecurityDeposit = async (req, res) => {
  try {
    const { rentalId } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
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

    // Create refund transaction
    const refundTransaction = await Transaction.create({
      rentalId,
      product: rental.product,
      renter: rental.renter,
      owner: rental.owner,
      amount: rental.depositRefundAmount,
      securityDeposit: 0,
      type: 'deposit_refund',
      status: 'completed',
      paymentMethod: depositTransaction.paymentMethod,
      description: `Security deposit refund for booking #${rentalId}`
    });

    // Update deposit transaction status
    depositTransaction.status = 'refunded';
    depositTransaction.refundId = refundTransaction._id;
    await depositTransaction.save();

    // Mark deposit as refunded in rental
    rental.depositRefunded = true;
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Security deposit refunded successfully',
      data: refundTransaction
    });
  } catch (error) {
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
