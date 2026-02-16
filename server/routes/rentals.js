const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRental,
  confirmRental,
  verifyHandoverOTP,
  verifyReturnOTP,
  getUserRentals,
  cancelRental
} = require('../controllers/rentalController');

// All routes require authentication
router.use(protect);

router.post('/', createRental);
router.get('/my-rentals', getUserRentals);
router.put('/:id/confirm', confirmRental);
router.post('/verify-handover', verifyHandoverOTP);
router.post('/verify-return', verifyReturnOTP);
router.put('/:id/cancel', cancelRental);

module.exports = router;
