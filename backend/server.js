const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const Message = require('./models/Message');
const messageRoutes = require('./routes/messageRoutes.js');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.send('API for The Rajin Titip is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/messages', express.static(path.join(__dirname, '/messages')));
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('join_room', (transactionId) => {
    socket.join(transactionId);
    console.log(`User ${socket.id} joined room: ${transactionId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = new Message({
        transaction: data.transaction,
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
      });
      
      let savedMessage = await newMessage.save();
      savedMessage = await savedMessage.populate('sender', 'username');

      io.to(data.transaction).emit('receive_message', savedMessage);
      
    } catch (error) {
      console.error('Error saving or sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server berjalan di port ${PORT}`));