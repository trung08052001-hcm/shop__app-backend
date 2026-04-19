const express = require('express');
const router = express.Router();
const { getStats } = require('./admin.controller');

router.get('/stats', getStats);

module.exports = router;
