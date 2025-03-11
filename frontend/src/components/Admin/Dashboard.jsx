import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, locations: 0, pending: 0 });

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
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-3xl">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total Locations</h3>
          <p className="text-3xl">{stats.locations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Pending Approvals</h3>
          <p className="text-3xl">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
}
