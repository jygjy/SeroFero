"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function ReviewSection({ locationId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/locations/${locationId}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("❌ Failed to fetch reviews:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [locationId]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/locations/${locationId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews(response.data.reviews);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("❌ Failed to submit review:", error.message);
    }
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600 mt-2">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center text-yellow-500">
                {Array(review.rating).fill().map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-800 mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      <form onSubmit={submitReview} className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900">Leave a Review</h4>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-4 p-3 border rounded-lg"
          placeholder="Write your review here..."
          required
        ></textarea>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 mt-3">
          Submit Review
        </button>
      </form>
    </div>
  );
}
