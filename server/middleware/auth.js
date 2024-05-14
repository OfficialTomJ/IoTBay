// middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  const jwtSecret = process.env.jwtSecret;
  try {
    console.log(token);
    const decoded = jwt.verify(token, jwtSecret);

    // Set user ID from decoded token to request object
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

