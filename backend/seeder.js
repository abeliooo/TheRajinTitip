const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const csv = require('csv-parser');
const User = require('./models/User'); 
const connectDB = require('./config/db');

dotenv.config();

const readUsersFromCSV = () => {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream('../datas/data/therajintitip_user.csv') 
      .pipe(csv())
      .on('data', (row) => {
        row.isAdmin = row.isAdmin === 'True';
        users.push(row);
      })
      .on('end', () => {
        resolve(users); 
      })
      .on('error', (error) => {
        reject(error); 
      });
  });
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    const users = await readUsersFromCSV();

    await User.insertMany(users);
    console.log('✅ Data Successfully imported!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

importData();