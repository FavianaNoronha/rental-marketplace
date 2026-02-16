const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/social/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    if (req.params.userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }
    
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.userId);
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isFollowing = currentUser.following.includes(req.params.userId);
    
    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.userId
      );
      currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
      
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== req.user.id
      );
      targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
      
      await currentUser.save();
      await targetUser.save();
      
      res.json({
        success: true,
        action: 'unfollowed',
        followersCount: targetUser.followersCount
      });
    } else {
      // Follow
      currentUser.following.push(req.params.userId);
      currentUser.followingCount += 1;
      
      targetUser.followers.push(req.user.id);
      targetUser.followersCount += 1;
      
      await currentUser.save();
      await targetUser.save();
      
      // TODO: Send notification to target user
      
      res.json({
        success: true,
        action: 'followed',
        followersCount: targetUser.followersCount
      });
    }
  } catch (error) {
    console.error('Follow toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling follow',
      error: error.message
    });
  }
});

// @route   GET /api/social/:userId/followers
// @desc    Get user's followers
// @access  Public
router.get('/:userId/followers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'followers',
        select: 'name avatar username bio followersCount followingCount premium.isActive',
        options: { skip, limit }
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user.followers,
      total: user.followersCount,
      pagination: {
        page,
        limit,
        hasMore: skip + user.followers.length < user.followersCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching followers',
      error: error.message
    });
  }
});

// @route   GET /api/social/:userId/following
// @desc    Get users that user is following
// @access  Public
router.get('/:userId/following', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'following',
        select: 'name avatar username bio followersCount followingCount premium.isActive',
        options: { skip, limit }
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user.following,
      total: user.followingCount,
      pagination: {
        page,
        limit,
        hasMore: skip + user.following.length < user.followingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching following',
      error: error.message
    });
  }
});

// @route   GET /api/social/profile/:userId
// @desc    Get detailed user profile
// @access  Public
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's products count
    const productsCount = await Product.countDocuments({
      seller: req.params.userId,
      status: 'active'
    });
    
    // Get recent products
    const recentProducts = await Product.find({
      seller: req.params.userId,
      status: 'active'
    })
      .select('title images price likesCount')
      .sort({ createdAt: -1 })
      .limit(6);
    
    // Check if current user is following (if logged in)
    let isFollowing = false;
    if (req.user) {
      const currentUser = await User.findById(req.user.id);
      isFollowing = currentUser.following.includes(req.params.userId);
    }
    
    res.json({
      success: true,
      data: {
        ...user,
        productsCount,
        recentProducts,
        isFollowing
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   GET /api/social/suggestions
// @desc    Get suggested users to follow
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following || [];
    
    // Find users that:
    // 1. Current user is not following
    // 2. Have active listings
    // 3. Are popular (high followers count)
    const suggestions = await User.find({
      _id: { $nin: [...followingIds, req.user.id] },
      'stats.totalListings': { $gt: 0 }
    })
      .select('name avatar username bio followersCount premium.isActive stats.totalListings')
      .sort({ followersCount: -1, 'stats.totalListings': -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
});

// @route   GET /api/social/activity
// @desc    Get user's activity feed (likes, comments, follows)
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    // Get recent likes
    const Like = require('../models/Like');
    const recentLikes = await Like.find({ user: req.user.id })
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get recent comments
    const Comment = require('../models/Comment');
    const recentComments = await Comment.find({ user: req.user.id })
      .populate('product', 'title images')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Combine and sort by date
    const activity = [
      ...recentLikes.map(like => ({
        type: 'like',
        data: like,
        createdAt: like.createdAt
      })),
      ...recentComments.map(comment => ({
        type: 'comment',
        data: comment,
        createdAt: comment.createdAt
      }))
    ].sort((a, b) => b.createdAt - a.createdAt);
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
});

// @route   POST /api/social/points
// @desc    Award points to user for actions
// @access  Private (System use)
router.post('/points', protect, async (req, res) => {
  try {
    const { action, userId } = req.body;
    
    // Point system
    const pointsMap = {
      list_product: 10,
      complete_rental: 50,
      first_rental: 100,
      get_review: 20,
      daily_login: 5,
      complete_profile: 30,
      verify_kyc: 100,
      refer_friend: 200
    };
    
    const points = pointsMap[action] || 0;
    
    if (points === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }
    
    const user = await User.findById(userId || req.user.id);
    user.points.total += points;
    
    // Level up logic (every 500 points = 1 level)
    user.points.level = Math.floor(user.points.total / 500) + 1;
    
    await user.save();
    
    res.json({
      success: true,
      pointsEarned: points,
      totalPoints: user.points.total,
      level: user.points.level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error awarding points',
      error: error.message
    });
  }
});

// @route   GET /api/social/leaderboard
// @desc    Get points leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'all'; // all, week, month
    const limit = parseInt(req.query.limit) || 50;
    
    const users = await User.find()
      .select('name avatar username points premium.isActive')
      .sort({ 'points.total': -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: users.map((user, index) => ({
        rank: index + 1,
        ...user.toObject()
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

module.exports = router;
