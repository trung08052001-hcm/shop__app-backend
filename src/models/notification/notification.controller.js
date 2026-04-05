const Notification = require('../../models/notification.model');
const User = require('../../models/user.model');

// Lấy danh sách notifications của user
const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

// Đếm số thông báo chưa đọc
const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            user: req.user._id,
            isRead: false,
        });
        res.json({ count });
    } catch (err) {
        next(err);
    }
};

// Đánh dấu 1 thông báo đã đọc
const markAsRead = async (req, res, next) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true }
        );
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

// Lưu FCM token khi user login/mở app
const saveFcmToken = async (req, res, next) => {
    try {
        const { fcmToken } = req.body;
        await User.findByIdAndUpdate(req.user._id, { fcmToken });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    saveFcmToken,
};