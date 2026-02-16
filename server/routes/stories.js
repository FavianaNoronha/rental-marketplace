const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/stories
// @desc    Create a new story
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, media, text, backgroundColor, product, cta, enableReplies } = req.body;
    
    const story = await Story.create({
      user: req.user.id,
      type,
      media,
      text,
      backgroundColor,
      product,
      cta,
      enableReplies
    });
    
    await story.populate('user', 'name avatar username premium.isActive');
    if (product) {
      await story.populate('product', 'title images price');
    }
    
    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating story',
      error: error.message
    });
  }
});

// @route   GET /api/stories
// @desc    Get active stories from users you follow
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followingIds = user.following || [];
    
    // Include own stories
    followingIds.push(req.user.id);
    
    const stories = await Story.getActiveStories(req.user.id, followingIds);
    
    // Group stories by user
    const groupedStories = {};
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: [],
          hasUnviewed: false
        };
      }
      
      // Check if user has viewed this story
      const hasViewed = story.views.some(v => v.user.toString() === req.user.id);
      if (!hasViewed) {
        groupedStories[userId].hasUnviewed = true;
      }
      
      groupedStories[userId].stories.push(story);
    });
    
    // Convert to array and sort (users with unviewed stories first)
    const storiesArray = Object.values(groupedStories).sort((a, b) => {
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return 0;
    });
    
    res.json({
      success: true,
      data: storiesArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
});

// @route   GET /api/stories/user/:userId
// @desc    Get stories from a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const stories = await Story.getUserStories(req.params.userId);
    
    res.json({
      success: true,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user stories',
      error: error.message
    });
  }
});

// @route   GET /api/stories/:storyId
// @desc    Get a single story
// @access  Public
router.get('/:storyId', async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('user', 'name avatar username premium.isActive')
      .populate('product', 'title images price');
    
    if (!story || story.deleted) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching story',
      error: error.message
    });
  }
});

// @route   POST /api/stories/:storyId/view
// @desc    Mark story as viewed
// @access  Private
router.post('/:storyId/view', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const viewsCount = await story.addView(req.user.id);
    
    res.json({
      success: true,
      viewsCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording view',
      error: error.message
    });
  }
});

// @route   POST /api/stories/:storyId/like
// @desc    Toggle like on a story
// @access  Private
router.post('/:storyId/like', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const likesCount = await story.toggleLike(req.user.id);
    const isLiked = story.likes.includes(req.user.id);
    
    res.json({
      success: true,
      likesCount,
      isLiked
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

// @route   POST /api/stories/:storyId/reply
// @desc    Reply to a story
// @access  Private
router.post('/:storyId/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    if (!story.enableReplies) {
      return res.status(403).json({
        success: false,
        message: 'Replies are disabled for this story'
      });
    }
    
    story.replies.push({
      user: req.user.id,
      text
    });
    
    await story.save();
    await story.populate('replies.user', 'name avatar username');
    
    res.json({
      success: true,
      data: story.replies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
});

// @route   DELETE /api/stories/:storyId
// @desc    Delete a story
// @access  Private (Own stories only)
router.delete('/:storyId', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story'
      });
    }
    
    story.deleted = true;
    story.isActive = false;
    await story.save();
    
    res.json({
      success: true,
      message: 'Story deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
});

// @route   GET /api/stories/:storyId/viewers
// @desc    Get list of users who viewed the story (own stories only)
// @access  Private
router.get('/:storyId/viewers', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('views.user', 'name avatar username');
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this information'
      });
    }
    
    res.json({
      success: true,
      data: story.views,
      total: story.viewsCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching viewers',
      error: error.message
    });
  }
});

module.exports = router;
