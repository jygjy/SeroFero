const Location = require('../models/Location');
const User = require('../models/User');

// @desc    Get community stats (total locations, total users)
// @route   GET /api/community/stats
// @access  Public
exports.getCommunityStats = async (req, res) => {
  try {
    // Count only approved locations
    const totalLocations = await Location.countDocuments({ approved: true });

    // Count total users
    const totalMembers = await User.countDocuments();

    res.json({
      totalLocations,
      totalMembers,
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};