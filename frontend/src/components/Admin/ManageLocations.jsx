import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/locations/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(response.data);
      } catch (error) {
        setError("Error fetching locations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Send the 'approved' status as true
      await axios.put(
        `http://localhost:5001/api/locations/approve/${id}`,
        { approved: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Remove the location from the list once it is approved
      setLocations(locations.filter((loc) => loc._id !== id));
    } catch (error) {
      setError("Error approving location. Please try again later.");
    }
  };

  const handleReject = async (id) => {
    try {
      // Send the 'approved' status as false for rejection
      await axios.put(
        `http://localhost:5001/api/locations/approve/${id}`,
        { approved: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Remove the rejected location from the list
      setLocations(locations.filter((loc) => loc._id !== id));
    } catch (error) {
      setError("Error rejecting location. Please try again later.");
    }
  };

  if (loading) return <p>Loading locations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Locations</h2>
      <ul>
        {locations.map((loc) => (
          <li
            key={loc._id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{loc.name}</h3>
              <p>{loc.description}</p>
              <p>Status: {loc.approved ? "Approved" : "Pending"}</p>{" "}
              {/* Display status */}
            </div>
            <div className="flex space-x-2">
              {!loc.approved && (
                <>
                  <button
                    onClick={() => handleApprove(loc._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(loc._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
