"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa"; // Icons for UI enhancements

export default function ExplorePreview() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations");
        setLocations(response.data.slice(0, 3)); // Show only 3 locations as preview
      } catch (error) {
        console.error("❌ Failed to fetch locations:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Explore Destinations</h2>
        <Link href="/explore" className="text-primary hover:underline text-lg">
          See More →
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading locations...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <Link key={location._id} href={`/explore`} className="block">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer">
                {/* Image */}
                <div className="relative">
                  <img
                    src={location.images?.[0] || "/placeholder.jpg"}
                    alt={location.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    {location.category || "General"}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{location.description.substring(0, 80)}...</p>

                  {/* Location & Rating */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-red-500 mr-1" />
                      {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <FaStar className="mr-1" />
                      {location.rating || "4.5"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
