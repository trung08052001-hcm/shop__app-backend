const authService = require('./auth.service');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, token } = await authService.register({ name, email, password });
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('REGISTER ERROR:', err); // thêm dòng này
        next(err);  // truyền err vào next
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

module.exports = { register, login };