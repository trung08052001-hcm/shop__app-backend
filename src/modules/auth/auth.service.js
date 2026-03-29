const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const admin = require('../../config/firebase');
const crypto = require('crypto');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const register = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email already in use');

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return { user, token };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = generateToken(user._id);
    return { user, token };
};

const googleLogin = async ({ idToken }) => {
    if (!idToken) throw new Error('Missing idToken');

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.email) throw new Error('Email not found in token');

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
        user = await User.create({
            name: decoded.name || decoded.email.split('@')[0] || 'Google User',
            email: decoded.email,
            password: crypto.randomBytes(16).toString('hex'),
            avatar: decoded.picture || null,
        });
    }

    const token = generateToken(user._id);
    return { user, token };
};

module.exports = { register, login, googleLogin };
