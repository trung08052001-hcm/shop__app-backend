const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

// Tự động tính toán lại rating trung bình cho Product
reviewSchema.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                numReviews: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                numReviews: stats[0].numReviews,
                rating: Math.round(stats[0].avgRating * 10) / 10, // Làm tròn 1 chữ số thập phân
            });
        } else {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                numReviews: 0,
                rating: 0,
            });
        }
    } catch (err) {
        console.error('Error calculating average ratings:', err);
    }
};

// Gọi calcAverageRatings sau khi tạo mới (save)
reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

// Gọi calcAverageRatings sau khi xoá (findOneAndDelete)
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatings(doc.product);
    }
});

// Đảm bảo mỗi user chỉ có thể để lại 1 review cho 1 sản phẩm
// Bạn có thể bật index này nếu muốn:
// reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
