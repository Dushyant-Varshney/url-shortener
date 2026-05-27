const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user");

/**
 * Generate JWT token for user
 */
const generateToken = (userId, email, name) => {
  const token = jwt.sign(
    { userId, email, name },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
  return token;
};

/**
 * Register a new user
 */
const register = async (
  req,
  res
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await userModel.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.name);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

/**
 * Login user
 */
const login = async (
  req,
  res
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    // Find user by email and include password field
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Compare passwords
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.name);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

/**
 * Get current logged-in user info
 */
const getMe = async (
  req,
  res
) => {
  try {
    // User info is already attached to request by authMiddleware
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
