const express = require('express');
const router = express.Router();
const { getProducts, 
    getProductById, 
    createProduct, 
    placeBid,
    getMyProducts
} = require('../controllers/productController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/my-products').get(protect, getMyProducts);
router.route('/:id').get(getProductById);
router.route('/:id/bids').post(protect, placeBid);

module.exports = router;