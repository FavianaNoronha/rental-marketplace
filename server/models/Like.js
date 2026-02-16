const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['Product', 'Comment'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  reactionType: {
    type: String,
    enum: ['like', 'love', 'interested', 'want'],
    default: 'like'
  }
}, {
  timestamps: true
});

// Compound index to ensure one like per user per target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
likeSchema.index({ targetId: 1, targetType: 1 });

// Update like count on Product when like is added
likeSchema.post('save', async function(doc) {
  if (doc.targetType === 'Product') {
    await mongoose.model('Product').findByIdAndUpdate(
      doc.targetId,
      { $inc: { likesCount: 1 } }
    );
  } else if (doc.targetType === 'Comment') {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.targetId,
      { $inc: { likesCount: 1 } }
    );
  }
});

// Update like count when like is removed
likeSchema.post('remove', async function(doc) {
  if (doc.targetType === 'Product') {
    await mongoose.model('Product').findByIdAndUpdate(
      doc.targetId,
      { $inc: { likesCount: -1 } }
    );
  } else if (doc.targetType === 'Comment') {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.targetId,
      { $inc: { likesCount: -1 } }
    );
  }
});

module.exports = mongoose.model('Like', likeSchema);
