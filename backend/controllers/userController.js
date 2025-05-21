const Location = require("../models/Location");
const User = require("../models/User");

exports.getWishlist = async (req, res) => {
  try {
    const locations = await Location.find({ wishlist: req.user.id })
      .select('name description images category');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

exports.getContributions = async (req, res) => {
  try {
    const locations = await Location.find({ addedBy: req.user.id })
      .select('name description images category approved');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({ message: 'Error fetching contributions' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const locations = await Location.find({ likes: req.user.id })
      .select('name description images category');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      contactInfo: user.contactInfo,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, contactInfo } = req.body;

    const updateFields = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (contactInfo?.phone !== undefined) updateFields["contactInfo.phone"] = contactInfo.phone;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      contactInfo: user.contactInfo,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    if (!profileImage) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );
    res.json({ message: "Profile image updated", profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};