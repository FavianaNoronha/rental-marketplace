const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const { protect } = require('../middleware/auth');

// @route   POST /api/collections
// @desc    Create a new collection
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, coverImage, visibility, category, tags } = req.body;
    
    const collection = await Collection.create({
      user: req.user.id,
      name,
      description,
      coverImage,
      visibility,
      category,
      tags
    });
    
    await collection.populate('user', 'name avatar username');
    
    res.status(201).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating collection',
      error: error.message
    });
  }
});

// @route   GET /api/collections
// @desc    Get all public collections or user's collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { userId, category, featured, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = { isActive: true };
    
    if (userId) {
      filter.user = userId;
    } else {
      filter.visibility = 'public';
    }
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    
    const collections = await Collection.find(filter)
      .populate('user', 'name avatar username premium.isActive')
      .populate({
        path: 'products',
        select: 'title images price',
        options: { limit: 4 }
      })
      .sort({ featured: -1, followersCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Collection.countDocuments(filter);
    
    res.json({
      success: true,
      data: collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        hasMore: skip + collections.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collections',
      error: error.message
    });
  }
});

// @route   GET /api/collections/featured
// @desc    Get featured collections
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const collections = await Collection.getFeatured(limit);
    
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured collections',
      error: error.message
    });
  }
});

// @route   GET /api/collections/search
// @desc    Search collections
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, category, userId } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const collections = await Collection.searchCollections(q, { category, userId });
    
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching collections',
      error: error.message
    });
  }
});

// @route   GET /api/collections/:collectionId
// @desc    Get a single collection
// @access  Public
router.get('/:collectionId', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId)
      .populate('user', 'name avatar username bio premium.isActive')
      .populate({
        path: 'products',
        select: 'title description images price seller category likesCount currentRental',
        populate: {
          path: 'seller',
          select: 'name avatar username'
        }
      })
      .populate('collaborators.user', 'name avatar username');
    
    if (!collection || !collection.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    // Increment views
    await collection.incrementViews();
    
    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collection',
      error: error.message
    });
  }
});

// @route   PUT /api/collections/:collectionId
// @desc    Update a collection
// @access  Private (Owner only)
router.put('/:collectionId', protect, async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    // Check ownership or collaboration permission
    const isOwner = collection.user.toString() === req.user.id;
    const canEdit = collection.collaborators.some(
      c => c.user.toString() === req.user.id && c.canEdit
    );
    
    if (!isOwner && !canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this collection'
      });
    }
    
    const { name, description, coverImage, visibility, category, tags } = req.body;
    
    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (coverImage) collection.coverImage = coverImage;
    if (visibility) collection.visibility = visibility;
    if (category) collection.category = category;
    if (tags) collection.tags = tags;
    
    await collection.save();
    await collection.populate('user', 'name avatar username');
    
    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating collection',
      error: error.message
    });
  }
});

// @route   POST /api/collections/:collectionId/products/:productId
// @desc    Add product to collection
// @access  Private
router.post('/:collectionId/products/:productId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    const isOwner = collection.user.toString() === req.user.id;
    const canEdit = collection.collaborators.some(
      c => c.user.toString() === req.user.id && c.canEdit
    );
    
    if (!isOwner && !canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this collection'
      });
    }
    
    const added = await collection.addProduct(req.params.productId);
    
    if (!added) {
      return res.status(400).json({
        success: false,
        message: 'Product already in collection'
      });
    }
    
    res.json({
      success: true,
      message: 'Product added to collection',
      productsCount: collection.productsCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message
    });
  }
});

// @route   DELETE /api/collections/:collectionId/products/:productId
// @desc    Remove product from collection
// @access  Private
router.delete('/:collectionId/products/:productId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    const isOwner = collection.user.toString() === req.user.id;
    const canEdit = collection.collaborators.some(
      c => c.user.toString() === req.user.id && c.canEdit
    );
    
    if (!isOwner && !canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this collection'
      });
    }
    
    const removed = await collection.removeProduct(req.params.productId);
    
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in collection'
      });
    }
    
    res.json({
      success: true,
      message: 'Product removed from collection',
      productsCount: collection.productsCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing product',
      error: error.message
    });
  }
});

// @route   POST /api/collections/:collectionId/follow
// @desc    Toggle follow on a collection
// @access  Private
router.post('/:collectionId/follow', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    const followersCount = await collection.toggleFollow(req.user.id);
    const isFollowing = collection.followers.includes(req.user.id);
    
    res.json({
      success: true,
      followersCount,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling follow',
      error: error.message
    });
  }
});

// @route   DELETE /api/collections/:collectionId
// @desc    Delete a collection
// @access  Private (Owner only)
router.delete('/:collectionId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    if (collection.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this collection'
      });
    }
    
    collection.isActive = false;
    await collection.save();
    
    res.json({
      success: true,
      message: 'Collection deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting collection',
      error: error.message
    });
  }
});

module.exports = router;
