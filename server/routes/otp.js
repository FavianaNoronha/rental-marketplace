const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendOTP,
  verifyOTP,
  resendOTP
} = require('../controllers/otpController');

// All routes require authentication
router.use(protect);

router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);

module.exports = router;
