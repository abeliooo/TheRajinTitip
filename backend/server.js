const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API for The Rajin Titip is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
