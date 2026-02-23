const Bundle = require('../models/Bundle');
const Product = require('../models/Product');

/**
 * @desc    Get all bundles
 * @route   GET /api/bundles
 * @access  Public
 */
exports.getAllBundles = async (req, res) => {
  try {
    const {
      type,
      destination,
      occasion,
      featured,
      city,
      limit = 20,
      page = 1
    } = req.query;
    
    const query = { status: 'active' };
    
    if (type) query.type = type;
    if (destination) query['destination.city'] = new RegExp(destination, 'i');
    if (occasion) query.occasion = occasion;
    if (featured) query.featured = featured === 'true';
    if (city) query['delivery.cities'] = city;
    
    const bundles = await Bundle.find(query)
      .populate('products.product', 'title images price category')
      .populate('createdBy', 'name username avatar')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Bundle.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: bundles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bundles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bundles',
      error: error.message
    });
  }
};

/**
 * @desc    Get single bundle
 * @route   GET /api/bundles/:id
 * @access  Public
 */
exports.getBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate('products.product')
      .populate('createdBy', 'name username avatar rating');
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    // Increment views
    bundle.views += 1;
    await bundle.save();
    
    // Calculate savings
    const savings = bundle.calculateSavings();
    
    res.status(200).json({
      success: true,
      data: {
        ...bundle.toObject(),
        savings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bundle',
      error: error.message
    });
  }
};

/**
 * @desc    Create new bundle
 * @route   POST /api/bundles
 * @access  Private (Admin/Curator)
 */
exports.createBundle = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      destination,
      occasion,
      products,
      pricing,
      curator,
      images,
      tags,
      delivery
    } = req.body;
    
    // Validate products exist
    const productIds = products.map(p => p.product);
    const validProducts = await Product.find({ _id: { $in: productIds } });
    
    if (validProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some products in bundle do not exist'
      });
    }
    
    // Create bundle
    const bundle = await Bundle.create({
      name,
      description,
      type,
      destination,
      occasion,
      products,
      pricing,
      createdBy: req.user.id,
      curator,
      images,
      tags,
      delivery
    });
    
    res.status(201).json({
      success: true,
      data: bundle,
      message: 'Bundle created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating bundle',
      error: error.message
    });
  }
};

/**
 * @desc    Update bundle
 * @route   PUT /api/bundles/:id
 * @access  Private (Admin/Creator)
 */
exports.updateBundle = async (req, res) => {
  try {
    let bundle = await Bundle.findById(req.params.id);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    // Check ownership
    if (bundle.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bundle'
      });
    }
    
    bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: bundle,
      message: 'Bundle updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bundle',
      error: error.message
    });
  }
};

/**
 * @desc    Delete bundle
 * @route   DELETE /api/bundles/:id
 * @access  Private (Admin/Creator)
 */
exports.deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    // Check ownership
    if (bundle.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bundle'
      });
    }
    
    await bundle.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Bundle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bundle',
      error: error.message
    });
  }
};

/**
 * @desc    Check bundle availability for dates
 * @route   POST /api/bundles/:id/check-availability
 * @access  Public
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    const bundle = await Bundle.findById(req.params.id);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    const isAvailable = bundle.isAvailableForDates(
      new Date(startDate),
      new Date(endDate)
    );
    
    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        startDate,
        endDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

/**
 * @desc    Get featured destination bundles
 * @route   GET /api/bundles/featured/destinations
 * @access  Public
 */
exports.getFeaturedDestinations = async (req, res) => {
  try {
    const bundles = await Bundle.find({
      type: 'destination',
      featured: true,
      status: 'active'
    })
      .populate('products.product', 'title images price')
      .limit(6)
      .sort({ bookings: -1 });
    
    res.status(200).json({
      success: true,
      data: bundles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured destinations',
      error: error.message
    });
  }
};

/**
 * @desc    Get bundles for a specific destination
 * @route   GET /api/bundles/destination/:city
 * @access  Public
 */
exports.getBundlesByDestination = async (req, res) => {
  try {
    const { city } = req.params;
    const { occasion, duration } = req.query;
    
    const query = {
      type: 'destination',
      'destination.city': new RegExp(city, 'i'),
      status: 'active'
    };
    
    if (occasion) query.occasion = occasion;
    if (duration) query['destination.duration'] = parseInt(duration);
    
    const bundles = await Bundle.find(query)
      .populate('products.product', 'title images price category')
      .populate('createdBy', 'name username avatar')
      .sort({ featured: -1, bookings: -1 });
    
    res.status(200).json({
      success: true,
      count: bundles.length,
      data: bundles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching destination bundles',
      error: error.message
    });
  }
};

module.exports = exports;
