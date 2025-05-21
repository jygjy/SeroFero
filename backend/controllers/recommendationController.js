const Location = require("../models/Location");
const User = require("../models/User");

// Cache duration for recommendations
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
let lastUpdateTime = new Date();

const calculateContentBasedSimilarity = (location1, location2) => {
  let score = 0;
  
  // Category matching (30% weight)
  if (location1.category === location2.category) {
    score += 0.30;
  }
  
  // Content-based similarity from description (40% weight)
  const keywords1 = location1.description?.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3) || [];
  
  const keywords2 = location2.description?.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3) || [];
    
  const uniqueKeywords = new Set([...keywords1, ...keywords2]);
  const vector1 = Array.from(uniqueKeywords).map(keyword => keywords1.includes(keyword) ? 1 : 0);
  const vector2 = Array.from(uniqueKeywords).map(keyword => keywords2.includes(keyword) ? 1 : 0);
  
  // Calculate cosine similarity
  const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val * val, 0));
  
  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2) || 0;
  score += cosineSimilarity * 0.40;
  
  // Location attributes similarity (30% weight)
  // Images presence (5%)
  if (location1.images?.length && location2.images?.length) {
    score += 0.05;
  }
  
  // Rating similarity (15%)
  const avgRating1 = location1.reviews?.reduce((acc, rev) => acc + rev.rating, 0) / location1.reviews?.length || 0;
  const avgRating2 = location2.reviews?.reduce((acc, rev) => acc + rev.rating, 0) / location2.reviews?.length || 0;
  const ratingDiff = Math.abs(avgRating1 - avgRating2) / 5;
  score += (1 - ratingDiff) * 0.15;
  
  
  // Popularity similarity (10%)
  const popularityDiff = Math.abs(location1.reviews?.length - location2.reviews?.length) / 
    Math.max(location1.reviews?.length || 1, location2.reviews?.length || 1);
  score += (1 - popularityDiff) * 0.10;
  
  return score;
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('favoriteLocations wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for recent updates
    const recentUpdates = await Location.findOne({
      updatedAt: { $gt: lastUpdateTime }
    });

    // Get user's interacted locations
    const userPreferences = [
      ...(user.favoriteLocations || []),
      ...(user.wishlist || [])
    ];
    
    // Get all approved locations
    const allLocations = await Location.find({ 
      approved: true,
      _id: { $nin: userPreferences }
    })
    .populate('reviews')
    .sort({ updatedAt: -1 });
    
    if (!allLocations.length) {
      return res.status(404).json({ message: 'No locations available' });
    }

    if (userPreferences.length === 0) {
      // Enhanced cold start with rating, popularity, and recency
      const recommendations = allLocations
        .sort((a, b) => {
          const ratingA = a.reviews.reduce((acc, rev) => acc + rev.rating, 0) / (a.reviews.length || 1);
          const ratingB = b.reviews.reduce((acc, rev) => acc + rev.rating, 0) / (b.reviews.length || 1);
          const popularityA = a.reviews.length;
          const popularityB = b.reviews.length;
          const recencyA = new Date(a.updatedAt).getTime();
          const recencyB = new Date(b.updatedAt).getTime();
          
          // Combined score: 40% rating, 30% popularity, 30% recency
          return (
            (ratingB * 0.4 + popularityB * 0.3 + recencyB * 0.3) -
            (ratingA * 0.4 + popularityA * 0.3 + recencyA * 0.3)
          );
        })
        .slice(0, 6);
      
      lastUpdateTime = new Date();
      return res.json(recommendations);
    }
    
    // Get user's preferred locations
    const preferredLocations = await Location.find({
      _id: { $in: userPreferences }
    }).populate('reviews');
    
    if (!preferredLocations.length) {
      return res.status(404).json({ message: 'Preferred locations not found' });
    }
    
    // Calculate recommendations with recency boost
    const recommendations = allLocations
      .map(location => {
        try {
          const contentScore = preferredLocations.reduce((total, preferred) => {
            const similarity = calculateContentBasedSimilarity(location, preferred);
            const recencyBoost = (new Date(location.updatedAt).getTime() - lastUpdateTime) / CACHE_DURATION;
            return total + (similarity * (1 + Math.max(0, recencyBoost)));
          }, 0) / preferredLocations.length;
          
          return {
            ...location.toObject(),
            score: contentScore
          };
        } catch (err) {
          console.error('Error calculating similarity:', err);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ score, ...location }) => location);
    
    if (!recommendations.length) {
      return res.status(404).json({ message: 'No recommendations could be generated' });
    }

    lastUpdateTime = new Date();
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      message: 'Error generating recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};