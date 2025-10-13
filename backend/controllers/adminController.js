const Product = require('../models/Product.js');
const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction.js');

// @desc    Get all transactions awaiting confirmation
// @route   GET /api/admin/transactions/pending
// @access  Private/Admin
const getPendingTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ status: 'Waiting for Confirmation' })
    .populate('product', 'name')
    .populate('buyer', 'username email');
  
  res.json(transactions);
});

// @desc    Verify or reject a transaction payment
// @route   PUT /api/admin/transactions/:id/verify
// @access  Private/Admin
const verifyTransaction = asyncHandler(async (req, res) => {
  const { action } = req.body; // approve or reject

  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    if (action === 'approve') {
      transaction.status = 'Processing'; 
    } else if (action === 'reject') {
      transaction.status = 'Canceled';
      // Di sini Anda bisa menambahkan logika untuk mengembalikan dana atau lainnya
    } else {
      res.status(400);
      throw new Error("Invalid action. Must be 'approve' or 'reject'.");
    }

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Get all products awaiting approval
// @route   GET /api/admin/products/pending
// @access  Private/Admin
const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'pending' })
    .populate('user', 'username'); // Ambil info penjual
  
  res.json(products);
});

// @desc    Approve or reject a product
// @route   PUT /api/admin/products/:id/review
// @access  Private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { action } = req.body; // action: 'approve' atau 'reject'

  const product = await Product.findById(req.params.id);

  if (product) {
    if (action === 'approve') {
      product.status = 'approved';
    } else if (action === 'reject') {
      product.status = 'rejected';
    } else {
      res.status(400);
      throw new Error("Invalid action.");
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all active (approved and not sold) products
// @route   GET /api/admin/products/active
// @access  Private/Admin
const getActiveProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'approved', isSold: false })
    .populate('user', 'username') 
    .sort({ createdAt: -1 });

  res.json(products);
});

// @desc    Delete a product by ID
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getPendingTransactions,
  verifyTransaction,
  getPendingProducts,
  reviewProduct,
  getActiveProducts,
  deleteProduct
};