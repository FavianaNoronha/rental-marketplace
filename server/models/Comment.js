const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // null for top-level comments, ID for replies
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
commentSchema.index({ product: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ user: 1 });

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

// Update repliesCount when a reply is added
commentSchema.post('save', async function(doc) {
  if (doc.parentComment) {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.parentComment,
      { $inc: { repliesCount: 1 } }
    );
  }
});

// Update repliesCount when a reply is deleted
commentSchema.post('remove', async function(doc) {
  if (doc.parentComment) {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.parentComment,
      { $inc: { repliesCount: -1 } }
    );
  }
});

module.exports = mongoose.model('Comment', commentSchema);
