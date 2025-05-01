const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');

// ====================== REGISTER ======================
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

// ====================== LOGIN ======================
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send('Phone number and password are required.');
  }

  try {
    const customer = await Customer.findOne({ phoneNumber });
    if (!customer || !customer.password) {
      return res.status(400).send('Invalid phone number or password.');
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).send('Invalid phone number or password.');
    }

    // ✅ Generate both tokens
    const { accessToken, refreshToken } = jwt.generateTokens(customer._id, '15m', '7d');

    // Optional: store refresh token in DB
    customer.refreshToken = refreshToken;
    await customer.save();

    // Set refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,               // Ensures the cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true for production over HTTPS
      sameSite: 'Strict',           // Controls when cookies are sent
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration time
    });

    // ✅ Send access token only in JSON response
    res.status(200).json({
      message: 'Login successful!',
      token: accessToken
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// ====================== REFRESH ======================
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).send('Refresh token required.');
  }

  try {
    const decoded = jwt.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).send('Invalid or expired refresh token.');
    }

    // ✅ Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = jwt.generateTokens(decoded.userId, '15m', '7d');

    // Optional: update stored refreshToken in DB
    const customer = await Customer.findById(decoded.userId);
    if (customer) {
      customer.refreshToken = newRefreshToken;
      await customer.save();
    }

    // ✅ Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
