// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserCircle } from 'react-icons/fa';

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     name: '',
//     email: '',
//     bio: '',
//     profileImage: '',
//     contactInfo: {
//       phone: '',
//       address: '',
//       city: '',
//       country: ''
//     },
//     preferences: {
//       notificationEnabled: true,
//       emailNotifications: true
//     },
//     contributedLocations: [],
//     favoriteLocations: []
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5001/api/users/profile', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setProfile(res.data);
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setProfile({
//         ...profile,
//         profileImage: URL.createObjectURL(file)
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('name', profile.name);
//       formData.append('bio', profile.bio);
//       formData.append('phone', profile.contactInfo.phone);
      
//       if (imageFile) {
//         formData.append('profileImage', imageFile);
//       }

//       await axios.put('http://localhost:5001/api/users/profile', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setIsEditing(false);
//       fetchProfile();
//     } catch (err) {
//       console.error('Error updating profile:', err);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
//         <button
//           onClick={() => setIsEditing(!isEditing)}
//           className={`px-4 py-2 rounded-md ${
//             isEditing
//               ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//               : 'bg-blue-600 hover:bg-blue-700 text-white'
//           } transition-colors duration-200`}
//         >
//           {isEditing ? 'Cancel' : 'Edit Profile'}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Profile Image Section */}
//             <div className="flex flex-col items-center space-y-4">
//               <div className="relative w-32 h-32">
//                 {profile.profileImage ? (
//                   <img
//                     src={profile.profileImage}
//                     alt="Profile"
//                     className="w-full h-full rounded-full object-cover border-4 border-gray-200"
//                   />
//                 ) : (
//                   <FaUserCircle className="w-full h-full text-gray-300" />
//                 )}
//                 {isEditing && (
//                   <label
//                     htmlFor="profile-image"
//                     className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                     </svg>
//                     <input
//                       id="profile-image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>
//               {isEditing && (
//                 <p className="text-sm text-gray-500">Click the edit icon to change profile picture</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 value={profile.name}
//                 onChange={(e) => setProfile({...profile, name: e.target.value})}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Bio</label>
//               <textarea
//                 value={profile.bio}
//                 onChange={(e) => setProfile({...profile, bio: e.target.value})}
//                 disabled={!isEditing}
//                 rows="4"
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 disabled
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <input
//                 type="tel"
//                 value={profile.contactInfo.phone}
//                 onChange={(e) => setProfile({
//                   ...profile,
//                   contactInfo: {...profile.contactInfo, phone: e.target.value}
//                 })}
//                 disabled={!isEditing}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 id="notifications"
//                 checked={profile.preferences.notificationEnabled}
//                 onChange={(e) => setProfile({
//                   ...profile,
//                   preferences: {
//                     ...profile.preferences,
//                     notificationEnabled: e.target.checked
//                   }
//                 })}
//                 disabled={!isEditing}
//                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <label htmlFor="notifications" className="text-sm text-gray-700">
//                 Enable Notifications
//               </label>
//             </div>

//             {isEditing && (
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
//               >
//                 Save Changes
//               </button>
//             )}
//           </form>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">My Contributions</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {profile.contributedLocations.map(location => (
//                 <div key={location._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <h4 className="font-medium text-gray-900">{location.name}</h4>
//                   <p className="text-gray-600 text-sm mt-1">{location.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Favorite Locations</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {profile.favoriteLocations.map(location => (
//                 <div key={location._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <h4 className="font-medium text-gray-900">{location.name}</h4>
//                   <p className="text-gray-600 text-sm mt-1">{location.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;