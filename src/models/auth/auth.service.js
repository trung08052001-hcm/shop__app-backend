const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const admin = require('../../config/firebase');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const register = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email đã được sử dụng');
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return { user, token };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email hoặc mật khẩu không đúng');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng');
    const token = generateToken(user._id);
    return { user, token };
};

const googleLogin = async ({ idToken }) => {
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
        user = await User.create({
            name: decoded.name || 'Google User',
            email: decoded.email,
            password: Math.random().toString(36),
            avatar: decoded.picture || null,
        });
    }
    const token = generateToken(user._id);
    return { user, token };
};

module.exports = { register, login, googleLogin };