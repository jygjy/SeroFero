// import Community from "@/components/Community";

// export default function CommunityPage() {
//   return (
//     <div className=" min-h-screen">
//       <Community />
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import CommunityList from "@/components/Community/CommunityList";
import CommunityFilters from "@/components/Community/CommunityFilters";
import CommunityHeader from "@/components/Community/CommunityHeader";
import axios from "axios";

export default function CommunityPage() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations");
        setLocations(response.data);
        setFilteredLocations(response.data);
      } catch (error) {
        console.error(" Error fetching locations:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="container mx-auto px-6 
    py-16
    ">
      {/* Header Section */}
      <CommunityHeader />

      {/* Filters & Search */}
      <CommunityFilters locations={locations} setFilteredLocations={setFilteredLocations} />

      {/* Location List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading locations...</p>
      ) : (
        <CommunityList locations={filteredLocations} />
      )}
    </div>
  );
}
