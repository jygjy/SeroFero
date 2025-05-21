"use client"
import { useState, useEffect } from "react"
import CommunityList from "@/components/Community/CommunityList"
import CommunityFilters from "@/components/Community/CommunityFilters"
import CommunityHeader from "@/components/Community/CommunityHeader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import axios from "axios"
import { Loader2, MapPin, Users, Map } from "lucide-react"

export default function CommunityPage() {
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("Newest First")
  
  // Add state for user and dropdown
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false); // To handle localStorage hydration

  // State for dynamic stats
  const [communityStats, setCommunityStats] = useState({
    totalLocations: 0,
    totalMembers: "N/A",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Hydrate state from localStorage on mount
    setHydrated(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations")
        setLocations(response.data)
        setFilteredLocations(response.data)
      } catch (error) {
        console.error(" Error fetching locations:", error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  // useEffect for fetching community stats dynamically
  useEffect(() => {
    const fetchCommunityStats = async () => {
      try {
        setLoadingStats(true);
        // Fetch from the adjusted backend endpoint
        const response = await axios.get("http://localhost:5001/api/community/stats");
        setCommunityStats(response.data);
      } catch (error) {
        console.error("Error fetching community stats:", error);
        // Fallback or error state if fetching fails
        setCommunityStats({
          totalLocations: locations.length, // Fallback to locations count
          totalMembers: "Error",
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchCommunityStats();
  }, [locations]); // Depend on locations for fallback count

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...locations]

    // Tab filtering
    if (activeTab === "popular") {
      filtered = filtered.filter(loc => loc.popular || loc.isPopular)
    } else if (activeTab === "recent") {
      filtered = filtered
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
    }

    // Sorting
    if (sortOption === "Newest First") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortOption === "Oldest First") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortOption === "Alphabetical") {
      filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === "Most Popular") {
      filtered = filtered.slice().sort((a, b) => (b.popularity || b.views || 0) - (a.popularity || b.views || 0))
    }

    setFilteredLocations(filtered)
  }, [locations, activeTab, sortOption])

  // Stats for the community - uses dynamic data
  const stats = [
    {
      icon: <MapPin className="h-6 w-6 text-rose-500" />,
      value: loadingStats ? "..." : communityStats.totalLocations,
      label: "Locations",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: loadingStats ? "..." : communityStats.totalMembers,
      label: "Community Members",
    },
  ]

  // Don't render until hydrated to avoid mismatch with localStorage theme
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar 
        user={user}
        setUser={setUser}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      {/* Hero Section */}
      <div className="relative text-gray-800 overflow-hidden py-16">
        <div className="container mx-auto px-6 relative z-10">
          {/* Header Section */}
          <CommunityHeader />

          {/* Stats Section */}
          {loadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"> {/* Adjusted grid columns */}
              {[1, 2].map(i => ( // Render 2 skeleton items
                <div key={i} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 flex items-center space-x-4 border border-gray-200 animate-pulse">
                   <div className="p-3 rounded-full bg-gray-300"><div className="w-6 h-6"></div></div> {/* Placeholder for icon */}
                   <div>
                     <div className="h-8 bg-gray-300 rounded w-16 mb-1"></div> {/* Placeholder for value */}
                     <div className="h-4 bg-gray-300 rounded w-24"></div> {/* Placeholder for label */}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"> {/* Adjusted grid columns */}
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 flex items-center space-x-4 border border-gray-200 hover:bg-white/80 transition duration-300"
                >
                  <div className="p-3 rounded-full bg-gray-200">{stat.icon}</div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Locations
            </button>
            {/* <button
              onClick={() => setActiveTab("popular")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "popular" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Popular
            </button> */}
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "recent" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recently Added
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <CommunityFilters locations={locations} setFilteredLocations={setFilteredLocations} />
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredLocations.length} {filteredLocations.length === 1 ? "Location" : "Locations"} Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select
              className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Alphabetical</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Location List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Discovering amazing locations...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              We couldn't find any locations matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setFilteredLocations(locations)}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <CommunityList locations={filteredLocations} />

            {/* Pagination */}
            {filteredLocations.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    8
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    9
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Location Section with supportive text */}
      <div className="bg-gray-50 border-t border-gray-100 mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Discoveries</h2>
            <p className="text-lg text-gray-600 mb-8">
              Know of a hidden gem? Help others explore new places by adding a location to our community database.
            </p>
            <a href="/add-location" className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md">
              Add New Location
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}