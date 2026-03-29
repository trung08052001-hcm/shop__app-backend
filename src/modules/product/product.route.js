const express = require('express');
const {
    getProducts,
    getProductById,
    getCategories,
} = require('./product.controller');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;