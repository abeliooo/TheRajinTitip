const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/:transactionId').get(protect, getMessages);

module.exports = router;