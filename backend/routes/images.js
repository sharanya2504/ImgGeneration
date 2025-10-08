// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth"); // ✅ Import the middleware
// const Image = require("../models/Image"); // ✅ Import the Image model

// // @route   POST /api/images
// // @desc    Save a generated image
// // @access  Private
// router.post("/", auth, async (req, res) => { // ✅ Apply the auth middleware
//   try {
//     const { prompt, imageUrl } = req.body;

//     const newImage = new Image({
//       prompt,
//       imageUrl,
//       user: req.user.id, // ✅ Get user ID from the middleware
//     });

//     const image = await newImage.save();
//     res.json(image);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET /api/images
// // @desc    Get all images for a logged-in user
// // @access  Private
// router.get("/", auth, async (req, res) => { // ✅ Apply the auth middleware
//   try {
//     // ✅ Find images that belong ONLY to the current user
//     const images = await Image.find({ user: req.user.id }).sort({ timestamp: -1 }); // Sort by newest
//     res.json(images);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
const { protect } = require("../controllers/authController");
const mongoose = require("mongoose");

// GET all images for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    console.log("🔍 Fetching images for user:", req.user);
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(req.user)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }
    
    const images = await Image.find({ user: req.user }).sort({ createdAt: -1 });
    console.log("✅ Found", images.length, "images for user", req.user);
    res.json(images);
  } catch (err) {
    console.error("❌ Error fetching images:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST new image
router.post("/", protect, async (req, res) => {
  try {
    console.log("📥 Received image save request for user:", req.user);

    const { prompt, imageUrl } = req.body;
    if (!prompt || !imageUrl) {
      return res.status(400).json({ msg: "Prompt and imageUrl are required" });
    }

    // Normalize image URL
    const normalizedImageUrl = imageUrl.replace(/\\/g, "/");

    // Ensure user is ObjectId
    const userId = req.user._id || req.user;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }

    const newImage = new Image({
      prompt: prompt.trim(),
      imageUrl: normalizedImageUrl,
      user: userId,
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);

  } catch (err) {
    console.error("❌ Error saving image:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


module.exports = router;