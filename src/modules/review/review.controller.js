const Review = require('../../models/review.model');
const Product = require('../../models/product.model');

// @desc    Tạo mới một review cho sản phẩm
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        // Kiểm tra xem sản phẩm có tồn tại không
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Tạo review
        const review = await Review.create({
            user: req.user._id,
            product,
            rating: Number(rating),
            comment,
        });

        res.status(201).json({
            message: 'Đã thêm đánh giá thành công',
            review,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả các đánh giá của một sản phẩm
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar') // Lấy tên và avatar người dùng
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả các đánh giá (Dành cho Admin quản lý)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('product', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Admin xoá một đánh giá vi phạm
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.status(200).json({ message: 'Đã xoá đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getAllReviews,
    deleteReview,
};
