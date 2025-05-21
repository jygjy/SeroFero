"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import { Search, MapPin, List, MapIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useRouter } from "next/router"

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const categories = ["All", "Adventure", "Hiking", "Camping", "Wildlife", "Food & Culture", "Himalayan Escapes"]

export default function Explore() {
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [viewMode, setViewMode] = useState("map")
  const [mapCenter, setMapCenter] = useState({ lat: 27.7172, lng: 85.324 })
  const [mapZoom, setMapZoom] = useState(8)

  const [user, setUser] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setHydrated(true)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Read category from URL query parameter on mount
    const { category } = router.query;
    if (category && typeof category === 'string') {
      // Find the exact category string from the categories array (case-insensitive match)
      const matchedCategory = categories.find(cat => cat.toLowerCase() === category.toLowerCase());
      if (matchedCategory) {
         setSelectedCategory(matchedCategory); // Set the state to the matched category
      } else {
        setSelectedCategory("All"); // Default to All if category parameter is invalid
      }
    } else {
       setSelectedCategory("All"); // Default to All if no category parameter
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations")
        console.log("🔍 API Response:", response.data)
        setLocations(response.data)
        setFilteredLocations(response.data)
      } catch (error) {
        console.error(" Failed to fetch locations:", error.response ? error.response.data : error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [router.query])

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const filtered = locations.filter((location) => {
      const matchesSearch = location.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                          location.description.toLowerCase().includes(lowerCaseSearchTerm) // Search in description too

      const matchesCategory = selectedCategory === "All" || (location.category && location.category.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })
    setFilteredLocations(filtered)
  }, [locations, searchTerm, selectedCategory])

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
    setMapCenter({ lat: location.latitude, lng: location.longitude })
    setMapZoom(12)
  }

  const handleMarkerClick = (location) => {
    setSelectedLocation(location)
  }

  const handleInfoWindowClose = () => {
    setSelectedLocation(null)
  }

  if (!hydrated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        setUser={setUser}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      {/* Header Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Explore Amazing Locations</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Discover beautiful places, historical sites, and natural wonders around Nepal
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search locations..."
                className="pl-10 bg-white/90 border-0 text-gray-800 placeholder-gray-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/90 border-0 text-gray-800">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-700">
            <span className="font-medium">{filteredLocations.length}</span> locations found
          </div>
          <Tabs defaultValue="map" value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <MapIcon size={16} />
                <span className="hidden sm:inline">Map View</span>
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <List size={16} />
                <span className="hidden sm:inline">Grid View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading amazing locations...</p>
          </div>
        ) : (
          <>
            {/* Map View */}
            <div className={viewMode === "map" ? "block" : "hidden"}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={mapZoom}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                      mapTypeControl: true,
                      streetViewControl: true,
                      fullscreenControl: true,
                    }}
                  >
                    {filteredLocations.map((location) => {
                      // Safely get the animation value
                      const animationValue =
                        typeof window !== "undefined" &&
                        window.google &&
                        window.google.maps &&
                        window.google.maps.Animation
                          ? window.google.maps.Animation.DROP
                          : undefined;
                      return (
                        <Marker
                          key={location._id}
                          position={{ lat: location.latitude, lng: location.longitude }}
                          onClick={() => handleMarkerClick(location)}
                          animation={animationValue}
                        />
                      );
                    })}

                    {selectedLocation && (
                      <InfoWindow
                        position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="p-2 max-w-[200px]">
                          <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{selectedLocation.description}</p>
                          <Button
                            variant="link"
                            className="text-xs p-0 h-auto mt-1 text-blue-600"
                            onClick={() => {
                              router.push(`/locations/${selectedLocation._id}`)
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>

              {/* Horizontal Scrollable Cards in Map View */}
              <div className="mt-6 overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {filteredLocations.map((location) => (
                    <div
                      key={location._id}
                      className={`flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 border-2 
                        ${selectedLocation?._id === location._id ? "border-blue-500 scale-[1.02]" : "border-transparent hover:border-blue-200"}`}
                      onClick={() => handleLocationClick(location)}
                    >
                      {location.images && location.images.length > 0 ? (
                        <img
                          src={location.images[0] || "/placeholder.svg"}
                          alt={location.name}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{location.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{location.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant="secondary">{location.category || "General"}</Badge>
                          <span className="text-gray-500 text-xs flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid View */}
            <div className={viewMode === "grid" ? "block" : "hidden"}>
              {filteredLocations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("All")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLocations.map((location) => (
                    <Card
                      key={location._id}
                      id={`location-${location._id}`}
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative h-56">
                        {location.images && location.images.length > 0 ? (
                          <img
                            src={location.images[0] || "/placeholder.svg"}
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image Available</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                            {location.category || "General"}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <p className="text-gray-600 line-clamp-3">{location.description}</p>
                      </CardContent>

                      <CardFooter className="flex justify-between pt-0">
                        <span className="text-gray-500 text-sm flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200"
                          onClick={() => {
                            setViewMode("map")
                            setSelectedLocation(location)
                            setMapCenter({ lat: location.latitude, lng: location.longitude })
                            setMapZoom(12)
                          }}
                        >
                          View on map
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}