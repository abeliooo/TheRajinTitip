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
  const { action } = req.body; 

  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    if (action === 'approve') {
      transaction.status = 'Processing'; 
    } else if (action === 'reject') {
      transaction.status = 'Canceled';
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
  const { action } = req.body; 

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

// @desc    Get all transactions with a complaint status
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Transaction.find({ status: 'Complaint' })
    .populate('product', 'name')
    .populate('buyer', 'username')
    .populate('seller', 'username');
  
  res.json(complaints);
});

// @desc    Get transaction by ID for admin review
// @route   GET /api/admin/transactions/:id
// @access  Private/Admin
const getComplaintTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('product', 'name')
    .populate('buyer', 'username email')
    .populate('seller', 'username email');
    
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Resolve a complaint
// @route   PUT /api/admin/complaints/:id/resolve
// @access  Private/Admin
const resolveComplaint = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const transaction = await Transaction.findById(req.params.id);

  if (transaction && transaction.status === 'Complaint') {
    if (action === 'approve') {
      transaction.status = 'Canceled'; 
    } else if (action === 'reject') {
      transaction.status = 'Completed';
    } else {
      res.status(400);
      throw new Error("Invalid action. Must be 'approve' or 'reject'.");
    }

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Complaint transaction not found');
  }
});

module.exports = {
  getPendingTransactions,
  verifyTransaction,
  getPendingProducts,
  reviewProduct,
  getActiveProducts,
  deleteProduct,
  getComplaints,
  getComplaintTransactionById,
  resolveComplaint,
};