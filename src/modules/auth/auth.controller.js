const authService = require('./auth.service');

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

module.exports = { register, login, googleLogin, getMe };
