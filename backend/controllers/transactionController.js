const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction.js');
const Product = require('../models/Product.js');

// @desc    Create a new transaction after an auction is won
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId).populate('bids.user');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.isSold) {
    res.status(400);
    throw new Error('This product has already been sold.');
  }

  if (!product.bids || product.bids.length === 0) {
    res.status(400);
    throw new Error('Cannot create a transaction for an item with no bids.');
  }

  const winner = product.bids[product.bids.length - 1];

  if (winner.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not the winner of this auction.');
  }

  const transaction = new Transaction({
    product: productId,
    buyer: winner.user._id,
    seller: product.user,
    amount: winner.amount,
  });

  const createdTransaction = await transaction.save();

  product.isSold = true;
  await product.save();

  res.status(201).json(createdTransaction);
});

// @desc    Get logged in user's transactions
// @route   GET /api/transactions/my-transactions
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ buyer: req.user._id })
    .populate('product', 'name image')
    .sort({ createdAt: -1 });
  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('product', 'name image description')
    .populate('seller', 'username')
    .populate('buyer', 'username');

  if (transaction) {
    if (transaction.buyer._id.toString() !== req.user._id.toString() && transaction.seller._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this transaction');
    }
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Update transaction to paid
// @route   PUT /api/transactions/:id/pay
// @access  Private
const updateTransactionToPaid = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!req.file) {
    res.status(400);
    throw new Error('Payment proof file is required.');
  }

  if (transaction) {
    if (transaction.buyer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to pay for this transaction');
    }

    transaction.status = 'Waiting for Confirmation';
    transaction.paymentProof = req.file.path.replace(/\\/g, "/");

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

module.exports = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionToPaid,
};

