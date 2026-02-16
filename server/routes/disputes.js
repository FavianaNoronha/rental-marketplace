const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  raiseDispute,
  getUserDisputes,
  addDisputeComment,
  resolveDispute
} = require('../controllers/disputeController');

// All routes require authentication
router.use(protect);

router.post('/', raiseDispute);
router.get('/my-disputes', getUserDisputes);
router.post('/comment', addDisputeComment);
router.post('/resolve', resolveDispute); // Admin only - add admin middleware

module.exports = router;
