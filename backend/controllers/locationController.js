const Location = require("../models/Location");
const User = require("../models/User");
const { createNotification } = require("./notificationController");


exports.addLocation = async (req, res) => {
  try {
    const { name, description, category, latitude, longitude } = req.body;

    if (!name || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imagePaths = req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    // Get uploaded image URLs (if any)
    // const imagePaths = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const location = new Location({
      name,
      description,
      category,
      latitude,
      longitude,
      images: imagePaths,
      addedBy: req.user.id,
      approved: false, // Needs admin approval
    });

    await location.save();

    // Notify admin about new location
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        "location_added",
        location._id,
        `New location "${location.name}" has been submitted for approval`
      );
    }

    res.status(201).json({ message: "Location submitted for approval", location });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all approved locations (for Explore Page and Community Page)
exports.getApprovedLocations = async (req, res) => {
  try {
    const locations = await Location.find({ approved: true }).populate('reviews'); // Populate reviews
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all locations (Admin Use)
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Get a Single Location by ID
 */
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate("reviews.user", "name profileImage");
    if (!location) return res.status(404).json({ message: "Location not found" });

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Approve or Reject a Location (Admin Only)
exports.approveLocation = async (req, res) => {
  try {
    const { approved } = req.body;
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    location.approved = approved;
    await location.save();

    // Notify user about location approval/rejection
    await createNotification(
      location.addedBy,
      approved ? "location_approved" : "location_rejected",
      location._id,
      `Your location "${location.name}" has been ${approved ? "approved" : "rejected"}`
    );

    res.json({ message: `Location ${approved ? "approved" : "rejected"}`, location });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Check if location is liked by the user
 */
exports.checkLikeStatus = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const userId = req.user.id;
    const isLiked = location.likes.includes(userId);

    res.json({ isLiked });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Check if location is in user's wishlist
 */
exports.checkWishlistStatus = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const userId = req.user.id;
    const isBookmarked = location.wishlist.includes(userId);

    res.json({ isBookmarked });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Like/Unlike a Location
 */
exports.likeLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const userId = req.user.id;
    if (location.likes.includes(userId)) {
      location.likes = location.likes.filter((id) => id.toString() !== userId);
    } else {
      location.likes.push(userId);
    }

    await location.save();
    res.json({ message: "Like updated", likesCount: location.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Add a Review with Rating
 */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const newReview = {
      user: req.user.id,
      rating,
      comment,
      createdAt: Date.now(),
    };

    location.reviews.push(newReview);
    await location.save();
    res.json({ message: "Review added", reviews: location.reviews });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Add/Remove Location from Wishlist
 */
exports.toggleWishlist = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const userId = req.user.id;
    if (location.wishlist.includes(userId)) {
      location.wishlist = location.wishlist.filter((id) => id.toString() !== userId);
    } else {
      location.wishlist.push(userId);
    }

    await location.save();
    res.json({ message: "Wishlist updated", wishlistCount: location.wishlist.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Like or Unlike a Review
 */
exports.likeReview = async (req, res) => {
  try {
    const { locationId, reviewId } = req.params;
    const userId = req.user.id;
    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const review = location.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const alreadyLiked = review.likes.includes(userId);
    if (alreadyLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
    }

    await location.save();
    res.json({ message: alreadyLiked ? "Review unliked" : "Review liked", likes: review.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a Reply to a Review
exports.replyToReview = async (req, res) => {
  try {
    const { locationId, reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const review = location.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.replies.push({ user: userId, comment });
    await location.save();
    res.json({ message: "Reply added", replies: review.replies });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a location (Admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

