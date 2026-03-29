const express = require('express');
const router = express.Router();
const { register, login } = require('./auth.controller');

router.post('/register', (req, res, next) => {
    console.log('HIT REGISTER ROUTE', req.body); // thêm dòng này
    register(req, res, next);
});

router.post('/login', login);

module.exports = router;