const express = require('express');
const router = express.Router();
const {
  getAllBundles,
  getBundle,
  createBundle,
  updateBundle,
  deleteBundle,
  checkAvailability,
  getFeaturedDestinations,
  getBundlesByDestination
} = require('../controllers/bundleController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllBundles);
router.get('/featured/destinations', getFeaturedDestinations);
router.get('/destination/:city', getBundlesByDestination);
router.get('/:id', getBundle);
router.post('/:id/check-availability', checkAvailability);

// Protected routes
router.use(protect);
router.post('/', createBundle);
router.put('/:id', updateBundle);
router.delete('/:id', deleteBundle);

module.exports = router;
