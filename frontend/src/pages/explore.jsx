// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// export default function Explore() {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/locations");
//         console.log("🔍 API Response:", response.data);
//         setLocations(response.data);
//       } catch (error) {
//         console.error("❌ Failed to fetch locations:", error.response ? error.response.data : error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLocations();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Explore Locations</h1>

//       {/* Google Map */}
//       <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//         <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 27.7172, lng: 85.3240 }} zoom={8}>
//           {locations.map((location) => (
//             <Marker key={location._id} position={{ lat: location.latitude, lng: location.longitude }} />
//           ))}
//         </GoogleMap>
//       </LoadScript>

//       {/* Location Cards */}
//       {loading ? (
//         <p className="text-center text-gray-600 mt-4">Loading locations...</p>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-6 mt-8">
//           {locations.map((location) => (
//             <div key={location._id} className="bg-white p-4 rounded-lg shadow-md">
//               {location.images && location.images.length > 0 ? (
//                 <img
//                   src={location.images[0]}
//                   alt={location.name}
//                   className="w-full h-40 rounded-lg object-cover"
//                 //   onError={(e) => { e.target.src = "/default-placeholder.png"; }} // ✅ Show fallback image if broken
//                 />
//               ) : (
//                 <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center">
//                   <span className="text-gray-500">No Image</span>
//                 </div>
//               )}
//               <h3 className="text-xl font-semibold mt-2">{location.name}</h3>
//               <p className="text-gray-600 mt-1">{location.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "450px",
};

export default function Explore() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/locations");
        console.log("🔍 API Response:", response.data);
        setLocations(response.data);
      } catch (error) {
        console.error(
          "❌ Failed to fetch locations:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-dark mb-8">
        Explore Locations
      </h1>

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 27.7172, lng: 85.324 }}
            zoom={8}
          >
            {locations.map((location) => (
              <Marker key={location._id} position={{ lat: location.latitude, lng: location.longitude }} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Location Cards */}
      {loading ? (
        <p className="text-center text-gray-600 mt-6">Loading locations...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {locations.map((location) => (
            <div
              key={location._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-2"
            >
              {/* Image Section */}
              {location.images && location.images.length > 0 ? (
                <img
                  src={location.images[0]}
                  alt={location.name}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-dark">{location.name}</h3>
                <p className="text-gray-600 mt-2">{location.description}</p>

                {/* Category and Location Info */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {location.category || "General"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    📍 {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
