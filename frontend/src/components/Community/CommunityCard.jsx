import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Link from "next/link";

// Helper to calculate average rating
const getAverageRating = (reviews = []) => {
  if (!reviews.length) return null;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export default function CommunityCard({ location }) {
  // Calculate average rating
  const avgRating = getAverageRating(location.reviews);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={location.images?.[0] || "/placeholder.jpg"}
          alt={location.name}
          className="w-full h-56 object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{location.description ? `${location.description.substring(0, 80)}...` : 'No description available.'}</p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-yellow-500 text-sm">
            <FaStar className="mr-1" />
            {avgRating || "N/A"} {/* Display calculated average rating */}
          </div>
          <Link href={`/locations/${location._id}`} className="text-primary hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
