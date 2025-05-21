const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getWishlist, getContributions, getFavorites, updateProfile, getUserProfile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const { updateProfileImage } = require('../controllers/userController');

router.put(
  "/profile/image",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage
);

// Get user's wishlist
router.get('/wishlist', authMiddleware, getWishlist);

// Get user's contributions
router.get('/contributions', authMiddleware, getContributions);

// Get user's favorites
router.get('/favorites', authMiddleware, getFavorites);

// Add route for updating user profile
router.put('/profile', authMiddleware, updateProfile);

// Add route for fetching user's own profile
router.get('/profile', authMiddleware, getUserProfile);

// Add route for toggling wishlist status
router.post('/locations/:id/wishlist', authMiddleware, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const wishlistIndex = location.wishlist.indexOf(req.user.id);
    if (wishlistIndex === -1) {
      location.wishlist.push(req.user.id);
    } else {
      location.wishlist.splice(wishlistIndex, 1);
    }

    await location.save();
    res.json({ 
      message: wishlistIndex === -1 ? 'Added to wishlist' : 'Removed from wishlist',
      inWishlist: wishlistIndex === -1 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;