const Rental = require('../models/Rental');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const OTP = require('../models/OTP');
const User = require('../models/User');

// Create rental request
exports.createRental = async (req, res) => {
  try {
    const {
      productId,
      startDate,
      endDate,
      insurance
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own product'
      });
    }

    // Check availability
    if (!product.available) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Calculate rental duration
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const rentalAmount = product.pricePerDay * days;
    
    // Calculate security deposit (20% of total rental amount or product's security deposit)
    const securityDeposit = product.securityDeposit || rentalAmount * 0.2;
    
    // Calculate insurance premium if opted
    let insurancePremium = 0;
    if (insurance && insurance.opted) {
      insurancePremium = rentalAmount * (insurance.premiumPercentage / 100);
    }

    const totalPaid = rentalAmount + securityDeposit + insurancePremium;

    // Create rental
    const rental = await Rental.create({
      product: productId,
      renter: req.user._id,
      owner: product.owner,
      startDate,
      endDate,
      rentalAmount,
      securityDeposit,
      totalPaid,
      insurance: insurance || { opted: false },
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Rental request created successfully',
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create rental',
      error: error.message
    });
  }
};

// Confirm rental (by owner)
exports.confirmRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to confirm this rental'
      });
    }

    if (rental.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Rental cannot be confirmed'
      });
    }

    rental.status = 'confirmed';
    await rental.save();

    // Generate handover OTP
    const handoverOTP = Math.floor(100000 + Math.random() * 900000).toString();
    rental.handoverOTP = {
      code: handoverOTP,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Rental confirmed. Handover OTP generated.',
      data: rental,
      ...(process.env.NODE_ENV === 'development' && { handoverOTP })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to confirm rental',
      error: error.message
    });
  }
};

// Verify handover OTP and mark rental as active
exports.verifyHandoverOTP = async (req, res) => {
  try {
    const { rentalId, otp, conditionRating, conditionPhotos, notes } = req.body;
    
    const rental = await Rental.findById(rentalId).populate('product');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.handoverOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > rental.handoverOTP.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark handover as verified
    rental.handoverOTP.verified = true;
    rental.handoverOTP.verifiedAt = new Date();
    rental.status = 'active';
    
    // Record condition at handover
    rental.conditionAtHandover = {
      rating: conditionRating,
      photos: conditionPhotos || [],
      notes: notes || '',
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    };

    // Mark product as not available
    await Product.findByIdAndUpdate(rental.product._id, { available: false });

    // Generate return OTP
    const returnOTP = Math.floor(100000 + Math.random() * 900000).toString();
    rental.returnOTP = {
      code: returnOTP,
      expiresAt: new Date(rental.endDate.getTime() + 24 * 60 * 60 * 1000) // 24 hours after end date
    };

    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Handover verified successfully. Rental is now active.',
      data: rental,
      ...(process.env.NODE_ENV === 'development' && { returnOTP })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify handover',
      error: error.message
    });
  }
};

// Verify return OTP and complete rental
exports.verifyReturnOTP = async (req, res) => {
  try {
    const { rentalId, otp, conditionRating, conditionPhotos, notes, actualReturnDate } = req.body;
    
    const rental = await Rental.findById(rentalId).populate('product');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.returnOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark return as verified
    rental.returnOTP.verified = true;
    rental.returnOTP.verifiedAt = new Date();
    rental.actualReturnDate = actualReturnDate || new Date();
    
    // Record condition at return
    rental.conditionAtReturn = {
      rating: conditionRating,
      photos: conditionPhotos || [],
      notes: notes || '',
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    };

    // Check for condition difference
    const conditionDifference = rental.conditionAtHandover.rating - conditionRating;
    let damageCharge = 0;

    if (conditionDifference > 1) {
      // Significant damage detected
      rental.damageAssessment = {
        hasDamage: true,
        damageDescription: `Condition deteriorated from ${rental.conditionAtHandover.rating} to ${conditionRating}`,
        damagePhotos: conditionPhotos || [],
        status: 'reported'
      };
      
      // Estimate damage cost (you can customize this logic)
      damageCharge = rental.securityDeposit * (conditionDifference / 5);
      rental.damageAssessment.estimatedCost = damageCharge;
    }

    // Calculate late fee if applicable
    const lateFee = rental.calculateLateFee();
    if (lateFee > 0) {
      rental.additionalCharges.push({
        type: 'late_fee',
        amount: lateFee,
        description: `Late return fee`,
        paid: false
      });
    }

    // Calculate deposit refund
    let depositRefundAmount = rental.securityDeposit - damageCharge;
    
    // Deduct any additional charges from deposit
    const totalAdditionalCharges = rental.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    depositRefundAmount -= totalAdditionalCharges;

    rental.depositRefundAmount = Math.max(0, depositRefundAmount);
    rental.depositRefunded = rental.depositRefundAmount > 0;
    rental.status = 'completed';

    // Mark product as available again
    await Product.findByIdAndUpdate(rental.product._id, { available: true });

    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Return verified successfully. Rental completed.',
      data: rental,
      refundAmount: depositRefundAmount,
      lateFee,
      damageCharge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify return',
      error: error.message
    });
  }
};

// Get user's rentals
exports.getUserRentals = async (req, res) => {
  try {
    const { type } = req.query; // 'rented' or 'owned'
    
    let query = {};
    if (type === 'rented') {
      query.renter = req.user._id;
    } else if (type === 'owned') {
      query.owner = req.user._id;
    } else {
      query = {
        $or: [
          { renter: req.user._id },
          { owner: req.user._id }
        ]
      };
    }

    const rentals = await Rental.find(query)
      .populate('product')
      .populate('renter', 'name email profilePicture')
      .populate('owner', 'name email profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rentals',
      error: error.message
    });
  }
};

// Cancel rental
exports.cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Only pending or confirmed rentals can be cancelled
    if (!['pending', 'confirmed'].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: 'This rental cannot be cancelled'
      });
    }

    // Check authorization
    const isRenter = rental.renter.toString() === req.user._id.toString();
    const isOwner = rental.owner.toString() === req.user._id.toString();
    
    if (!isRenter && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this rental'
      });
    }

    rental.status = 'cancelled';
    rental.cancellationReason = req.body.reason || 'No reason provided';
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Rental cancelled successfully',
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel rental',
      error: error.message
    });
  }
};
