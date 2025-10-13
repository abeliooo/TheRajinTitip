const express = require('express');
const router = express.Router();
const { 
    getPendingTransactions, 
    verifyTransaction, 
    getPendingProducts, 
    reviewProduct, 
    getActiveProducts,
    deleteProduct
} = require('../controllers/adminController.js');

const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/transactions/pending').get(protect, admin, getPendingTransactions);
router.route('/transactions/:id/verify').put(protect, admin, verifyTransaction);

router.route('/products/pending').get(protect, admin, getPendingProducts);
router.route('/products/:id/review').put(protect, admin, reviewProduct);

router.route('/products/active').get(protect, admin, getActiveProducts);
router.route('/products/:id').delete(protect, admin, deleteProduct);

module.exports = router;