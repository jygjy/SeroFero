require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 


// Import Routes
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes"); //  Importing  location routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);

// Test Route
// app.get("/", (req, res) => {
//   res.send(" SeroFero API is running...");
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
