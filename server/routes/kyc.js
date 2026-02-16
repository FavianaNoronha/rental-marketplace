const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  submitKYC,
  getKYCStatus,
  reviewKYC
} = require('../controllers/kycController');

// All routes require authentication
router.use(protect);

router.post('/submit', submitKYC);
router.get('/status', getKYCStatus);
router.post('/review', reviewKYC); // Admin only - add admin middleware

module.exports = router;
