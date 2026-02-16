const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['not_started', 'pending', 'approved', 'rejected', 'expired'],
    default: 'not_started'
  },
  // Personal Information
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  // ID Verification
  idType: {
    type: String,
    enum: ['passport', 'drivers_license', 'national_id', 'other']
  },
  idNumber: String,
  idFrontImage: String,
  idBackImage: String,
  selfieImage: String,
  // Phone Verification
  phoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerifiedAt: Date,
  // Email Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date,
  // Address Verification
  addressProofType: {
    type: String,
    enum: ['utility_bill', 'bank_statement', 'rental_agreement', 'other']
  },
  addressProofImage: String,
  addressVerified: {
    type: Boolean,
    default: false
  },
  // Review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rejectionReason: String,
  notes: String,
  expiresAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('KYC', kycSchema);
