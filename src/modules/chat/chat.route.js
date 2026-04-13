const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

// Routes
router.get('/my-room', protect, chatController.getMyRoom);
router.get('/rooms', protect, isAdmin, chatController.getRooms);
router.get('/rooms/:roomId/messages', protect, chatController.getMessages);

module.exports = router;
