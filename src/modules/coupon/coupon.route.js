const express = require('express');
const {
    validateCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('./coupon.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

// User
router.post('/validate', protect, validateCoupon);

// Admin
router.get('/', protect, isAdmin, getAllCoupons);
router.post('/', protect, isAdmin, createCoupon);
router.put('/:id', protect, isAdmin, updateCoupon);
router.delete('/:id', protect, isAdmin, deleteCoupon);

module.exports = router;