require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// 🚀 Debug logs around router mounting
console.log('🔷 Attaching auth routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('🔶 Auth routes attached.');

// Test root route
app.get('/', (req, res) => res.send('Hello from backend!'));

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ msg: err.message || 'Something went wrong' });
});

// Start server and connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
