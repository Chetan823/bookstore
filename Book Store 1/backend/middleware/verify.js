const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('authHeader:', authHeader)

  // Check for valid authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from header
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with secret key
    console.log('decoded:', decoded);

    req.user = decoded; // Attach user information to request for protected routes
    console.log('req.user:', req.user);
    next(); // Call next middleware if verification successful
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Invalid or expired token' }); // More specific error message
  }
};

module.exports = verifyToken; // Export middleware for use in app
