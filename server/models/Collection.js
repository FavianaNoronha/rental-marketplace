const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  coverImage: {
    type: String // URL to cover image
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  productsCount: {
    type: Number,
    default: 0
  },
  // Privacy settings
  visibility: {
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public'
  },
  // Collaboration
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Engagement
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followersCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // Featured/Category
  category: {
    type: String,
    enum: ['fashion', 'wedding', 'party', 'casual', 'formal', 'accessories', 'seasonal', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
collectionSchema.index({ user: 1, createdAt: -1 });
collectionSchema.index({ visibility: 1, featured: 1 });
collectionSchema.index({ category: 1, visibility: 1 });
collectionSchema.index({ tags: 1 });

// Update products count
collectionSchema.pre('save', function(next) {
  if (this.isModified('products')) {
    this.productsCount = this.products.length;
  }
  next();
});

// Method to add product
collectionSchema.methods.addProduct = async function(productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    this.productsCount += 1;
    await this.save();
    return true;
  }
  return false;
};

// Method to remove product
collectionSchema.methods.removeProduct = async function(productId) {
  const index = this.products.indexOf(productId);
  if (index > -1) {
    this.products.splice(index, 1);
    this.productsCount -= 1;
    await this.save();
    return true;
  }
  return false;
};

// Method to toggle follow
collectionSchema.methods.toggleFollow = async function(userId) {
  const userIdStr = userId.toString();
  const followerIndex = this.followers.findIndex(id => id.toString() === userIdStr);

  if (followerIndex > -1) {
    // Unfollow
    this.followers.splice(followerIndex, 1);
    this.followersCount -= 1;
  } else {
    // Follow
    this.followers.push(userId);
    this.followersCount += 1;
  }

  await this.save();
  return this.followersCount;
};

// Method to increment views
collectionSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
  return this.views;
};

// Static method to get featured collections
collectionSchema.statics.getFeatured = async function(limit = 10) {
  return await this.find({
    featured: true,
    visibility: 'public',
    isActive: true
  })
  .populate('user', 'name avatar username')
  .populate('products', 'title images price')
  .sort({ followersCount: -1, createdAt: -1 })
  .limit(limit);
};

// Static method to search collections
collectionSchema.statics.searchCollections = async function(query, filters = {}) {
  const { category, userId, visibility = 'public' } = filters;
  
  const searchQuery = {
    isActive: true,
    visibility,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  };

  if (category) searchQuery.category = category;
  if (userId) searchQuery.user = userId;

  return await this.find(searchQuery)
    .populate('user', 'name avatar username')
    .populate({
      path: 'products',
      select: 'title images price',
      options: { limit: 4 }
    })
    .sort({ followersCount: -1, views: -1 })
    .limit(20);
};

module.exports = mongoose.model('Collection', collectionSchema);
