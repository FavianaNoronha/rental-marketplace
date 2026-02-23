const express = require('express');
const router = express.Router();
const {
  getPlans,
  createSubscription,
  getMySubscription,
  cancelSubscription,
  useRentalQuota
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.use(protect);
router.post('/', createSubscription);
router.get('/me', getMySubscription);
router.put('/cancel', cancelSubscription);
router.post('/use-rental', useRentalQuota);

module.exports = router;
