const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');

// Register API
router.post('/register', async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send('Phone number and password are required.');
  }

  try {
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (existingCustomer) {
      return res.status(400).send('Customer already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      phoneNumber,
      password: hashedPassword
    });

    await customer.save();
    res.status(201).send('Customer registered successfully.');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
});

// Login API
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send('Phone number and password are required.');
  }

  try {
    const customer = await Customer.findOne({ phoneNumber });
    if (!customer) {
      return res.status(400).send('Invalid phone number or password.');
    }

    if (!customer.password) {
      return res.status(400).send('No password set for this account.');
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).send('Invalid phone number or password.');
    }

    // Generate the access and refresh tokens
    const accessToken = jwt.generateToken(customer._id, '15m'); // 15 minutes expiration
    const refreshToken = jwt.generateToken(customer._id, '7d'); // 7 days expiration for refresh token

    // Save the refresh token in the database or cache (optional)
    customer.refreshToken = refreshToken;
    await customer.save();

    res.status(200).json({
      message: 'Login successful!',
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});
console.log('🔄  auth.js loaded — refresh route is at POST /refresh');

// Refresh Token API
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send('Refresh token required.');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verifyToken(refreshToken, 'refresh-secret');
    if (!decoded) {
      return res.status(401).send('Invalid or expired refresh token.');
    }

    // Generate a new access token
    const newAccessToken = jwt.generateToken(decoded.userId, '15m'); // Generate a new access token

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
