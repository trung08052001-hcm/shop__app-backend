const Coupon = require('../../models/coupon.model');

// User — kiểm tra mã giảm giá
const validateCoupon = async (req, res, next) => {
    try {
        const { code, orderTotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Mã giảm giá đã bị vô hiệu' });
        }
        if (new Date() > coupon.expiresAt) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết lượt dùng' });
        }
        if (orderTotal < coupon.minOrderValue) {
            return res.status(400).json({
                message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ`,
            });
        }

        // Tính số tiền giảm
        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
            discountAmount = (orderTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        discountAmount = Math.min(discountAmount, orderTotal);

        res.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscount: coupon.maxDiscount,
            },
            discountAmount,
            finalTotal: orderTotal - discountAmount,
        });
    } catch (err) {
        next(err);
    }
};

// Admin — lấy tất cả coupons
const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        next(err);
    }
};

// Admin — tạo coupon mới
const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        next(err);
    }
};

// Admin — cập nhật coupon
const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!coupon) return res.status(404).json({ message: 'Không tìm thấy coupon' });
        res.json(coupon);
    } catch (err) {
        next(err);
    }
};

// Admin — xoá coupon
const deleteCoupon = async (req, res, next) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xoá coupon' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    validateCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};