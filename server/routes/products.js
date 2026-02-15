const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/user/:userId', getUserProducts);

// Protected routes
router.post('/', protect, upload.array('images', 10), createProduct);
router.put('/:id', protect, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
