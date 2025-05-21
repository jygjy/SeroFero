require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 


// Import Routes
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes"); //  Importing  location routes
const notificationRoutes = require("./routes/notificationRoutes"); // Importing notification routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const communityStatsRoutes = require("./routes/communityStatsRoutes"); // Import new community stats routes

const profilePictureRouter = require('./middleware/profilePictureMiddleware');
// app.use(profilePictureRouter);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static('uploads'));
app.use(profilePictureRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/community", communityStatsRoutes); // Use the new community stats routes

// Test Route
// app.get("/", (req, res) => {
//   res.send(" SeroFero API is running...");
// });

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
