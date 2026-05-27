const express = require("express");
const { register, login, getMe } = require("../controllers/auth");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { name, email, password, confirmPassword }
 * Returns: { message, token, user }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 * Returns: { message, token, user }
 */
router.post("/login", login);

/**
 * GET /api/auth/me
 * Get current logged-in user info (protected route)
 * Headers: Authorization: Bearer <token>
 * Returns: { user }
 */
router.get("/me", authMiddleware, getMe);

module.exports = router;
