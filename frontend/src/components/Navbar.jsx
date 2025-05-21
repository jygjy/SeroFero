import Link from "next/link";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import NotificationIcon from "./NotificationIcon";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navbar({ user, setUser, isDropdownOpen, setIsDropdownOpen }) {
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    if (router.pathname === '/') {
      // If we're on the home page, scroll to the target section
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home page and scroll
      router.push('/' + targetId);
    }
  };

  if (!hydrated) return null;

  return (
    <nav className="bg-white text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">SeroFero</h1>
        <div className="space-x-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/explore" className="hover:text-primary">
            Explore
          </Link>
          <a 
            href="#about-section" 
            onClick={(e) => handleNavLinkClick(e, '#about-section')}
            className="hover:text-primary cursor-pointer"
          >
            About us
          </a>
          <a 
            href="#footer-section" 
            onClick={(e) => handleNavLinkClick(e, '#footer-section')}
            className="hover:text-primary cursor-pointer"
          >
            Contact us
          </a>
          <Link href="/community" className="hover:text-primary">
            Our Community
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationIcon />
          <button onClick={toggleDarkMode} className="text-xl hover:text-primary dark:hover:text-blue-400">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          <div className="relative">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.profileImage ? (
                    <img
                      src={
                        user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `http://localhost:5001${user.profileImage}`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-300" />
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        setUser(null);
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-4 py-2 hover:text-primary">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}