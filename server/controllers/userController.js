const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's active listings count
    const listingsCount = await Product.countDocuments({
      seller: req.params.id,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        listingsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add product to favorites
// @route   POST /api/users/favorites/:productId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if already in favorites
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/users/favorites/:productId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      populate: {
        path: 'seller',
        select: 'name email avatar'
      }
    });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
