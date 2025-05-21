import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/locations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLocations(locations.filter((loc) => loc._id !== id));
    } catch (error) {
      setError("Error deleting location. Please try again later.");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5001/api/locations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedLocation(response.data);
    } catch (error) {
      setError("Error fetching location details.");
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
              <p>Status: {loc.approved ? "Approved" : "Pending"}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(loc._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                View Details
              </button>
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
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(loc._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-2">{selectedLocation.name}</h3>
            <p>{selectedLocation.description}</p>
            <p>Category: {selectedLocation.category}</p>
            <p>Status: {selectedLocation.approved ? "Approved" : "Pending"}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLocation.images?.map((img, idx) => (
                <img key={idx} src={img} alt="" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
