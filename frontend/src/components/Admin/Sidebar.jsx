import { FaTachometerAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
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
  );
}
