const express = require('express');
const { getNotifications } = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();
router.get('/', protect, getNotifications);

module.exports = router;