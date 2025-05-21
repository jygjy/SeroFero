"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

export default function ReviewSection({ locationId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState({}); // { [reviewId]: string }
  const [likeLoading, setLikeLoading] = useState({}); // { [reviewId]: boolean }
  const [replyLoading, setReplyLoading] = useState({}); // { [reviewId]: boolean }

  // Fetch reviews
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

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [locationId]);

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/locations/${locationId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("❌ Failed to submit review:", error.message);
    }
  };

  // Like/unlike a review
  const handleLikeReview = async (reviewId) => {
    setLikeLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/locations/${locationId}/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();
    } catch (error) {
      console.error("❌ Failed to like/unlike review:", error.message);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // Reply to a review
  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    setReplyLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/locations/${locationId}/reviews/${reviewId}/reply`,
        { comment: replyInputs[reviewId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
      fetchReviews();
    } catch (error) {
      console.error("❌ Failed to reply to review:", error.message);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // Helper to check if current user liked a review
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const hasLiked = (review) => userId && review.likes && review.likes.includes(userId);

  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600 mt-2">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="mt-4 space-y-8">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-4 flex flex-col gap-2">
              <div className="flex items-start gap-3">
                {/* Profile Image */}
                <img
  src={
    review.user?.profileImage
      ? `http://localhost:5001${review.user.profileImage}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || "U")}`
  }
  alt={review.user?.name || "User"}
  className="w-10 h-10 rounded-full object-cover border"
/>
                <div className="flex-1">
                  {/* Profile Name */}
                  <div className="font-medium text-gray-900">{review.user?.name || "Unknown User"}</div>
                  <div className="flex items-center text-yellow-500">
                    {Array(review.rating)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} />
                      ))}
                  </div>
                  <p className="text-gray-800 mt-1">{review.comment}</p>
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeReview(review._id)}
                    className={`flex items-center gap-1 text-blue-500 text-sm mt-1 focus:outline-none`}
                    disabled={likeLoading[review._id]}
                  >
                    {hasLiked(review) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    {review.likes?.length || 0} Like{review.likes?.length === 1 ? "" : "s"}
                  </button>
                </div>
              </div>
              {/* Replies */}
              <div className="ml-12 mt-2 space-y-2">
                {review.replies?.map((reply, ridx) => (
                  <div key={ridx} className="flex items-start gap-2">
                    <img
                      src={
                        reply.user?.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user?.name || "U")}`
                      }
                      alt={reply.user?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div>
                      <span className="font-medium text-gray-800">{reply.user?.name || "User"}</span>
                      <span className="ml-2 text-gray-700">{reply.comment}</span>
                    </div>
                  </div>
                ))}
                {/* Reply Form */}
                <form onSubmit={e => handleReplySubmit(e, review._id)} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={replyInputs[review._id] || ""}
                    onChange={e => setReplyInputs({ ...replyInputs, [review._id]: e.target.value })}
                    placeholder="Write a reply..."
                    className="border rounded px-2 py-1 flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="text-blue-600"
                    disabled={replyLoading[review._id]}
                  >
                    {replyLoading[review._id] ? "Replying..." : "Reply"}
                  </button>
                </form>
              </div>
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
