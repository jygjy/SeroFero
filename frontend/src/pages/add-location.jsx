"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { MapPin, ImagePlus, Upload, X, Info, CheckCircle, Loader2, MapIcon, FileText, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader,   CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "0.5rem",
}

const center = { lat: 27.7172, lng: 85.324 } // Default to Kathmandu

const AddLocation = () => {
  const [location, setLocation] = useState({
    name: "",
    description: "",
    category: "",
  })
  const [images, setImages] = useState([])
  const [position, setPosition] = useState(center)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles])
    },
  })

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value })
  }

  const handleMapClick = (event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: "", type: "" })
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      Object.entries(location).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Append latitude & longitude from map
      formData.append("latitude", position.lat)
      formData.append("longitude", position.lng)

      // Append images
      if (images.length === 0) {
        setMessage({
          text: "Please upload at least one image of the location.",
          type: "error",
        })
        setLoading(false)
        return
      }

      images.forEach((file) => {
        formData.append("images", file)
      })

      await axios.post("http://localhost:5001/api/locations/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setMessage({
        text: "Location submitted successfully! Redirecting you to the community page...",
        type: "success",
      })
      setTimeout(() => router.push("/community"), 2000)
    } catch (error) {
      setMessage({
        text: `Failed to add location: ${error.response?.data?.message || error.message}`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 py-12 px-4 sm:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
  <h2 className="text-3xl font-bold tracking-tight">Add New Location</h2>
  <div className="text-indigo-100">Share your favorite places with the community</div>
</CardHeader>

        <CardContent className="p-6 sm:p-8">
          {message.text && (
            <Alert
              className={`mb-6 ${message.type === "error" ? "bg-red-50 text-red-800 border-red-200" : "bg-green-50 text-green-800 border-green-200"}`}
            >
              <div className="flex items-center gap-2">
                {message.type === "error" ? <Info className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                  <FileText className="h-4 w-4 text-indigo-600" /> Location Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter the name of this location"
                  onChange={handleChange}
                  required
                  className="w-full transition-all focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                  <FileText className="h-4 w-4 text-indigo-600" /> Description
                </Label>
                <Textarea
  id="description"
  name="description"
  placeholder="Tell us about this place. What makes it special?"
  onChange={handleChange}
  required
  className="w-full transition-all focus-visible:ring-indigo-500 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2 text-base font-medium">
                  <Tag className="h-4 w-4 text-indigo-600" /> Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="How would you categorize this place? (e.g., Hiking, Restaurant, Historical)"
                  onChange={handleChange}
                  required
                  className="w-full transition-all focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <Separator />

            {/* Map Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium text-indigo-700">
                <MapIcon className="h-5 w-5" />
                <h3>Pin Location on Map</h3>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={position} zoom={10} onClick={handleMapClick}>
                    <Marker position={position} />
                  </GoogleMap>
                </LoadScript>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <span>
                  Selected Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium text-indigo-700">
                <ImagePlus className="h-5 w-5" />
                <h3>Upload Images</h3>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 mx-auto text-indigo-500 mb-3" />
                <p className="text-gray-700 font-medium">
                  {isDragActive ? "Drop the images here..." : "Drag & drop images here, or click to select files"}
                </p>
                <p className="text-gray-500 text-sm mt-2">Upload high-quality images to showcase this location</p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">{images.length} image(s) selected</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <CardFooter className="px-0 pt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Submit Location
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddLocation
