const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const admin = require('../../config/firebase');
const crypto = require('crypto');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createHttpError = (statusCode, message) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const register = async ({ name, email, password, address, phone }) => {
    const normalizedName = normalizeText(name);
    const normalizedEmail = normalizeText(email).toLowerCase();
    const normalizedPassword = typeof password === 'string' ? password : '';
    const normalizedAddress = normalizeText(address);
    const normalizedPhone = normalizeText(phone);

    if (!normalizedName || !normalizedEmail || !normalizedPassword || !normalizedAddress || !normalizedPhone) {
        throw createHttpError(400, 'Name, email, password, address, and phone are required');
    }

    if (normalizedPassword.length < 6) {
        throw createHttpError(400, 'Password must be at least 6 characters');
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) throw createHttpError(409, 'Email already in use');

    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
        address: normalizedAddress,
        phone: normalizedPhone,
    });
    const token = generateToken(user._id);
    return { user, token };
};

const login = async ({ email, password }) => {
    const normalizedEmail = normalizeText(email).toLowerCase();
    const normalizedPassword = typeof password === 'string' ? password : '';

    if (!normalizedEmail || !normalizedPassword) {
        throw createHttpError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw createHttpError(401, 'Invalid email or password');

    const isMatch = await user.comparePassword(normalizedPassword);
    if (!isMatch) throw createHttpError(401, 'Invalid email or password');

    const token = generateToken(user._id);
    return { user, token };
};

const googleLogin = async ({ idToken }) => {
    if (!idToken) throw createHttpError(400, 'Missing idToken');

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.email) throw createHttpError(400, 'Email not found in token');

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
