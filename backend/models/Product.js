const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  _id: false 
});

const productSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Nama barang harus diisi'],
  },
  image: {
    type: String,
    required: [true, 'Gambar barang harus diunggah'],
  },
  description: {
    type: String,
    required: [true, 'Deskripsi barang harus diisi'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Harga awal harus diisi'],
    default: 0,
  },
  currentPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  auctionEndDate: {
    type: Date,
    required: [true, 'Tanggal akhir lelang harus ditentukan'],
  },
  bids: [bidSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isSold: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

productSchema.pre('save', function(next) {
  if (this.isNew) {
    this.currentPrice = this.startingPrice;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

