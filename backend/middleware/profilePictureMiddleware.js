// Example using express and multer
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/api/users/profile-picture', upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // You might want to save the file path to the user profile in your DB here
  res.json({ profilePictureUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;