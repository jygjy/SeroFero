import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, locations: 0, pending: 0, approvedLocations: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Total Users */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <FaUsers className="text-4xl text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        {/* Total Locations */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <FaMapMarkerAlt className="text-4xl text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Total Locations</h3>
          <p className="text-3xl font-bold">{stats.locations}</p>
        </div>
        {/* Pending Approvals */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <FaClock className="text-4xl text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        {/* Approved Locations */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <FaCheckCircle className="text-4xl text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Approved Locations</h3>
          <p className="text-3xl font-bold">{stats.approvedLocations}</p>
        </div>
      </div>
    </div>
  );
}
