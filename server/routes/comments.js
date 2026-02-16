const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/comments/:productId
// @desc    Add a comment to a product
// @access  Private
router.post('/:productId', protect, async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    
    // Validate product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Create comment
    const comment = await Comment.create({
      product: req.params.productId,
      user: req.user.id,
      text,
      parentComment: parentComment || null
    });
    
    // Increment comment count on product
    await Product.findByIdAndUpdate(
      req.params.productId,
      { $inc: { commentsCount: 1 } }
    );
    
    // Populate user data
    await comment.populate('user', 'name avatar username premium.isActive');
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
});

// @route   GET /api/comments/:productId
// @desc    Get comments for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'recent'; // recent, popular, oldest
    
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likesCount: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Get top-level comments (no parent)
    const comments = await Comment.find({
      product: req.params.productId,
      parentComment: null,
      deleted: false
    })
      .populate('user', 'name avatar username premium.isActive')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get replies for each comment (limited to 3, show "View more" for rest)
    for (let comment of comments) {
      const replies = await Comment.find({
        parentComment: comment._id,
        deleted: false
      })
        .populate('user', 'name avatar username')
        .sort({ createdAt: 1 })
        .limit(3)
        .lean();
      
      comment.replies = replies;
      comment.hasMoreReplies = comment.repliesCount > 3;
    }
    
    const total = await Comment.countDocuments({
      product: req.params.productId,
      parentComment: null,
      deleted: false
    });
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + comments.length < total
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
});

// @route   GET /api/comments/:commentId/replies
// @desc    Get all replies for a comment
// @access  Public
router.get('/:commentId/replies', async (req, res) => {
  try {
    const replies = await Comment.find({
      parentComment: req.params.commentId,
      deleted: false
    })
      .populate('user', 'name avatar username premium.isActive')
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: replies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching replies',
      error: error.message
    });
  }
});

// @route   PUT /api/comments/:commentId
// @desc    Edit a comment
// @access  Private (Own comments only)
router.put('/:commentId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this comment'
      });
    }
    
    comment.text = text;
    comment.edited = true;
    comment.editedAt = new Date();
    await comment.save();
    
    await comment.populate('user', 'name avatar username');
    
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
});

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment (soft delete)
// @access  Private (Own comments or admin)
router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check ownership or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    // Soft delete
    comment.deleted = true;
    comment.text = '[This comment has been deleted]';
    await comment.save();
    
    // Decrement comment count
    await Product.findByIdAndUpdate(
      comment.product,
      { $inc: { commentsCount: -1 } }
    );
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
});

// @route   POST /api/comments/:commentId/like
// @desc    Toggle like on a comment
// @access  Private
router.post('/:commentId/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const userIdStr = req.user.id.toString();
    const likeIndex = comment.likes.findIndex(id => id.toString() === userIdStr);
    
    let action;
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
      comment.likesCount -= 1;
      action = 'unliked';
    } else {
      // Like
      comment.likes.push(req.user.id);
      comment.likesCount += 1;
      action = 'liked';
    }
    
    await comment.save();
    
    res.json({
      success: true,
      action,
      likesCount: comment.likesCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

module.exports = router;
