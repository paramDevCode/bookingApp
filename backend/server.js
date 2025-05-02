
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth'); // Import auth routes

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200', // Replace with the URL of your Angular frontend
  credentials: true,               // Allow sending and receiving cookies
};
// Enable CORS for all origins (you can restrict it later)
app.use(cors(corsOptions));
// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tailoringApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Use the orders routes on a different path
app.use('/api/orders', orderRoutes);  // Orders routes will be available under /api/orders

// Use the auth routes on a different path
app.use('/api/auth', authRoutes);  // Auth routes will be available under /api/auth

// Sample route to test server
app.get('/', (req, res) => {
  res.send('Welcome to Tailoring App API');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

