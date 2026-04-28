const authService = require('./auth.service');
const User = require('../../models/user.model');

const register = async (req, res, next) => {
    try {
        const { name, fullName, email, password, address, phone, phoneNumber } = req.body;
        const { user, token } = await authService.register({
            name: name ?? fullName,
            email,
            password,
            address,
            phone: phone ?? phoneNumber,
        });
        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login({ email, password });
        res.status(200).json({ user, token });
    } catch (err) {
        next(err);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const { user, token } = await authService.googleLogin({ idToken });
        res.status(200).json({ user, token });
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
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
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
};
