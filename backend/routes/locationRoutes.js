const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getLocationById } = require("../controllers/locationController"); 
const upload = require("../middleware/uploadMiddleware");
const {
  addLocation,
  getApprovedLocations,
  getAllLocations,
  approveLocation,
  likeLocation,  // ✅ Import Like Function
  addReview,
  toggleWishlist
} = require("../controllers/locationController");

const router = express.Router();

// ✅ Add a location (requires authentication)
router.post("/add", authMiddleware, upload.array("images", 5), addLocation);

// ✅ Get all approved locations for explore section
router.get("/", getApprovedLocations);

// ✅ Get all locations (Admin Use)
router.get("/all", authMiddleware, adminMiddleware, getAllLocations);

/**
 * ✅ Get a Single Location by ID (using controller)
 */
router.get("/:id", getLocationById);

// ✅ Approve or Reject a location (Admin only)
router.put("/approve/:id", authMiddleware, adminMiddleware, approveLocation);
// ✅ Like/Unlike a location
router.post("/:id/like", authMiddleware, likeLocation);

// ✅ Add a Review with Rating
router.post("/:id/review", authMiddleware, addReview);

// ✅ Add/Remove Location from Wishlist
router.post("/:id/wishlist", authMiddleware, toggleWishlist);

module.exports = router;
