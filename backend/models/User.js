const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImage: { type: String },
  bio: { type: String },
  contactInfo: {
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String }
  },
  preferences: {
    notificationEnabled: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true }
  },
  contributedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  favoriteLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
