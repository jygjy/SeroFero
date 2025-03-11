"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaHeart, FaRegHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import ReviewSection from "@/components/ReviewSection";

export default function LocationPage() {
  const router = useRouter();
  const { id } = router.query; // Get location ID from the URL
  const [location, setLocation] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/locations/${id}`);
        setLocation(response.data);
        setLiked(response.data.likes.includes(localStorage.getItem("userId"))); // Check if user liked
      } catch (error) {
        console.error("❌ Error fetching location:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/locations/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(!liked);
    } catch (error) {
      console.error("❌ Error liking location:", error.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-6">Loading location details...</p>;
  if (!location) return <p className="text-center text-red-500 mt-6">Location not found.</p>;

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image */}
        <img src={location.images?.[0] || "/placeholder.jpg"} alt={location.name} className="w-full h-72 object-cover" />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
          <p className="text-gray-600 mt-2">{location.description}</p>

          {/* Location Info */}
          <div className="flex items-center text-gray-600 mt-4">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <span>{location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}</span>
          </div>

          {/* Like & Rating */}
          <div className="flex justify-between items-center mt-4">
            <button onClick={toggleLike} className="text-2xl">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500 hover:text-red-500" />}
            </button>
            <div className="flex items-center text-yellow-500">
              <FaStar className="mr-1" />
              <span>{location.rating || "4.5"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection locationId={id} />
    </div>
  );
}
