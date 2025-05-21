"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Helper function to conditionally join classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

const categories = [
  {
    name: "Adventure",
    img: "/adventure.jpg",
    description:
      "Experience thrilling adventures in breathtaking locations. From zip-lining through rainforests to white-water rafting down rapid rivers, our adventure tours will get your adrenaline pumping.",
    activities: ["Zip-lining", "Rafting", "Bungee jumping", "Paragliding"],
  },
  {
    name: "Hiking",
    img: "/hiking.jpg",
    description:
      "Explore scenic trails and enjoy nature on foot. Discover hidden waterfalls, mountain peaks, and breathtaking vistas as you trek through some of the world's most beautiful landscapes.",
    activities: ["Mountain trails", "Forest walks", "Coastal paths", "Canyon exploration"],
  },
  {
    name: "Camping",
    img: "/camping.jpg",
    description:
      "Spend nights under the stars and connect with nature. Our camping experiences range from glamping in luxury tents to authentic wilderness camping for the true outdoor enthusiast.",
    activities: ["Tent camping", "Glamping", "Wilderness survival", "Campfire cooking"],
  },
  {
    name: "Wildlife",
    img: "/wildlife.jpg",
    description:
      "Discover amazing wildlife and their natural habitats. From African safaris to rainforest expeditions, get up close with exotic animals in their natural environments.",
    activities: ["Safari tours", "Bird watching", "Marine life", "Night wildlife spotting"],
  },
  {
    name: "Food & Culture",
    img: "/food and culture.jpg",
    description:
      "Taste local cuisines and immerse in diverse cultures. Learn cooking techniques from local chefs, visit traditional markets, and participate in cultural ceremonies and festivals.",
    activities: ["Cooking classes", "Food tours", "Cultural festivals", "Artisan workshops"],
  },
  {
    name: "Himalayan Escapes",
    img: "/himalayan-escapes.jpg", 
    description:
      "Experience the majestic beauty of Nepal's Himalayas. From serene high-altitude lakes to peaceful monasteries and breathtaking mountain villages, Himalayan Escapes offers an unforgettable adventure beyond the clouds.",
    activities: [
      "Everest Base Camp Trek",
      "Visit Mountain Monasteries",
      "High-altitude Lake Exploration",
      "Scenic Mountain Flights"
    ],
  }
  
]

export default function Categories() {
  const [selected, setSelected] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [visibleItems, setVisibleItems] = useState(4)

  // Handle responsive visible items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1)
      } else if (window.innerWidth < 768) {
        setVisibleItems(2)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3)
      } else {
        setVisibleItems(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleCategoryClick = (category) => {
    setSelected(category)
  }

  const closeModal = () => setSelected(null)

  // Custom slider navigation
  const scrollNext = () => {
    if (sliderRef.current && currentIndex < categories.length - visibleItems) {
      const itemWidth = sliderRef.current.offsetWidth / visibleItems
      sliderRef.current.scrollBy({ left: itemWidth, behavior: "smooth" })
      setCurrentIndex((prev) => Math.min(prev + 1, categories.length - visibleItems))
    }
  }

  const scrollPrev = () => {
    if (sliderRef.current && currentIndex > 0) {
      const itemWidth = sliderRef.current.offsetWidth / visibleItems
      sliderRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" })
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  // Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section className="container mx-auto mt-16 px-6 pb-12">
      {/* Header with gradient underline */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-800">Explore Categories</h2>
          <div className="absolute -bottom-2 left-0 w-3/4 h-1 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full"></div>
        </div>
      </div>

      {/* Custom Slider with Navigation */}
      <div className="relative">
        <div
          className="flex overflow-x-hidden scroll-smooth"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-4 transition-transform duration-300 w-full">
            {categories.map((category, index) => (
              <div
                key={index}
                className={cn(
                  "flex-shrink-0 transition-all duration-300",
                  visibleItems === 1 ? "w-full" : visibleItems === 2 ? "w-1/2" : visibleItems === 3 ? "w-1/3" : "w-1/4",
                )}
              >
                <div
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-72 transform hover:-translate-y-1"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                  <div className="relative h-full w-full">
                    <Image
                      src={category.img || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow-md",
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100",
          )}
          onClick={scrollPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow-md",
            currentIndex >= categories.length - visibleItems ? "opacity-50 cursor-not-allowed" : "opacity-100",
          )}
          onClick={scrollNext}
          disabled={currentIndex >= categories.length - visibleItems}
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </Button>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-1.5">
          {Array.from({ length: Math.ceil(categories.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                Math.floor(currentIndex / visibleItems) === index
                  ? "bg-emerald-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400",
              )}
              onClick={() => {
                if (sliderRef.current) {
                  const newIndex = index * visibleItems
                  setCurrentIndex(newIndex)
                  const itemWidth = sliderRef.current.offsetWidth / visibleItems
                  sliderRef.current.scrollLeft = newIndex * itemWidth
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Modal using Dialog from shadcn/ui */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selected?.name}</DialogTitle>
          </DialogHeader>

          <div className="relative h-48 w-full overflow-hidden rounded-lg mt-2">
            {selected && (
              <Image src={selected.img || "/placeholder.svg"} alt={selected.name} fill className="object-cover" />
            )}
          </div>

          <DialogDescription className="text-base text-gray-700 mt-2">{selected?.description}</DialogDescription>

          {selected?.activities && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Popular Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {selected.activities.map((activity, index) => (
                  <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            {selected && (
              <Link href={`/explore?category=${encodeURIComponent(selected.name)}`} passHref>
                <Button className="bg-emerald-600 hover:bg-emerald-700">View All {selected.name} Tours</Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
