const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Create or get existing chat
exports.createChat = async (req, res) => {
  try {
    const { participantId, productId } = req.body;
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      product: productId
    });

    if (chat) {
      return res.status(200).json({
        success: true,
        data: chat
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, participantId],
      product: productId,
      unreadCount: new Map([
        [req.user._id.toString(), 0],
        [participantId, 0]
      ])
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// Get user's chats
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'name profilePicture')
    .populate('product', 'title images')
    .populate('lastMessage')
    .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content, type, attachments } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
      type: type || 'text',
      attachments: attachments || []
    });

    // Update chat's last message
    await chat.updateLastMessage(message._id);

    // Increment unread count for other participant
    const otherParticipant = chat.participants.find(p => p.toString() !== req.user._id.toString());
    const currentUnread = chat.unreadCount.get(otherParticipant.toString()) || 0;
    chat.unreadCount.set(otherParticipant.toString(), currentUnread + 1);
    await chat.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get chat messages
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name profilePicture')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        read: false
      },
      { read: true }
    );

    // Reset unread count
    chat.unreadCount.set(req.user._id.toString(), 0);
    await chat.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};
