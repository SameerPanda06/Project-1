const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) 
    return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT verify error:', err.message);
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user; // Attach user payload to request
    next();          // Proceed to next middleware or route handler
  });
}

module.exports = authenticateToken;
