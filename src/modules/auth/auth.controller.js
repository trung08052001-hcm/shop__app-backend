const authService = require('./auth.service');
const User = require('../../models/user.model');

const register = async (req, res, next) => {
    try {
        const { name, fullName, email, password, address, phone, phoneNumber } = req.body;
        const { user, accessToken, refreshToken } = await authService.register({
            name: name ?? fullName,
            email,
            password,
            address,
            phone: phone ?? phoneNumber,
        });
        res.status(201).json({ user, token: accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login({ email, password });
        res.status(200).json({ user, token: accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const { user, accessToken, refreshToken } = await authService.googleLogin({ idToken });
        res.status(200).json({ user, token: accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshTokenService({ refreshToken });
        res.status(200).json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            query.role = role;
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            users,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { address, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { address, phone },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    getMe,
    getAllUsers,
    updateUserRole,
    updateProfile,
    refreshToken,
};
