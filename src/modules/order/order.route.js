const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require('./order.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

// Admin routes — đặt TRƯỚC protect để tránh conflict với /:id
router.get('/all', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

// User routes
router.use(protect);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;