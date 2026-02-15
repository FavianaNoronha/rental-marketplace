const express = require('express');
const {
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);

// Protected routes
router.get('/favorites/me', protect, getFavorites);
router.post('/favorites/:productId', protect, addToFavorites);
router.delete('/favorites/:productId', protect, removeFromFavorites);

module.exports = router;
