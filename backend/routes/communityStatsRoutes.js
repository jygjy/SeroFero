const express = require('express');
const router = express.Router();
const { getCommunityStats } = require('../controllers/communityStatsController');

// @desc    Get community stats (total locations, total users, etc.)
// @route   GET /api/community/stats
// @access  Public
router.get('/stats', getCommunityStats);

module.exports = router; 