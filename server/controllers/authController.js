const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken } = require('../utils/jwt');
const smsService = require('../utils/smsService');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      phone: req.body.phone,
      location: req.body.location
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user with that email'
      });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetToken // In production, send this via email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send OTP for phone login
// @route   POST /api/auth/phone/send-otp
// @access  Public
exports.sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a phone number'
      });
    }

    // Validate Indian phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10); // Get last 10 digits
    
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian phone number'
      });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unverified OTPs for this phone
    await OTP.deleteMany({ phone: cleanPhone, verified: false });

    // Create new OTP
    await OTP.create({
      phone: cleanPhone,
      code: otpCode,
      type: 'phone_verification',
      expiresAt,
      attempts: 0
    });

    // Send OTP via SMS
    try {
      await smsService.sendOTP('+91' + cleanPhone, otpCode, 'login');
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your phone',
        phone: `******${cleanPhone.slice(-4)}`, // Masked phone
        expiresIn: 600 // seconds
      });
    } catch (smsError) {
      console.error('SMS Error:', smsError);
      
      // In development, still return success and log OTP to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔐 OTP for ${cleanPhone}: ${otpCode}\n`);
        return res.status(200).json({
          success: true,
          message: 'OTP sent (check console in dev mode)',
          phone: `******${cleanPhone.slice(-4)}`,
          expiresIn: 600,
          devOTP: otpCode // Only in development!
        });
      }
      
      throw smsError;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending OTP'
    });
  }
};

// @desc    Verify OTP and login/register
// @route   POST /api/auth/phone/verify-otp
// @access  Public
exports.verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and OTP'
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Find OTP
    const otpDoc = await OTP.findOne({
      phone: cleanPhone,
      verified: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 }); // Get most recent OTP

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check max attempts
    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpDoc.code !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${otpDoc.maxAttempts - otpDoc.attempts} attempts remaining.`
      });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    otpDoc.verifiedAt = new Date();
    await otpDoc.save();

    // Find or create user
    let user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      // New user - registration via OTP
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your name for registration',
          requiresRegistration: true
        });
      }

      user = await User.create({
        name,
        phone: cleanPhone,
        phoneVerified: true,
        email: `${cleanPhone}@phone.closetly.com`, // Temporary email
        password: crypto.randomBytes(16).toString('hex') // Random password
      });
    } else {
      // Existing user - mark phone as verified
      if (!user.phoneVerified) {
        user.phoneVerified = true;
        await user.save();
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phoneVerified: user.phoneVerified
      },
      isNewUser: !user.phoneVerified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/phone/resend-otp
// @access  Public
exports.resendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a phone number'
      });
    }

    // Use sendPhoneOTP logic
    return exports.sendPhoneOTP(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
