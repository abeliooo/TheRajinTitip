const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const csv = require('csv-parser');
const User = require('./models/User'); 
const Product = require('./models/Product'); 
const connectDB = require('./config/db');

dotenv.config();

const readProductsFromCSV = () => {
  return new Promise((resolve, reject) => {
    const products = [];
    fs.createReadStream('../datas/data/therajintitip_product.csv') 
      .pipe(csv())
      .on('data', (row) => {
        products.push(row);
      })
      .on('end', () => {
        resolve(products);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Fungsi utama seeder
const importProducts = async () => {
  try {
    await connectDB();

    const users = await User.find({}, '_id');
    const userIds = users.map(user => user._id);
    
    await Product.deleteMany();

    let products = await readProductsFromCSV();

    products = products.map(product => {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      return {
        ...product,
        user: randomUserId, 
      };
    });

    await Product.insertMany(products);
    console.log('✅ Merge Success');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {``
    mongoose.connection.close();
    process.exit();
  }
};

importProducts();