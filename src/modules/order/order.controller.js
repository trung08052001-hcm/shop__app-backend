const Order = require('../../models/order.model');

const createOrder = async (req, res, next) => {
    try {
        const { items, totalPrice, shippingAddress } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice,
            shippingAddress,
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name image price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate('items.product', 'name image price');

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder, getMyOrders, getOrderById };