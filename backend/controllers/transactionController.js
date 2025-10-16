const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction.js');
const Product = require('../models/Product.js');
const { get } = require('mongoose');

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
    product.transaction = createdTransaction._id;
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


// @desc    Update transaction to sending (by seller)
// @route   PUT /api/transactions/:id/ship
// @access  Private
const updateTransactionToSending = async (req, res) => {
  const { trackingNumber } = req.body;

  const transaction = await Transaction.findById(req.params.id).populate({
    path: 'product',
    populate: {
      path: 'user', 
      select: '_id', 
    },
  });

  if (transaction) {
    if (transaction.product.user._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this transaction');
    }
    
    transaction.status = 'Sending';
    transaction.trackingNumber = trackingNumber;
    transaction.shippedAt = Date.now();

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);

  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
};

// @desc    Update transaction to delivered (by buyer)
// @route   PUT /api/transactions/:id/complete
// @access  Private
const updateTransactionToDelivered = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (transaction) {
    if (transaction.buyer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to complete this transaction');
    }
    
    transaction.status = 'Delivered';
    transaction.deliveredAt = Date.now();

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
};

// @desc    Get all transactions where the user is buyer or seller
// @route   GET /api/transactions/my-conversations
// @access  Private
const getMyConversations = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ buyer: req.user._id }, { seller: req.user._id }],
  })
    .populate('product', 'name image')
    .populate('buyer', 'username')
    .populate('seller', 'username')
    .sort({ updatedAt: -1 }); 

  res.json(transactions);
});

// @desc    File a complaint for a transaction
// @route   POST /api/transactions/:id/complain
// @access  Private (Buyer only)
const fileComplaint = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (transaction.buyer.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to file a complaint for this transaction');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Complaint video proof is required.');
  }

  transaction.status = 'Complaint';
  transaction.complaintDetails = {
    reason: reason,
    videoUrl: req.file.path.replace(/\\/g, "/"),
    filedAt: Date.now(),
  };

  const updatedTransaction = await transaction.save();
  res.json(updatedTransaction);
});

module.exports = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionToPaid,
  updateTransactionToSending,
  updateTransactionToDelivered,
  getMyConversations,
  fileComplaint,
};

