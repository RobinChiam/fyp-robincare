const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Invalid authorization header format");
    return res.status(401).json({ error: 'Invalid authorization header format' });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log("Authorization Token missing");
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      req.user = decoded; // Attach user data (e.g., id, role)

      next();
    } catch (err) {
      console.log("Invalid or expired token");
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
