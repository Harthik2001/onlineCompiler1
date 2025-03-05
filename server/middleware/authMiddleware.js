



// // server/middleware/authMiddleware.js


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('❌ No Authorization Header');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token
  console.log('🔍 Token received:', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ JWT Verification Failed:', err.message);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    console.log('✅ JWT Verified. User:', user);
    req.user = user;
    next();
  });
};

