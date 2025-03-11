const Location = require("../models/Location");

// ✅ Add a new location
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
    res.status(201).json({ message: "Location submitted for approval", location });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all approved locations (for Explore Page)
exports.getApprovedLocations = async (req, res) => {
  try {
    const locations = await Location.find({ approved: true });
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
    const location = await Location.findById(req.params.id).populate("reviews.user", "name");
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
    res.json({ message: `Location ${approved ? "approved" : "rejected"}`, location });
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
