const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }

    // Filter by condition
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Filter by listing type
    if (req.query.listingType) {
      query.listingType = { $in: [req.query.listingType, 'both'] };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query['price.sale'] = {};
      if (req.query.minPrice) {
        query['price.sale'].$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['price.sale'].$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by location (city)
    if (req.query.city) {
      query['location.city'] = new RegExp(req.query.city, 'i');
    }

    // Only show active products
    query.status = 'active';

    // Sort
    let sort = '-createdAt';
    if (req.query.sort === 'price-low') {
      sort = 'price.sale';
    } else if (req.query.sort === 'price-high') {
      sort = '-price.sale';
    } else if (req.query.sort === 'popular') {
      sort = '-views';
    }

    const products = await Product.find(query)
      .populate('seller', 'name email avatar rating')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email avatar phone location rating');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    // Add user to req.body
    req.body.seller = req.user.id;

    // Handle images from request
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`
      }));
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`
      }));
      req.body.images = [...(product.images || []), ...newImages];
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's products
// @route   GET /api/products/user/:userId
// @access  Public
exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.userId })
      .populate('seller', 'name email avatar rating')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
