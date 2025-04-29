const jwt = require('jsonwebtoken');

// Secret keys should be kept safe and stored securely (e.g., in environment variables)
const ACCESS_SECRET = 'your_access_secret_key';  // Change this to your actual secret key
const REFRESH_SECRET = 'your_refresh_secret_key'; // Change this to your actual refresh secret key

// Function to generate an access token and refresh token
const generateTokens = (userId) => {
  const payload = { userId };

  // Generate access token with 1-hour expiration
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });

  // Generate refresh token with 7-day expiration
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// Function to verify an access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return null; // Token verification failed
  }
};

// Function to verify a refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null; // Token verification failed
  }
};

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };
