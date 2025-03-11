// "use client"; // ✅ Ensures it runs only on the client side

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const mapContainerStyle = {
//   width: "100%",
//   height: "300px",
// };

// const center = { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu

// const AddLocation = () => {
//   const [location, setLocation] = useState({
//     name: "",
//     description: "",
//     category: "",
//   });
//   const [images, setImages] = useState([]);
//   const [position, setPosition] = useState(center);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => {
//       setImages((prev) => [...prev, ...acceptedFiles]);
//     },
//   });

//   const handleChange = (e) => {
//     setLocation({ ...location, [e.target.name]: e.target.value });
//   };

//   const handleMapClick = (event) => {
//     setPosition({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();

//       Object.entries(location).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       // Append latitude & longitude from map
//       formData.append("latitude", position.lat);
//       formData.append("longitude", position.lng);

//       // Append images
//       if (images.length === 0) {
//         setMessage("Please upload at least one image.");
//         setLoading(false);
//         return;
//       }
//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       const response = await axios.post("http://localhost:5001/api/locations/add", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("Location submitted successfully!");
//       setTimeout(() => router.push("/community"), 1500);
//     } catch (error) {
//       setMessage(error.response?.data.message || "Failed to add location");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center text-primary mb-6">Add a New Location</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             name="name"
//             placeholder="Location Name"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           <input
//             type="text"
//             name="category"
//             placeholder="Category (e.g., Nature, Adventure)"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />

//           {/* Map Section */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Location on Map</h3>
//             <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={position}
//                 zoom={10}
//                 onClick={handleMapClick}
//               >
//                 <Marker position={position} />
//               </GoogleMap>
//             </LoadScript>
//             <p className="text-sm text-gray-600 mt-2">
//               Selected Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
//             </p>
//           </div>

//           {/* Image Upload */}
//           <div
//             {...getRootProps()}
//             className="border-dashed border-2 border-primary p-6 text-center cursor-pointer rounded-lg hover:bg-gray-50 transition"
//           >
//             <input {...getInputProps()} />
//             <p className="text-gray-600">Drag & drop images here, or click to select files</p>
//           </div>
//           {images.length > 0 && (
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <h4 className="text-sm font-semibold text-gray-700">Uploaded Files:</h4>
//               <ul className="mt-2">
//                 {images.map((file, index) => (
//                   <li key={index} className="text-sm text-gray-600">
//                     {file.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-darkBlue"
//             }`}
//           >
//             {loading ? "Uploading..." : "Submit"}
//           </button>
//         </form>

//         {message && <p className="text-center mt-4 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AddLocation;

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { FaMapMarkerAlt, FaImages, FaUpload } from "react-icons/fa";

// const mapContainerStyle = {
//   width: "100%",
//   height: "350px",
// };

// const center = { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu

// const AddLocation = () => {
//   const [location, setLocation] = useState({
//     name: "",
//     description: "",
//     category: "",
//   });
//   const [images, setImages] = useState([]);
//   const [position, setPosition] = useState(center);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => {
//       setImages((prev) => [...prev, ...acceptedFiles]);
//     },
//   });

//   const handleChange = (e) => {
//     setLocation({ ...location, [e.target.name]: e.target.value });
//   };

//   const handleMapClick = (event) => {
//     setPosition({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();

//       Object.entries(location).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       // Append latitude & longitude from map
//       formData.append("latitude", position.lat);
//       formData.append("longitude", position.lng);

//       // Append images
//       if (images.length === 0) {
//         setMessage("⚠️ Please upload at least one image.");
//         setLoading(false);
//         return;
//       }
//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       await axios.post("http://localhost:5001/api/locations/add", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("✅ Location submitted successfully!");
//       setTimeout(() => router.push("/community"), 1500);
//     } catch (error) {
//       setMessage("❌ Failed to add location.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//       <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow-2xl transition-transform transform hover:scale-105">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add a New Location</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             name="name"
//             placeholder="Location Name"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="category"
//             placeholder="Category (e.g., Nature, Adventure)"
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />

//           {/* Map Section */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//               <FaMapMarkerAlt className="mr-2 text-indigo-500" /> Select Location on Map
//             </h3>
//             <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={position}
//                 zoom={10}
//                 onClick={handleMapClick}
//                 className="rounded-lg"
//               >
//                 <Marker position={position} />
//               </GoogleMap>
//             </LoadScript>
//             <p className="text-sm text-gray-600 mt-2">
//               Selected Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
//             </p>
//           </div>

//           {/* Image Upload */}
//           <div {...getRootProps()} className="border-dashed border-2 border-indigo-500 p-6 text-center cursor-pointer rounded-lg hover:bg-gray-50 transition">
//             <input {...getInputProps()} />
//             <FaUpload className="text-indigo-500 mx-auto text-3xl mb-2" />
//             <p className="text-gray-600">Drag & drop images here, or click to select files</p>
//           </div>

//           {/* Image Preview Grid */}
//           {images.length > 0 && (
//             <div className="grid grid-cols-3 gap-4 mt-4">
//               {images.map((file, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index + 1}`}
//                     className="w-full h-24 object-cover rounded-lg shadow-md"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
//             }`}
//           >
//             {loading ? "Uploading..." : "Submit Location"}
//           </button>
//         </form>

//         {message && <p className="text-center mt-4 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AddLocation;


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { FaMapMarkerAlt, FaImages, FaUpload } from "react-icons/fa";

// const mapContainerStyle = {
//   width: "100%",
//   height: "350px",
// };

// const center = { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu

// const AddLocation = () => {
//   const [location, setLocation] = useState({
//     name: "",
//     description: "",
//     category: "",
//   });
//   const [images, setImages] = useState([]);
//   const [position, setPosition] = useState(center);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => {
//       setImages((prev) => [...prev, ...acceptedFiles]);
//     },
//   });

//   const handleChange = (e) => {
//     setLocation({ ...location, [e.target.name]: e.target.value });
//   };

//   const handleMapClick = (event) => {
//     setPosition({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();

//       Object.entries(location).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       // Append latitude & longitude from map
//       formData.append("latitude", position.lat);
//       formData.append("longitude", position.lng);

//       // Append images
//       if (images.length === 0) {
//         setMessage("⚠️ Please upload at least one image.");
//         setLoading(false);
//         return;
//       }
//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       await axios.post("http://localhost:5001/api/locations/add", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("✅ Location submitted successfully!");
//       setTimeout(() => router.push("/community"), 1500);
//     } catch (error) {
//       setMessage("❌ Failed to add location.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
//       <div className="w-full max-w-2xl bg-white p-12 rounded-xl shadow-xl">
//         <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
//           Add a New Location
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Location Name"
//               onChange={handleChange}
//               required
//               className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               onChange={handleChange}
//               required
//               className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
//             />
//             <input
//               type="text"
//               name="category"
//               placeholder="Category (e.g., Nature, Adventure)"
//               onChange={handleChange}
//               required
//               className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
//             />
//           </div>

//           {/* Map Section */}
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <FaMapMarkerAlt className="mr-3 text-indigo-600" /> Select Location on Map
//             </h3>
//             <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={position}
//                 zoom={10}
//                 onClick={handleMapClick}
//                 className="rounded-xl shadow-lg"
//               >
//                 <Marker position={position} />
//               </GoogleMap>
//             </LoadScript>
//             <p className="text-sm text-gray-600 mt-2">
//               Selected Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
//             </p>
//           </div>

//           {/* Image Upload */}
//           <div
//             {...getRootProps()}
//             className="border-2 border-dashed border-indigo-500 p-8 text-center cursor-pointer rounded-lg hover:bg-gray-50 transition"
//           >
//             <input {...getInputProps()} />
//             <FaUpload className="text-indigo-600 mx-auto text-4xl mb-3" />
//             <p className="text-gray-700">Drag & drop images here, or click to select files</p>
//           </div>

//           {/* Image Preview */}
//           {images.length > 0 && (
//             <div className="grid grid-cols-3 gap-4 mt-6">
//               {images.map((file, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index + 1}`}
//                     className="w-full h-24 object-cover rounded-lg shadow-lg"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-4 rounded-lg text-white font-semibold transition ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {loading ? "Uploading..." : "Submit Location"}
//           </button>
//         </form>

//         {/* Message */}
//         {message && <p className="text-center mt-6 text-red-600">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AddLocation;



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaImages, FaUpload } from "react-icons/fa";

const mapContainerStyle = {
  width: "100%",
  height: "350px",
};

const center = { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu

const AddLocation = () => {
  const [location, setLocation] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [position, setPosition] = useState(center);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleMapClick = (event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(location).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append latitude & longitude from map
      formData.append("latitude", position.lat);
      formData.append("longitude", position.lng);

      // Append images
      if (images.length === 0) {
        setMessage(" Please upload at least one image.");
        setLoading(false);
        return;
      }
      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("http://localhost:5001/api/locations/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Location submitted successfully!");
      setTimeout(() => router.push("/community"), 1500);
    } catch (error) {
      setMessage(" Failed to add location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
      <div className="w-full max-w-full bg-white p-12 rounded-xl shadow-xl flex flex-col justify-center">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Want to add new Location?
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Location Name"
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
            />
            <input
              type="text"
              name="category"
              placeholder="Category (How do you want to describe this place as?)"
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition"
            />
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-3 text-indigo-600" /> Select Location on Map
            </h3>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={10}
                onClick={handleMapClick}
                className="rounded-xl shadow-lg"
              >
                <Marker position={position} />
              </GoogleMap>
            </LoadScript>
            <p className="text-sm text-gray-600 mt-2">
              Selected Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          </div>

          {/* Image Upload */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-indigo-500 p-8 text-center cursor-pointer rounded-lg hover:bg-gray-50 transition"
          >
            <input {...getInputProps()} />
            <FaUpload className="text-indigo-600 mx-auto text-4xl mb-3" />
            <p className="text-gray-700">Drag & drop images here, or click to select files</p>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Submit Location"}
          </button>
        </form>

        {/* Message */}
        {message && <p className="text-center mt-6 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default AddLocation;
