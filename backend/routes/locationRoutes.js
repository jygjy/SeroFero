const express = require("express");
const Location = require("../models/Location");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getLocationById } = require("../controllers/locationController");
const { getRecommendations } = require("../controllers/recommendationController"); 
const upload = require("../middleware/uploadMiddleware");
const { deleteLocation } = require("../controllers/locationController");
const {
  addLocation,
  getApprovedLocations,
  getAllLocations,
  approveLocation,
  likeLocation,  //  Import Like Function
  addReview,
  toggleWishlist,
  likeReview,
  replyToReview,
  checkWishlistStatus,
  checkLikeStatus // Import the new controller function
} = require("../controllers/locationController");

const router = express.Router();



router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    // Your recommendation logic here
    const recommendations = await Location.find()
      .populate('reviews')
      .limit(6);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
});

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

// ✅ Check if location is liked by the user
router.get("/:id/check-like", authMiddleware, checkLikeStatus);

// ✅ Check if location is in user's wishlist
router.get("/:id/check-wishlist", authMiddleware, checkWishlistStatus);

// ✅ Approve or Reject a location (Admin only)
router.put("/approve/:id", authMiddleware, adminMiddleware, approveLocation);
// ✅ Like/Unlike a location
router.post("/:id/like", authMiddleware, likeLocation);

// ✅ Add a Review with Rating
router.post("/:id/review", authMiddleware, addReview);

// ✅ Add/Remove Location from Wishlist
router.post("/:id/wishlist", authMiddleware, toggleWishlist);

router.get("/recommendations", authMiddleware, getRecommendations);

//
// Like/unlike a review
router.post("/:locationId/reviews/:reviewId/like", authMiddleware, likeReview);

// Reply to a review
router.post("/:locationId/reviews/:reviewId/reply", authMiddleware, replyToReview);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLocation);

module.exports = router;
