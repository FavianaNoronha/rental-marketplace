const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  },
  type: {
    type: String,
    enum: ['email_verification', 'phone_verification', 'rental_handover', 'rental_return', 'kyc_verification'],
    required: true
  },
  code: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  expiresAt: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
