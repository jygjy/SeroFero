// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function Navbar() {
//   const [darkMode, setDarkMode] = useState(false);

//   return (
//     <nav className="bg-white dark:bg-gray-900 shadow-md p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/">
//           <h1 className="text-xl font-bold text-gray-800 dark:text-white">SeroFero</h1>
//         </Link>
//         <div className="space-x-4">
//           <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
//             Explore
//           </Link>
//           <Link href="/add-location" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
//             Add Location
//           </Link>
//           <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
//             Profile
//           </Link>
//         </div>
//         {/* Dark Mode Toggle */}
//         <button onClick={() => setDarkMode(!darkMode)} className="text-gray-700 dark:text-white">
//           {darkMode ? "☀️" : "🌙"}
//         </button>
//       </div>
//     </nav>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [hydrated, setHydrated] = useState(false); // Fixes SSR mismatch
//   const router = useRouter();

//   useEffect(() => {
//     setHydrated(true); // Ensure hydration runs only on the client
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     router.push("/login");
//   };

//   if (!hydrated) return null; // Fix: Prevents SSR mismatches

//   return (
//     <nav className="bg-gray-800 text-white p-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold text-white">
//           SeroFero
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6">
//           <Link href="/community" className="hover:text-blue-400">Community</Link>
//           {user ? (
//             <div className="relative group">
//               <button className="flex items-center space-x-2">
//                 <FaUserCircle className="text-xl" />
//                 <span>{user.name}</span>
//               </button>
//               {/* Dropdown Menu */}
//               <div className="absolute right-0 hidden group-hover:block mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg">
//                 <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
//                 <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Link href="/register" className="hover:text-blue-400">Register</Link>
//               <Link href="/login" className="hover:text-blue-400">Login</Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl">
//           {menuOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-gray-900 text-white p-4 space-y-3">
//           <Link href="/community" className="block">Community</Link>
//           {user ? (
//             <>
//               <Link href="/profile" className="block">Profile</Link>
//               <button onClick={handleLogout} className="block w-full text-left">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link href="/register" className="block">Register</Link>
//               <Link href="/login" className="block">Login</Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!hydrated) return null; // Prevents hydration issues

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          SeroFero
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/community" className="hover:text-blue-400">Community</Link>
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <FaUserCircle className="text-xl" />
                <span>{user.name}</span>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 hidden group-hover:block mt-2 w-48 bg-white dark:bg-gray-800 dark:text-white text-gray-900 rounded-lg shadow-lg">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/register" className="hover:text-blue-400">Register</Link>
              <Link href="/login" className="hover:text-blue-400">Login</Link>
            </>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="text-xl mx-4">
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4 space-y-3">
          <Link href="/community" className="block">Community</Link>
          {user ? (
            <>
              <Link href="/profile" className="block">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/register" className="block">Register</Link>
              <Link href="/login" className="block">Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
