const Notification = require('../../models/notification.model');

const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

module.exports = { getNotifications };