const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ['promotion', 'event', 'sale', 'new_product'],
            default: 'promotion',
        },
        discount: { type: Number, default: null }, // % giảm giá nếu có
        imageUrl: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        startAt: { type: Date, default: Date.now },
        endAt: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);