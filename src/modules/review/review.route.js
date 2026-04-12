const express = require('express');
const {
    createReview,
    getProductReviews,
    getAllReviews,
    deleteReview,
} = require('./review.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

// Public route: Lấy danh sách đánh giá của 1 sản phẩm
router.get('/product/:productId', getProductReviews);

// Private route: Định nghĩa route cho User đăng đánh giá mới
router.post('/', protect, createReview);

// Admin routes: Quản lý đánh giá
router.get('/', protect, isAdmin, getAllReviews);
router.delete('/:id', protect, isAdmin, deleteReview);

module.exports = router;
