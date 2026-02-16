const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const RentalCalendar = require('../models/RentalCalendar');
const { protect } = require('../middleware/auth');

// @route   GET /api/feed
// @desc    Get infinite scroll feed of products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { category, subcategory, listingType, minPrice, maxPrice, city, sort } = req.query;
    
    // Build filter
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (listingType) filter.listingType = listingType;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    
    // Price filtering
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      
      if (listingType === 'rent') {
        filter['price.rent.perDay'] = priceFilter;
      } else {
        filter['price.sale'] = priceFilter;
      }
    }
    
    // Sorting options
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likesCount: -1, views: -1, createdAt: -1 };
        break;
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'price_low':
        sortOption = listingType === 'rent' 
          ? { 'price.rent.perDay': 1 } 
          : { 'price.sale': 1 };
        break;
      case 'price_high':
        sortOption = listingType === 'rent' 
          ? { 'price.rent.perDay': -1 } 
          : { 'price.sale': -1 };
        break;
      case 'trending':
        // Trending = high engagement in last 24 hours
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        filter.createdAt = { $gte: yesterday };
        sortOption = { likesCount: -1, commentsCount: -1, views: -1 };
        break;
      default:
        // Instagram-style algorithm: mix of recency, engagement, and randomness
        sortOption = { 
          boosted: -1,
          likesCount: -1, 
          commentsCount: -1, 
          createdAt: -1 
        };
    }
    
    const products = await Product.find(filter)
      .populate('seller', 'name avatar username rating followersCount premium.isActive')
      .populate('currentRental.rentedTo', 'name username')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get rental status for each product
    for (let product of products) {
      if (product.listingType === 'rent' || product.listingType === 'both') {
        const rentalStatus = await RentalCalendar.getCurrentStatus(product._id);
        product.rentalStatus = rentalStatus;
      }
    }
    
    const total = await Product.countDocuments(filter);
    const hasMore = skip + products.length < total;
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        hasMore,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message
    });
  }
});

// @route   GET /api/feed/following
// @desc    Get feed from users you follow (personalized feed)
// @access  Private
router.get('/following', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const user = await require('../models/User').findById(req.user.id);
    
    if (!user.following || user.following.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'Start following users to see personalized feed'
      });
    }
    
    const products = await Product.find({
      seller: { $in: user.following },
      status: 'active'
    })
      .populate('seller', 'name avatar username rating followersCount premium.isActive')
      .populate('currentRental.rentedTo', 'name username')
      .sort({ createdAt: -1, likesCount: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get rental status for each product
    for (let product of products) {
      if (product.listingType === 'rent' || product.listingType === 'both') {
        const rentalStatus = await RentalCalendar.getCurrentStatus(product._id);
        product.rentalStatus = rentalStatus;
      }
    }
    
    const total = await Product.countDocuments({
      seller: { $in: user.following },
      status: 'active'
    });
    
    const hasMore = skip + products.length < total;
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    });
  } catch (error) {
    console.error('Following feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching following feed',
      error: error.message
    });
  }
});

// @route   GET /api/feed/trending
// @desc    Get trending products (high engagement)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || '24h'; // 24h, 7d, 30d
    
    let timeFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case '24h':
        timeFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        timeFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        timeFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
    }
    
    const products = await Product.find({
      ...timeFilter,
      status: 'active',
      $expr: { 
        $gte: [
          { $add: ['$likesCount', { $multiply: ['$commentsCount', 2] }, '$views'] },
          10 // Minimum engagement score
        ]
      }
    })
      .populate('seller', 'name avatar username rating premium.isActive')
      .sort({ 
        likesCount: -1, 
        commentsCount: -1, 
        views: -1 
      })
      .limit(limit)
      .lean();
    
    res.json({
      success: true,
      data: products,
      timeframe
    });
  } catch (error) {
    console.error('Trending feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending products',
      error: error.message
    });
  }
});

// @route   POST /api/feed/:productId/view
// @desc    Increment product view count
// @access  Public
router.post('/:productId/view', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      views: product.views
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording view',
      error: error.message
    });
  }
});

module.exports = router;
