const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require("../controllers/notificationController");

// Get all notifications for the authenticated user
router.get("/", authMiddleware, getUserNotifications);

// Get unread notification count
router.get("/unread-count", authMiddleware, getUnreadCount);

// Mark a notification as read
router.put("/:id/read", authMiddleware, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", authMiddleware, markAllAsRead);

module.exports = router;