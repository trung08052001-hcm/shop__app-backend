const express = require('express');
const {
    register,
    login,
    getMe,
    googleLogin,
    getAllUsers,
    updateUserRole,
    updateProfile,
    refreshToken
} = require('./auth.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const authValidation = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);
router.post('/google', validate(authValidation.googleLogin), googleLogin);
router.post('/refresh', validate(authValidation.refreshToken), refreshToken);
router.get('/me', protect, getMe);
router.put('/me', protect, validate(authValidation.updateProfile), updateProfile);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, validate(authValidation.updateUserRole), updateUserRole);

module.exports = router;
