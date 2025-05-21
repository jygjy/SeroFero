"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Heart, Bookmark, MapPin, Star, ArrowLeft, Share2, ChevronLeft, ChevronRightIcon } from "lucide-react"
import ReviewSection from "@/components/ReviewSection"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LocationPage() {
  const params = useParams()
  const id = params?.id; // Get location ID from the URL using App Router
  const [location, setLocation] = useState(null)
  const [liked, setLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userChecked, setUserChecked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return

    const fetchLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/locations/${id}`)
        setLocation(response.data)
        console.log("Location images data:", response.data.images);

        setUserChecked(true)
      } catch (error) {
        console.error("Error fetching location:", error.message)
        toast({
          title: "Error",
          description: "Failed to load location details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchBookmarkStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsBookmarked(false)
          return
        }

        const res = await axios.get(`http://localhost:5001/api/locations/${id}/check-wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsBookmarked(res.data.isBookmarked)
      } catch (error) {
        console.error("Error checking bookmark status:", error.message)
        setIsBookmarked(false)
      }
    }

    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLiked(false);
          return;
        }
        const res = await axios.get(`http://localhost:5001/api/locations/${id}/check-like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(res.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error.message);
        setLiked(false);
      }
    };

    fetchLocation()
    fetchBookmarkStatus()
    fetchLikeStatus();
  }, [id, toast])

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to bookmark locations",
          variant: "default",
        })
        return
      }

      const response = await axios.post(
        `http://localhost:5001/api/locations/${id}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Only update state if the API call was successful
      if (response.status === 200) {
        setIsBookmarked(!isBookmarked)
        toast({
          title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
          description: `${location?.name || "Location"} has been ${isBookmarked ? "removed from" : "added to"} your bookmarks.`,
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message)
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to like locations",
          variant: "default",
        })
        return
      }

      const response = await axios.post(
        `http://localhost:5001/api/locations/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Only update state if the API call was successful
      if (response.status === 200) {
        setLiked(!liked)
        toast({
          title: liked ? "Like removed" : "Location liked!",
          description: `${location?.name || "Location"} has been ${liked ? "unliked" : "liked"}.`,
        })
      }
    } catch (error) {
      console.error("Error liking location:", error.message)
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareLocation = () => {
    if (navigator.share) {
      navigator
        .share({
          title: location?.name || "Check out this location",
          text: location?.description || "I found this amazing place!",
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: "Shared successfully",
            description: "Location has been shared",
          })
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Location link copied to clipboard",
      })
    }
  }

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (location?.images && location.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === location.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (location?.images && location.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? location.images.length - 1 : prev - 1))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <Skeleton className="w-full h-72" />
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-6">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="bg-red-50 rounded-2xl shadow-md p-8 border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Location Not Found</h2>
          <p className="text-gray-700 mb-4">The location you're looking for doesn't exist or has been removed.</p>
          <Link href="/locations">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Locations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Back button */}
      <Link
        href="/community"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to all locations</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {/* Image gallery with overlay */}
        <div className="relative group">
          <img
            src={location.images?.[currentImageIndex] || "/placeholder.svg?height=400&width=800"}
            alt={location.name}
            className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Image slider navigation */}
          {location?.images && location.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>

              {/* Image indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {location.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index ? "bg-white w-4" : "bg-white/60"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Category badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {location.categories?.map((category, index) => (
              <Badge key={index} variant="secondary" className="bg-white/90 text-gray-800 hover:bg-white">
                {category}
              </Badge>
            ))}
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center bg-white/90 text-yellow-600 px-3 py-1.5 rounded-full shadow-sm font-medium">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1.5" />
              <span>{location.rating || "4.5"}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{location.name}</h1>

          {/* Location coordinates with map pin */}
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="text-rose-500 h-5 w-5 mr-2" />
            <span className="font-medium">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>

          {/* Description with better typography */}
          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">{location.description}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-100 pt-6">
            <div className="flex space-x-4">
              <Button
                onClick={toggleLike}
                variant="outline"
                size="lg"
                className={`transition-all duration-200 ${liked ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100" : ""}`}
              >
                {liked ? (
                  <Heart className="h-5 w-5 mr-2 fill-rose-500 text-rose-500" />
                ) : (
                  <Heart className="h-5 w-5 mr-2" />
                )}
                {liked ? "Liked" : "Like"}
              </Button>

              <Button
                onClick={toggleBookmark}
                variant="outline"
                size="lg"
                className={`transition-all duration-200 ${isBookmarked ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100" : ""}`}
              >
                {isBookmarked ? (
                  <Bookmark className="h-5 w-5 mr-2 fill-blue-500 text-blue-500" />
                ) : (
                  <Bookmark className="h-5 w-5 mr-2" />
                )}
                {isBookmarked ? "Saved" : "Save"}
              </Button>

              <Button onClick={shareLocation} variant="outline" size="lg">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
        <ReviewSection locationId={id} />
      </div>
    </div>
  )
}
