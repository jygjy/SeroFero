const express = require("express");
const User = require("../models/User");
const Location = require("../models/Location");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", adminMiddleware, async (req, res) => {
  const users = await User.countDocuments();
  const locations = await Location.countDocuments();
  const pending = await Location.countDocuments({ approved: false });
  res.json({ users, locations, pending });
});

module.exports = router;
