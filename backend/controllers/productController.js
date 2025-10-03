const Product = require('../models/Product.js');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all unsold products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isSold: false })
    .populate('user', 'username') 
    .sort({ createdAt: -1 }); 

  res.json(products);
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'user',
    'username'
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Produk tidak ditemukan');
  }
});


// @desc    Create a new product
// @route   POST /api/products
// @access  Private (memerlukan login)
const createProduct = asyncHandler(async (req, res) => {
  const { name, image, description, startingPrice, auctionEndDate } = req.body;

  const product = new Product({
    name,
    image: image || '/images/sample.jpg', 
    user: req.user._id, 
    description,
    startingPrice,
    currentPrice: startingPrice, 
    auctionEndDate,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const placeBid = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    if (new Date() > product.auctionEndDate) {
        res.status(400);
        throw new Error('Lelang untuk produk ini sudah berakhir.');
    }
    
    if (amount <= product.currentPrice) {
      res.status(400);
      throw new Error('Tawaran harus lebih tinggi dari harga saat ini.');
    }

    const bid = {
      user: req.user._id,
      amount: Number(amount),
    };

    product.bids.push(bid);
    product.currentPrice = amount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Produk tidak ditemukan');
  }
});

module.exports = { getProducts, getProductById, createProduct, placeBid };

