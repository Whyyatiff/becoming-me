// auth-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Test route
router.get('/test', (req, res) => {
  console.log('🧪 /api/auth/test route triggered');
  res.json({ msg: 'Auth route working' });
});

// ✅ Create test user
router.get('/create-test-user', async (req, res) => {
  const email = 'test@gmail.com';
  if (await User.findOne({ email })) return res.json({ msg: 'Test user exists' });
  const hashed = await bcrypt.hash('test1234', 10);
  await new User({ username: 'tester', email, password: hashed }).save();
  res.json({ msg: '✅ Created test user' });
});

// ✅ Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ msg: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  await new User({ username, email, password: hashed }).save();
  res.json({ msg: 'Signup successful' });
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });
  if (!await bcrypt.compare(password, user.password)) 
    return res.status(401).json({ msg: 'Invalid password' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// ✅ Forgot password placeholder
router.post('/forgot-password', (req, res) => {
  res.json({ msg: 'Reset sent (placeholder)' });
});

module.exports = router;
