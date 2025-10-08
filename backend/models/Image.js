// const mongoose = require("mongoose");

// const ImageSchema = new mongoose.Schema({
//   // ✅ Add this user field
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // This links to your User model
//     required: true,
//   },
//   prompt: {
//     type: String,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Image", ImageSchema);


const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("Image", ImageSchema);