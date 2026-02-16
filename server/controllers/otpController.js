const OTP = require('../models/OTP');
const User = require('../models/User');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { type, email, phone, rentalId } = req.body;
    const userId = req.user._id;

    // Generate 6-digit OTP
    const code = generateOTP();
    
    // Set expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Check if there's an existing unverified OTP
    await OTP.deleteMany({
      user: userId,
      type,
      verified: false,
      rental: rentalId || null
    });

    // Create new OTP
    const otp = await OTP.create({
      user: userId,
      rental: rentalId,
      type,
      code,
      email,
      phone,
      expiresAt
    });

    // TODO: Send OTP via email/SMS
    // For now, in development, return the OTP (REMOVE IN PRODUCTION!)
    const response = {
      success: true,
      message: `OTP sent successfully to ${email || phone}`,
      ...(process.env.NODE_ENV === 'development' && { otp: code })
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { code, type, rentalId } = req.body;
    const userId = req.user._id;

    const otp = await OTP.findOne({
      user: userId,
      type,
      code,
      verified: false,
      rental: rentalId || null
    });

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > otp.expiresAt) {
      await otp.deleteOne();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otp.attempts >= otp.maxAttempts) {
      await otp.deleteOne();
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts exceeded'
      });
    }

    // Mark as verified
    otp.verified = true;
    otp.verifiedAt = new Date();
    await otp.save();

    // Update user verification status if applicable
    if (type === 'email_verification') {
      await User.findByIdAndUpdate(userId, { emailVerified: true });
    } else if (type === 'phone_verification') {
      await User.findByIdAndUpdate(userId, { phoneVerified: true });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { type, email, phone, rentalId } = req.body;
    const userId = req.user._id;

    // Check rate limiting (max 3 resends per 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      user: userId,
      type,
      createdAt: { $gte: thirtyMinutesAgo }
    });

    if (recentOTPs >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again later.'
      });
    }

    // Send new OTP
    await exports.sendOTP(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    });
  }
};
