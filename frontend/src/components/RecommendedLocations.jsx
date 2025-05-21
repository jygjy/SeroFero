"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import Link from "next/link"
import { Star, MapPin, ChevronLeft, ChevronRight, Badge } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Image slider component for location cards
function ImageSlider({ images, name }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    },
    [images.length],
  )

  const prevImage = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    },
    [images.length],
  )

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex] || "/placeholder.jpg"}
        alt={`${name} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300"
      />

      {/* Image counter indicator */}
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-all"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default function RecommendedLocations() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("All")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setRecommendations([])
          setLoading(false)
          return
        }
        const response = await axios.get("http://localhost:5001/api/locations/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        const data = response.data || []
        setRecommendations(data)

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            data
              .map((loc) => loc.category)
              .filter(Boolean)
              .map((cat) => cat.trim()),
          ),
        ]
        setCategories(["All", "Popular", ...uniqueCategories])
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load recommendations")
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  // Filter recommendations by category
  const filteredRecommendations =
    activeTab === "All"
      ? recommendations
      : activeTab === "Popular"
        ? [...recommendations]
            .sort((a, b) => (b.likes?.length || b.reviews?.length || 0) - (a.likes?.length || a.reviews?.length || 0))
            .slice(0, 8) // Show only top 8 popular locations
        : recommendations.filter(
            (loc) => loc.category && loc.category.trim().toLowerCase() === activeTab.trim().toLowerCase(),
          )

  // Helper to calculate average rating
  const getAverageRating = (reviews = []) => {
    if (!reviews.length) return null
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!recommendations.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No recommendations available yet.</p>
        <p className="text-sm text-gray-500 mt-2">Try exploring more locations to get personalized recommendations!</p>
        <Link href="/explore" className="inline-block mt-4 text-primary hover:text-red-600 underline">
          Explore Locations
        </Link>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        <Link href="/explore" className="text-primary hover:text-red-600 transition-colors">
          See More →
        </Link>
      </div>
      {/* Tabs for categories */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="h-10 bg-muted/50 p-1 overflow-x-auto flex w-full md:w-auto">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="px-4 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecommendations.map((location) => {
          const avgRating = getAverageRating(location.reviews)
          const reviewCount = location.reviews ? location.reviews.length : 0
          return (
            <Link
              href={`/locations/${location._id}`}
              key={location._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col h-full block"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  {location.images && location.images.length > 1 ? (
                    <ImageSlider images={location.images} name={location.name} />
                  ) : (
                    <img
                      src={location.images?.[0] || "/placeholder.jpg"}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                {location.featured && (
                  <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">Featured</Badge>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {location.name}
                  </h3>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-800 text-sm">{avgRating || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {location.latitude !== undefined && location.longitude !== undefined
                      ? `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`
                      : location.region || location.city || "Unknown Location"}
                    {location.country ? `, ${location.country}` : ""}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                  {location.description || "No description available for this beautiful location."}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export { ImageSlider };