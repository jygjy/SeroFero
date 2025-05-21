import { FaTachometerAlt, FaMapMarkerAlt, FaUsers, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {user && user.profileImage ? (
            <img
              src={user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:5001${user.profileImage}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mb-2"
            />
          ) : (
            <FaUserCircle className="w-16 h-16 text-gray-400 mb-2" />
          )}
          <div className="font-bold text-lg">{user ? user.name : "Admin"}</div>
          <div className="text-sm text-gray-400">{user ? user.email : ""}</div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li className={`cursor-pointer p-2 rounded-lg ${activeTab === "dashboard" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("dashboard")}>
            <FaTachometerAlt className="inline-block mr-2" /> Dashboard
          </li>
          <li className={`cursor-pointer p-2 rounded-lg ${activeTab === "manage-locations" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("manage-locations")}>
            <FaMapMarkerAlt className="inline-block mr-2" /> Manage Locations
          </li>
          <li className={`cursor-pointer p-2 rounded-lg ${activeTab === "manage-users" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("manage-users")}>
            <FaUsers className="inline-block mr-2" /> Manage Users
          </li>
        </ul>
      </div>
      {/* Logout Button at the bottom */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
      >
        <FaSignOutAlt className="inline-block" /> Logout
      </button>
    </div>
  );
}
