const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, placeBid } = require('../controllers/productController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/:id').get(getProductById);
router.route('/:id/bids').post(protect, placeBid);

module.exports = router;