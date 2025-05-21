const express = require("express");
const User = require("../models/User");
const Location = require("../models/Location");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.countDocuments();
  const locations = await Location.countDocuments();
  const pending = await Location.countDocuments({ approved: false });
  const approvedLocations = await Location.countDocuments({ approved: true });
  res.json({ users, locations, pending, approvedLocations });
});

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
