const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionToPaid,
} = require('../controllers/transactionController.js');

const { protect } = require('../middleware/authMiddleware.js');

router.route('/').post(protect, createTransaction);

router.route('/my-transactions').get(protect, getMyTransactions);

router.route('/:id').get(protect, getTransactionById);

router.route('/:id/pay').put(protect, upload.single('paymentProof'), updateTransactionToPaid);

module.exports = router;
