const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, namaAsli, email, nomorTelepon, alamat, password, nomorRekening } = req.body;
  // req.body itu buat minta data ke frontend misal lewat form

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error('Email or Username already registered');
  }

  let user;
  try {
    user = await User.create({
      username,
      namaAsli,
      email,
      nomorTelepon,
      alamat,
      password,
      nomorRekening,
    });
  } catch (error) {
    res.status(400); 
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
  

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User data is invalid');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email or password wrong');
  }
});

module.exports = { registerUser, loginUser };