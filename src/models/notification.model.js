const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ['order_placed', 'order_updated', 'promotion', 'recruitment_updated'],
            default: 'order_placed',
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },
        isRead: { type: Boolean, default: false },
        fcmToken: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);