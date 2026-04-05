const Order = require('../../models/order.model');

const { createNotification } = require('../../services/notification.service');

const createOrder = async (req, res, next) => {
    try {
        const { items, totalPrice, shippingAddress } = req.body;
        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice,
            shippingAddress,
        });

        // Tạo notification sau khi tạo order
        await createNotification({
            userId: req.user._id,
            title: 'Đặt hàng thành công!',
            body: `Đơn hàng #${order._id.toString().slice(-6).toUpperCase()} đã được xác nhận. Tổng tiền: ${totalPrice.toLocaleString('vi-VN')}đ`,
            type: 'order_placed',
            orderId: order._id,
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
const getAllOrders = async (req, res, next) => {
    console.log('getAllOrders called, user:', req.user?._id, 'role:', req.user?.role);
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        console.log('orders found:', orders.length);

        const result = orders.map((order) => ({
            _id: order._id,
            user: order.user,
            items: order.items.map((item) => ({
                _id: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                productId: item.product,
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress,
        }));

        res.json(result);
    } catch (err) {
        console.error('GET ALL ORDERS ERROR:', err.message, err.stack);
        next(err);
    }
};


const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', '_id fcmToken');

        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const statusMessages = {
            processing: 'Đơn hàng đang được xử lý',
            shipped: 'Đơn hàng đang được giao đến bạn',
            delivered: 'Đơn hàng đã được giao thành công',
            cancelled: 'Đơn hàng đã bị huỷ',
        };

        if (statusMessages[status]) {
            await createNotification({
                userId: order.user._id,
                title: statusMessages[status],
                body: `Đơn hàng #${order._id.toString().slice(-6).toUpperCase()}`,
                type: 'order_updated',
                orderId: order._id,
            });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOrder, getMyOrders, getOrderById, getAllOrders,
    updateOrderStatus,
};