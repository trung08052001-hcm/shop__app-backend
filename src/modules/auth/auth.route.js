const express = require('express');
const {
    register,
    login,
    getMe,
    googleLogin,
    getAllUsers,
    updateUserRole,
} = require('./auth.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;
