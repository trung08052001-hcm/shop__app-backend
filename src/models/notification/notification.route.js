const express = require('express');
const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    saveFcmToken,
} = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/fcm-token', saveFcmToken);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;