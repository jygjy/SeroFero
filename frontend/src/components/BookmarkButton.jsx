import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import axios from 'axios';

const BookmarkButton = ({ locationId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkIfBookmarked();
  }, [locationId]);

  const checkIfBookmarked = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/locations/${locationId}/check-wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(response.data.isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or show login modal
        return;
      }

      if (isBookmarked) {
        await axios.delete(`http://localhost:5001/api/locations/${locationId}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/locations/${locationId}/wishlist`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isBookmarked ? (
        <FaBookmark className="h-5 w-5 text-blue-600" />
      ) : (
        <FaRegBookmark className="h-5 w-5" />
      )}
    </button>
  );
};

export default BookmarkButton;