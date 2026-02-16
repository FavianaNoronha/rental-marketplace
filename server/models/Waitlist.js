const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  desiredStartDate: {
    type: Date,
    required: true
  },
  desiredEndDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String, // e.g., "3 days", "1 week"
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'booked', 'expired', 'cancelled'],
    default: 'waiting',
    index: true
  },
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority (for premium users)
  },
  notifiedAt: Date,
  expiresAt: Date, // Auto-expire after 24 hours of notification
  cancelledAt: Date,
  notes: {
    type: String,
    maxlength: 500
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes
waitlistSchema.index({ product: 1, status: 1, priority: -1, createdAt: 1 });
waitlistSchema.index({ user: 1, status: 1 });
waitlistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to notify users when product becomes available
waitlistSchema.statics.notifyAvailability = async function(productId, availableDate) {
  const waitingUsers = await this.find({
    product: productId,
    status: 'waiting',
    desiredStartDate: { $lte: new Date(availableDate.getTime() + 7 * 24 * 60 * 60 * 1000) } // Within 7 days
  })
  .sort({ priority: -1, createdAt: 1 })
  .populate('user', 'name email phone')
  .limit(10);

  // Update status and set expiration
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  for (const waitlistEntry of waitingUsers) {
    waitlistEntry.status = 'notified';
    waitlistEntry.notifiedAt = now;
    waitlistEntry.expiresAt = expiresAt;
    waitlistEntry.notificationSent = true;
    await waitlistEntry.save();

    // TODO: Send actual notification (email/push/SMS)
    // await sendNotification(waitlistEntry.user, productId, availableDate);
  }

  return waitingUsers;
};

// Method to get waitlist position
waitlistSchema.methods.getPosition = async function() {
  const higherPriority = await this.constructor.countDocuments({
    product: this.product,
    status: 'waiting',
    $or: [
      { priority: { $gt: this.priority } },
      { priority: this.priority, createdAt: { $lt: this.createdAt } }
    ]
  });

  return higherPriority + 1;
};

module.exports = mongoose.model('Waitlist', waitlistSchema);
