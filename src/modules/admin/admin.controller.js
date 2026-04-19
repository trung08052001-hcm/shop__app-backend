const User = require('../../models/user.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const Recruitment = require('../../models/recruitment.model');

exports.getStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRecruitments,
            revenueData,
            recentOrders
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Recruitment.countDocuments(),
            Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),
            Order.find()
                .populate('user', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                totalRecruitments,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};
