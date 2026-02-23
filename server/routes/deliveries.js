const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDelivery,
  getDeliveriesForRental,
  updateDeliveryStatus,
  checkHyperlocalAvailability,
  scheduleConciergePickup,
  uploadProofOfDelivery,
  getTracking
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/check-hyperlocal', checkHyperlocalAvailability);
router.get('/:id/tracking', getTracking);

// Protected routes
router.use(protect);
router.post('/', createDelivery);
router.get('/:id', getDelivery);
router.get('/rental/:rentalId', getDeliveriesForRental);
router.put('/:id/status', updateDeliveryStatus);
router.post('/:id/concierge-pickup', scheduleConciergePickup);
router.post('/:id/proof', uploadProofOfDelivery);

module.exports = router;
