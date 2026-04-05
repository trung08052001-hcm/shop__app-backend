const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe, getAllUsers,
    updateUserRole } = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
module.exports = router;
