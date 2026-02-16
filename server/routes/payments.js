const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  processRentalPayment,
  refundSecurityDeposit,
  processAdditionalCharge,
  getUserTransactions,
  getWalletBalance
} = require('../controllers/paymentController');

// All routes require authentication
router.use(protect);

router.post('/rental-payment', processRentalPayment);
router.post('/refund-deposit', refundSecurityDeposit);
router.post('/additional-charge', processAdditionalCharge);
router.get('/transactions', getUserTransactions);
router.get('/wallet-balance', getWalletBalance);

module.exports = router;
