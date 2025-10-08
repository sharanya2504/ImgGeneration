// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// // ... other imports like bcrypt

// exports.login = async (req, res) => {
//   // ... your logic to find the user and check the password ...

//   try {
//     // After you confirm the user's password is correct:
//     const payload = {
//       user: {
//         id: user.id, // The user's ID from the database
//       },
//     };

//     // ✅ SIGN the token using the secret from .env
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET, // The secret key
//       { expiresIn: "5h" },     // Token expiration time
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// // A similar jwt.sign call should be in your register function


// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load environment variables
require("dotenv").config();

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,           // Secret from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// Check if any user exists (for initial setup)
exports.checkUser = async (req, res) => {
  try {
    const user = await User.findOne({});
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate token and set cookie
    const token = generateToken(newUser._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ success: true, message: "Registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });

    // Generate token and set cookie
    const token = generateToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ success: true, message: "Logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout user
exports.logout = (req, res) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully" });
};

// Middleware to protect routes
exports.protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
