const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'Waiting for Payment',
        'Waiting for Confirmation',
        'Processing',
        'Sending',
        'Delivered',
        'Canceled',
        'Complaint',
        'Completed',
      ],
      default: 'Waiting for Payment',
    },
    paymentProof: {
      type: String, 
    },
    trackingNumber: {
      type: String,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    complaintDetails: { 
      reason: { type: String },
      videoUrl: { type: String }, 
      filedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
