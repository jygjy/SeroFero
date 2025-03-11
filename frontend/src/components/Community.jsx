"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

export default function Community() {
  const [locations, setLocations] = useState([]);
  const [likedLocations, setLikedLocations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch locations:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Handle Like Button
  const toggleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/locations/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikedLocations((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.error("❌ Error liking location:", error.message);
    }
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Community Locations</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading locations...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2">
              {/* Image */}
              <div className="relative">
                <img
                  src={location.images?.[0] || "/placeholder.jpg"}
                  alt={location.name}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => toggleLike(location._id)}
                  className="absolute top-3 right-3 text-2xl"
                >
                  {likedLocations[location._id] ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500 hover:text-red-500" />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{location.description.substring(0, 80)}...</p>

                {/* Rating & Wishlist */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-yellow-500 text-sm">
                    <FaStar className="mr-1" />
                    {location.rating || "4.5"}
                  </div>
                  <Link href={`/locations/${location._id}`} className="text-primary hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
