const express = require('express');
const { createOrder, getMyOrders, getOrderById } = require('./order.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
