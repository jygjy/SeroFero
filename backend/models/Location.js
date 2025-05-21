// const mongoose = require("mongoose");

// const LocationSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // Location name
//   description: { type: String, required: true }, // Detailed diary-like description
//   category: { type: String, 
//     // enum: ["nature", "culture", "adventure", "food"],
//      required: true },
//   latitude: { type: Number, required: true }, // Coordinates
//   longitude: { type: Number, required: true },
//   images: [{ type: String }], // URLs for uploaded images
//   addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who added it
//   approved: { type: Boolean, default: false }, // Pending approval
// }, { timestamps: true });

// module.exports = mongoose.model("Location", LocationSchema);


// const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// const LocationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   category: { type: String },
//   latitude: { type: Number, required: true },
//   longitude: { type: Number, required: true },
//   images: [String],
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores users who liked the location
//   reviews: [ReviewSchema], // Stores user reviews
//   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores users who saved to wishlist
// });

// module.exports = mongoose.model("Location", LocationSchema);

const mongoose = require("mongoose");

// Reply Schema
const ReplySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Review Schema (add likes and replies)
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // <-- NEW
  replies: [ReplySchema] // <-- NEW
});
// Location Schema
const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Location name
  description: { type: String, required: true }, // Detailed diary-like description
  category: { type: String, required: true }, // Category (Nature, Adventure, Food, etc.)
  latitude: { type: Number, required: true }, // Coordinates
  longitude: { type: Number, required: true },
  images: [{ type: String }], // URLs for uploaded images
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who added the location
  approved: { type: Boolean, default: false }, // Pending approval
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the location
  reviews: [ReviewSchema], // Array of user reviews
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who saved this to their wishlist
}, { timestamps: true });

module.exports = mongoose.model("Location", LocationSchema);

