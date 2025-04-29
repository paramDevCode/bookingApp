// middleware/authMiddleware.js
const jwt = require('../utils/jwt');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const decoded = jwt.verifyToken(token);
  if (!decoded) {
    return res.status(401).send('Invalid token.');
  }

  req.userId = decoded.userId; // Store the userId in the request
  next();
};

module.exports = authenticate;
