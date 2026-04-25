const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "smart-hotel-secret-key-change-in-production";
const TOKEN_EXPIRY = "1h";

const users = [
  { id: 1, username: "admin", password: "password123", role: "admin" },
  { id: 2, username: "user", password: "password456", role: "user" }
];

const authenticate = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return null;
  }
  return { id: user.id, username: user.username, role: user.role };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
};

module.exports = {
  authenticate,
  generateToken,
  verifyToken,
  authMiddleware
};
