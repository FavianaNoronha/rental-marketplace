const mongoose = require('mongoose');

const rentalCalendarSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['booked', 'active', 'completed', 'cancelled'],
    default: 'booked',
    index: true
  },
  // For display purposes
  displayStatus: {
    type: String,
    enum: ['upcoming', 'on_rent', 'returned'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Compound index for date range queries
rentalCalendarSchema.index({ product: 1, startDate: 1, endDate: 1 });
rentalCalendarSchema.index({ product: 1, status: 1 });

// Method to check if a date range is available
rentalCalendarSchema.statics.isAvailable = async function(productId, startDate, endDate, excludeRentalId = null) {
  const query = {
    product: productId,
    status: { $in: ['booked', 'active'] },
    $or: [
      // New booking starts during existing rental
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      // New booking ends during existing rental
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      // New booking completely contains existing rental
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
    ]
  };

  if (excludeRentalId) {
    query.rental = { $ne: excludeRentalId };
  }

  const conflicts = await this.find(query);
  return conflicts.length === 0;
};

// Method to get next available date
rentalCalendarSchema.statics.getNextAvailableDate = async function(productId) {
  const activeRentals = await this.find({
    product: productId,
    status: { $in: ['booked', 'active'] }
  }).sort({ endDate: -1 }).limit(1);

  if (activeRentals.length === 0) {
    return new Date(); // Available now
  }

  return new Date(activeRentals[0].endDate);
};

// Method to get current rental status
rentalCalendarSchema.statics.getCurrentStatus = async function(productId) {
  const now = new Date();
  
  const currentRental = await this.findOne({
    product: productId,
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('renter', 'name avatar');

  if (currentRental) {
    return {
      isRented: true,
      rental: currentRental,
      availableFrom: currentRental.endDate,
      daysUntilAvailable: Math.ceil((currentRental.endDate - now) / (1000 * 60 * 60 * 24))
    };
  }

  return {
    isRented: false,
    availableNow: true
  };
};

module.exports = mongoose.model('RentalCalendar', rentalCalendarSchema);
