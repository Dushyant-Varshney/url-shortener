const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token and attach user info to request
 * Token should be sent in Authorization header as: Bearer <token>
 */
const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided. Please login first." });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Attach user ID to request object
    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired. Please login again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token. Please login again." });
    } else {
      res.status(401).json({ message: "Authentication failed." });
    }
  }
};

module.exports = {
  authMiddleware,
};
