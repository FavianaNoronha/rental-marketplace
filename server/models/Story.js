const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Optional - stories can be about products or general
  },
  type: {
    type: String,
    enum: ['image', 'video', 'text', 'product_showcase'],
    required: true
  },
  media: {
    url: String,
    thumbnail: String,
    duration: Number // For videos
  },
  text: {
    type: String,
    maxlength: 500
  },
  backgroundColor: {
    type: String,
    default: '#000000'
  },
  // Engagement
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewsCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  // Interaction options
  enableReplies: {
    type: Boolean,
    default: true
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Call to action for products
  cta: {
    type: {
      type: String,
      enum: ['rent_now', 'buy_now', 'inquire', 'view_product', 'none'],
      default: 'none'
    },
    text: String,
    link: String
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    index: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
storySchema.index({ user: 1, createdAt: -1 });
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
storySchema.index({ isActive: 1, expiresAt: 1 });

// Auto-expire stories after 24 hours
storySchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }
  next();
});

// Method to add view
storySchema.methods.addView = async function(userId) {
  // Check if user already viewed
  const alreadyViewed = this.views.some(view => 
    view.user.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.views.push({ user: userId });
    this.viewsCount += 1;
    await this.save();
  }
  
  return this.viewsCount;
};

// Method to toggle like
storySchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(id => id.toString() === userIdStr);

  if (likeIndex > -1) {
    // Unlike
    this.likes.splice(likeIndex, 1);
    this.likesCount -= 1;
  } else {
    // Like
    this.likes.push(userId);
    this.likesCount += 1;
  }

  await this.save();
  return this.likesCount;
};

// Static method to get active stories from following users
storySchema.statics.getActiveStories = async function(userId, followingIds) {
  const now = new Date();
  
  return await this.find({
    user: { $in: followingIds },
    isActive: true,
    deleted: false,
    expiresAt: { $gt: now }
  })
  .populate('user', 'name avatar username')
  .populate('product', 'title images price')
  .sort({ createdAt: -1 });
};

// Static method to get user's own stories
storySchema.statics.getUserStories = async function(userId) {
  const now = new Date();
  
  return await this.find({
    user: userId,
    isActive: true,
    deleted: false,
    expiresAt: { $gt: now }
  })
  .populate('product', 'title images')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Story', storySchema);
