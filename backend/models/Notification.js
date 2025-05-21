
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["location_added", "location_approved", "location_rejected"], required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);