const express = require('express');
const {
    register,
    login,
    getMe,
    googleLogin,
    getAllUsers,
    updateUserRole,
    updateProfile,
} = require('./auth.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;
