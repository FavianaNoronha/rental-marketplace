const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/likes/:targetType/:targetId
// @desc    Toggle like on a product or comment
// @access  Private
router.post('/:targetType/:targetId', protect, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const { reactionType } = req.body; // like, love, interested, want
    
    // Validate target type
    if (!['Product', 'Comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      });
    }
    
    // Check if like already exists
    const existingLike = await Like.findOne({
      user: req.user.id,
      targetType,
      targetId
    });
    
    if (existingLike) {
      // Unlike - remove the like
      await existingLike.remove();
      
      res.json({
        success: true,
        action: 'unliked',
        message: 'Like removed'
      });
    } else {
      // Create new like
      const like = await Like.create({
        user: req.user.id,
        targetType,
        targetId,
        reactionType: reactionType || 'like'
      });
      
      res.status(201).json({
        success: true,
        action: 'liked',
        data: like
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Already liked'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

// @route   GET /api/likes/:targetType/:targetId
// @desc    Get all likes for a product/comment
// @access  Public
router.get('/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const likes = await Like.find({
      targetType,
      targetId
    })
      .populate('user', 'name avatar username premium.isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Like.countDocuments({ targetType, targetId });
    
    // Group by reaction type
    const reactions = await Like.aggregate([
      { $match: { targetType, targetId: require('mongoose').Types.ObjectId(targetId) } },
      { $group: { _id: '$reactionType', count: { $sum: 1 } } }
    ]);
    
    const reactionCounts = {};
    reactions.forEach(r => {
      reactionCounts[r._id] = r.count;
    });
    
    res.json({
      success: true,
      data: likes,
      total,
      reactionCounts,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + likes.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching likes',
      error: error.message
    });
  }
});

// @route   GET /api/likes/user/liked
// @desc    Check if current user liked items
// @access  Private
router.get('/user/liked', protect, async (req, res) => {
  try {
    const { targetIds, targetType } = req.query;
    
    if (!targetIds || !targetType) {
      return res.status(400).json({
        success: false,
        message: 'targetIds and targetType are required'
      });
    }
    
    const idsArray = targetIds.split(',');
    
    const likes = await Like.find({
      user: req.user.id,
      targetType,
      targetId: { $in: idsArray }
    }).select('targetId reactionType');
    
    // Create map for quick lookup
    const likedMap = {};
    likes.forEach(like => {
      likedMap[like.targetId.toString()] = {
        liked: true,
        reactionType: like.reactionType
      };
    });
    
    res.json({
      success: true,
      data: likedMap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking likes',
      error: error.message
    });
  }
});

// @route   GET /api/likes/user/my-likes
// @desc    Get all products/items user has liked
// @access  Private
router.get('/user/my-likes', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const targetType = req.query.targetType || 'Product';
    
    const likes = await Like.find({
      user: req.user.id,
      targetType
    })
      .populate({
        path: 'targetId',
        select: 'title description images price seller category currentRental',
        populate: {
          path: 'seller',
          select: 'name avatar username'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Like.countDocuments({
      user: req.user.id,
      targetType
    });
    
    res.json({
      success: true,
      data: likes,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + likes.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching liked items',
      error: error.message
    });
  }
});

// @route   PUT /api/likes/:likeId
// @desc    Change reaction type
// @access  Private
router.put('/:likeId', protect, async (req, res) => {
  try {
    const { reactionType } = req.body;
    
    const like = await Like.findOne({
      _id: req.params.likeId,
      user: req.user.id
    });
    
    if (!like) {
      return res.status(404).json({
        success: false,
        message: 'Like not found'
      });
    }
    
    like.reactionType = reactionType;
    await like.save();
    
    res.json({
      success: true,
      data: like
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reaction',
      error: error.message
    });
  }
});

module.exports = router;
