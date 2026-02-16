const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages
} = require('../controllers/chatController');

// All routes require authentication
router.use(protect);

router.post('/', createChat);
router.get('/', getUserChats);
router.post('/message', sendMessage);
router.get('/:chatId/messages', getChatMessages);

module.exports = router;
