const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Gửi FCM push notification
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
    if (!fcmToken) return;
    try {
        const admin = require('../config/firebase');
        await admin.messaging().send({
            token: fcmToken,
            notification: { title, body },
            data,
            android: {
                notification: {
                    sound: 'default',
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                },
            },
            apns: {
                payload: {
                    aps: { sound: 'default' },
                },
            },
        });
        console.log('Push notification sent to:', fcmToken);
    } catch (err) {
        console.error('FCM error:', err.message);
    }
};

// Tạo notification trong DB + gửi push
const createNotification = async ({
    userId,
    title,
    body,
    type = 'order_placed',
    orderId = null,
}) => {
    try {
        // Lấy FCM token của user
        const user = await User.findById(userId).select('fcmToken');

        // Lưu vào DB
        const notification = await Notification.create({
            user: userId,
            title,
            body,
            type,
            orderId,
            fcmToken: user?.fcmToken || null,
        });

        // Gửi push nếu có token
        if (user?.fcmToken) {
            await sendPushNotification(
                user.fcmToken,
                title,
                body,
                {
                    type,
                    orderId: orderId?.toString() || '',
                    notificationId: notification._id.toString(),
                }
            );
        }

        return notification;
    } catch (err) {
        console.error('Create notification error:', err);
    }
};

module.exports = { createNotification, sendPushNotification };