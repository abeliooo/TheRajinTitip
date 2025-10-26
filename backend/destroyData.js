const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product'); 

dotenv.config();

const destroyProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    console.log('✅');
    process.exit();
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
};

destroyProducts();