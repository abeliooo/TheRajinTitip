const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const messageRoutes = require('./routes/messageRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const { protect, admin } = require('./middleware/authMiddleware.js');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const xss = require('xss');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60, 
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

const allowedOrigins = [
  "http://localhost:3000",
  "https://therajintitip.vercel.app"
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, { 
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/messages', express.static(path.join(__dirname, '/messages')));

app.get('/', (req, res) => {
  res.send('API for The Rajin Titip is running...');
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', protect, admin, adminRoutes);
app.use('/api/messages', protect, messageRoutes);

app.use(notFound);
app.use(errorHandler);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

const socketRateLimit = {};
const SOCKET_LIMIT = 5; 
const SOCKET_WINDOW = 5000;

io.on('connection', (socket) => {
  console.log('User connected via WebSocket:', socket.id);

  socket.on('join_room', (transactionId) => {
    socket.join(transactionId);
    console.log(`User ${socket.user.id} joined room: ${transactionId}`);
  });

  socket.on('send_message', async (data) => {
    const now = Date.now();
    socketRateLimit[socket.id] = socketRateLimit[socket.id] || [];
    socketRateLimit[socket.id] = socketRateLimit[socket.id].filter(ts => now - ts < SOCKET_WINDOW);

    if (socketRateLimit[socket.id].length >= SOCKET_LIMIT) return;

    socketRateLimit[socket.id].push(now);

    try {
      if (socket.user.id !== data.sender) return;

      const cleanContent = xss(data.content);

      const newMessage = new Message({
        transaction: data.transaction,
        sender: data.sender,
        receiver: data.receiver,
        content: cleanContent,
      });

      let savedMessage = await newMessage.save();
      savedMessage = await savedMessage.populate('sender', 'username');

      io.to(data.transaction).emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Error saving or sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete socketRateLimit[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
