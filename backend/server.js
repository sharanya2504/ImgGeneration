const express = require("express");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Connect DB
connectDB();
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);
// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  credentials: true, // allows cookies to be sent
}));
 // allow frontend localhost
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/images", imageRoutes); // ✅ new route for images

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
