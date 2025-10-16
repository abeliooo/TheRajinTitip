const asyncHandler = require('express-async-handler');
const Message = require('../models/Message.js');

// @desc    Get all messages for a transaction
// @route   GET /api/messages/:transactionId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ transaction: req.params.transactionId })
    .populate('sender', 'username')
    .sort({ createdAt: 'asc' }); // 

  res.json(messages);
});

module.exports = { getMessages };