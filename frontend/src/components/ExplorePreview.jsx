"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Star, MapPin, ChevronRight, Heart, Bookmark, ChevronLeft, ChevronRightIcon, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Import categories from Categories component
const categories = [
  "Adventure",
  "Hiking",
  "Camping",
  "Wildlife",
  "Food & Culture",
  "Himalayan Escapes"
]

// Maximum number of locations to show in the "All" category
const MAX_ALL_LOCATIONS = 8

export default function ExplorePreview() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const { toast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations")
        const locationsData = response.data;

        // Fetch like and bookmark status for each location
        const token = localStorage.getItem('token');
        const locationsWithStatus = await Promise.all(locationsData.map(async (loc) => {
          if (!token) { // If no token, assume not liked/bookmarked
            return { ...loc, isFavorite: false, isBookmarked: false };
          }
          try {
            const likeRes = await axios.get(`http://localhost:5001/api/locations/${loc._id}/check-like`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const bookmarkRes = await axios.get(`http://localhost:5001/api/locations/${loc._id}/check-wishlist`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { ...loc, isFavorite: likeRes.data.isLiked, isBookmarked: bookmarkRes.data.isBookmarked };
          } catch (error) {
            console.error(`Failed to fetch status for location ${loc._id}:`, error.message);
             // If fetching status fails (e.g., 404, 500), default to false
            return { ...loc, isFavorite: false, isBookmarked: false };
          }
        }));

        setLocations(locationsWithStatus);

      } catch (error) {
        console.error(" Failed to fetch locations:", error.message)
        toast({
          title: "Error",
          description: "Failed to load locations. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, []) // Dependency array includes empty array, runs once on mount

  // Toggle favorite status
  const toggleFavorite = async (locationId, locationName) => {
    // Find the location in the current state
    const locationIndex = locations.findIndex(loc => loc._id === locationId);
    if (locationIndex === -1) return;

    const isFavorite = locations[locationIndex].isFavorite;

    // Optimistic UI update - update the specific location object
    setLocations(prevLocations =>
      prevLocations.map(loc =>
        loc._id === locationId ? { ...loc, isFavorite: !isFavorite } : loc
      )
    );

    // Show toast notification (optimistic)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${locationName} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
      variant: isFavorite ? "default" : "default", // Adjust variants as needed
    })

    try {
      // Update backend using the toggle endpoint
      await axios.post(
        `http://localhost:5001/api/locations/${locationId}/like`,
        {}, // Backend toggle logic might not need a body, depends on implementation
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // If backend returns updated counts or status, you could update state here
      // For now, we rely on the optimistic update being correct.
    } catch (error) {
      console.error("Failed to update favorites:", error.message)

      // Revert UI if backend update fails and it's not an auth error
       if (error.response?.status !== 401) {
          // Revert optimistic update for the specific location
           setLocations(prevLocations =>
               prevLocations.map(loc =>
                   loc._id === locationId ? { ...loc, isFavorite: isFavorite } : loc // Revert to previous state
               )
           );
          toast({
            title: "Error",
            description: "Failed to update favorites. Please try again.",
            variant: "destructive",
          })
       } else {
           // Handle authentication error specifically if needed (e.g., prompt login)
            toast({
                title: "Authentication required",
                description: "Please log in to like locations.",
                variant: "default",
            });
            // Revert optimistic update if auth failed
             setLocations(prevLocations =>
               prevLocations.map(loc =>
                   loc._id === locationId ? { ...loc, isFavorite: isFavorite } : loc // Revert to previous state
               )
           );
       }
    }
  }

  // Toggle bookmark status
  const toggleBookmark = async (locationId, locationName) => {
     // Find the location in the current state
    const locationIndex = locations.findIndex(loc => loc._id === locationId);
    if (locationIndex === -1) return;

    const isBookmarked = locations[locationIndex].isBookmarked;

    // Optimistic UI update - update the specific location object
    setLocations(prevLocations =>
      prevLocations.map(loc =>
        loc._id === locationId ? { ...loc, isBookmarked: !isBookmarked } : loc
      )
    );

    // Show toast notification (optimistic)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${locationName} has been ${isBookmarked ? "removed from" : "added to"} your bookmarks.`,
      variant: isBookmarked ? "default" : "default", // Adjust variants as needed
    })

    try {
      // Update backend using the toggle endpoint
      await axios.post(
        `http://localhost:5001/api/locations/${locationId}/wishlist`,
         {}, // Backend toggle logic might not need a body
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
       // If backend returns updated counts or status, you could update state here
       // For now, we rely on the optimistic update being correct.
    } catch (error) {
      console.error("Failed to update bookmarks:", error.message)

      // Revert UI if backend update fails and it's not an auth error
      if (error.response?.status !== 401) {
          // Revert optimistic update for the specific location
           setLocations(prevLocations =>
               prevLocations.map(loc =>
                   loc._id === locationId ? { ...loc, isBookmarked: isBookmarked } : loc // Revert to previous state
               )
           );
          toast({
            title: "Error",
            description: "Failed to update bookmarks. Please try again.",
            variant: "destructive",
          })
      } else {
           // Handle authentication error specifically if needed (e.g., prompt login)
           toast({
               title: "Authentication required",
               description: "Please log in to bookmark locations.",
               variant: "default",
           });
           // Revert optimistic update if auth failed
           setLocations(prevLocations =>
               prevLocations.map(loc =>
                   loc._id === locationId ? { ...loc, isBookmarked: isBookmarked } : loc // Revert to previous state
               )
           );
      }
    }
  }

  // Filter locations by category (tab)
  const filteredLocations =
    activeTab === "All"
      ? locations.slice(0, MAX_ALL_LOCATIONS)
      : locations.filter((loc) => loc.category && loc.category.trim().toLowerCase() === activeTab.trim().toLowerCase())

  // Helper to calculate average rating
  const getAverageRating = (reviews = []) => {
    if (!reviews.length) return null
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }

  const openDescriptionModal = (location) => {
    setSelectedLocation(location);
  };

  const closeDescriptionModal = () => {
    setSelectedLocation(null);
  };

  return (
    <TooltipProvider>
      <section className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Explore stays in popular destinations</h2>
            <p className="text-gray-500 max-w-2xl">
              Discover handpicked accommodations in the most sought-after locations around the world
            </p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0 text-sm font-medium text-primary flex items-center group">
            View all destinations
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Improved Tabs with All option */}
        {loading ? (
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        ) : (
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
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <LocationCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLocations.map((location) => {
                const avgRating = getAverageRating(location.reviews)
                const reviewCount = location.reviews ? location.reviews.length : 0
                const isFavorite = location.isFavorite
                const isBookmarked = location.isBookmarked

                return (
                  <LocationCard
                    key={location._id}
                    location={location}
                    avgRating={avgRating}
                    reviewCount={reviewCount}
                    isFavorite={isFavorite}
                    isBookmarked={isBookmarked}
                    onToggleFavorite={() => toggleFavorite(location._id, location.name)}
                    onToggleBookmark={() => toggleBookmark(location._id, location.name)}
                    onReadMore={() => openDescriptionModal(location)}
                  />
                )
              })}
            </div>

            {/* Show "View all" button only for All category when there are more locations */}
            {activeTab === "All" && locations.length > MAX_ALL_LOCATIONS && (
              <div className="flex justify-center mt-8">
                <Link
                  href="/explore"
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  View all {locations.length} locations
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Description Modal */}
      <Dialog open={selectedLocation !== null} onOpenChange={(open) => !open && closeDescriptionModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedLocation?.name}</DialogTitle>
          </DialogHeader>

          {selectedLocation?.images && selectedLocation.images.length > 0 && (
             <div className="relative h-48 w-full overflow-hidden rounded-lg mt-2">
                <img
                  src={selectedLocation.images[0] || "/placeholder.jpg"}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                 />
             </div>
          )}

          <DialogDescription className="text-base text-gray-700 mt-2">
            {selectedLocation?.description || "No description available."}
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={closeDescriptionModal}>
              Close
            </Button>
             {/* Optional: Add a link to the full location page */}
             {selectedLocation && (
                 <Link href={`/locations/${selectedLocation._id}`} passHref>
                      <Button>View Location Page</Button>
                 </Link>
             )}
          </div>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  )
}

function LocationCard({
  location,
  avgRating,
  reviewCount,
  isFavorite,
  isBookmarked,
  onToggleFavorite,
  onToggleBookmark,
  onReadMore,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const hasMultipleImages = location.images && location.images.length > 1

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev === location.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? location.images.length - 1 : prev - 1))
    }
  }

  return (
    <div className="relative group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Link
        href={`/locations/${location._id}`}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col h-full block"
      >
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={location.images?.[currentImageIndex] || "/placeholder.jpg"}
              alt={location.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Image slider navigation */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 backdrop-blur-sm transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 backdrop-blur-sm transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>

              {/* Image indicator dots */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {location.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentImageIndex === index ? "bg-white w-3" : "bg-white/60"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

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

          {/* Description and Read More */}
          <div className="relative flex items-end justify-between flex-1">
            <p className="text-gray-600 text-sm line-clamp-2 flex-grow pr-2">
              {location.description || "No description available for this beautiful location."}
            </p>

            {location.description && location.description.length > 100 && (
                 <button
                    className="text-primary hover:text-primary/80 text-xs font-medium flex items-center flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                       onReadMore();
                    }}
                  >
                    Read more <ExternalLink className="h-3 w-3 ml-0.5" />
                  </button>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 text-xs">
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Link>

      {/* Action buttons - Like and Bookmark */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {/* Like button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite()
          }}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-all
            ${isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/80 text-gray-700 hover:bg-white"}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
        </button>

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleBookmark()
          }}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-all
            ${isBookmarked ? "bg-primary text-white hover:bg-primary/90" : "bg-white/80 text-gray-700 hover:bg-white"}`}
          aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-white" : ""}`} />
        </button>
      </div>
    </div>
  )
}
function LocationCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-end">
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}

