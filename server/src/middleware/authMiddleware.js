const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access forbidden: insufficient role permissions' });
      }

      next(); // Passes control to the next middleware or route handler
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
