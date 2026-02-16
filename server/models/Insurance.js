const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  description: String,
  coverageAmount: {
    type: Number,
    required: true
  },
  premiumPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  features: [String],
  terms: String,
  isActive: {
    type: Boolean,
    default: true
  },
  applicableFor: [{
    type: String,
    enum: ['all', 'electronics', 'vehicles', 'equipment', 'furniture', 'other']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema);
