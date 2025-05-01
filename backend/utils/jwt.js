const jwt = require('jsonwebtoken');

// ✅ Use environment variables for real projects (use dotenv package)
const ACCESS_SECRET = 'your_access_secret_key';
const REFRESH_SECRET = 'your_refresh_secret_key';

/**
 * ✅ Generate both Access and Refresh tokens
 * @param {string} userId - The user ID to embed in the token
 * @param {string} accessExpiry - e.g., '15m', '1h'
 * @param {string} refreshExpiry - e.g., '7d'
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (userId, accessExpiry = '1h', refreshExpiry = '7d') => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: accessExpiry });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: refreshExpiry });

  return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken
};
