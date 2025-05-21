import Link from "next/link";
import Categories from "../components/Categories";
import ExplorePreview from "@/components/ExplorePreview";
import RecommendedLocations from "@/components/RecommendedLocations";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

import { FaUserCircle ,FaMoon, FaSun} from 'react-icons/fa';
import About from "./about";
import { FaMapMarkerAlt, FaUsers, FaCheckCircle, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import Contact from "./contact";
import NotificationIcon from "../components/NotificationIcon"; // Import NotificationIcon
import Navbar from "../components/Navbar";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    setHydrated(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/locations");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        // handle error
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredLocations([]);
    } else {
      setFilteredLocations(
        locations.filter(loc =>
          loc.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, locations]);

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!hydrated) return null;

  return (
    <div className="bg-background min-h-screen">
      {/* Navbar */}
      <Navbar
        user={user}
        setUser={setUser}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      {/* Hero Section */}
      <header className="container mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-6">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-dark">
            Start <span className="text-primary">Exploring</span> Hidden Places of Nepal
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            Discover breathtaking destinations handpicked by fellow travelers. 
            Connect with a vibrant community, uncover hidden gems, and embark on 
            unforgettable journeys together!
          </p>
          <div className="mt-6">
            <Link
              href="/explore"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Explore Now
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img src="/home.svg" alt="Travel Illustration" className="w-100" />
        </div>
      </header>

      {/* Search Bar */}
      <section className="container mx-auto flex justify-center mt-10">
        <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden w-full max-w-lg">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trip destination"
            className="w-full px-4 py-3 text-dark focus:outline-none"
          />
          <button className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md transition duration-300">
            Search
          </button>
        </div>
      </section>

      {search.trim() !== "" && (
        <div className="container mx-auto px-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => {
                // Calculate average rating
                const reviews = location.reviews || [];
                const avgRating = reviews.length
                  ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                  : "N/A";
                const reviewCount = reviews.length;

                return (
                  <div
                    key={location._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        {location.images && location.images.length > 1 ? (
                          // Optionally, you can use the ImageSlider here if you want
                          <img
                            src={location.images[0]}
                            alt={location.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={location.images?.[0] || "/placeholder.jpg"}
                            alt={location.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        )}
                      </div>
                      {location.featured && (
                        <span className="absolute top-3 left-3 bg-primary/90 text-white px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                          <span className="font-medium text-gray-800 text-sm">{avgRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <svg className="h-3.5 w-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"/></svg>
                        <span className="truncate">
                          {location.region || location.city || "Unknown Region"}
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
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-500">No locations found.</div>
            )}
          </div>
        </div>
      )}

      {/* Categories Section */}
      <Categories />

      {/* Explore Preview Section */}
      <ExplorePreview />

      {/* Recommended Locations */}
      <section className="container mx-auto px-6 py-12">
        <RecommendedLocations />
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose SeroFero?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
            <div className="text-primary text-4xl mb-4 flex justify-center">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              User-Contributed Locations
            </h3>
            <p className="mt-2 text-gray-800">
              Discover hidden gems contributed by travelers like you.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
            <div className="text-primary text-4xl mb-4 flex justify-center">
              <FaUsers />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Community Engagement
            </h3>
            <p className="mt-2 text-gray-800">
              Share reviews, add locations, and interact with fellow travelers.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center transform hover:scale-105 transition duration-300">
            <div className="text-primary text-4xl mb-4 flex justify-center">
              <FaCheckCircle />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Admin Verified Destinations
            </h3>
            <p className="mt-2 text-gray-800">
              Only approved locations are displayed for authenticity.
            </p>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link href="/community" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300">
            Join Our Community
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-darkBlue text-white text-center py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Start Exploring Today!</h2>
          <p className="mt-2 text-lg mb-8">
            Find your next adventure with verified locations.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
