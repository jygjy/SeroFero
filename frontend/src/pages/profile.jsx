"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { FaMapMarkerAlt, FaBookmark, FaHeart  } from 'react-icons/fa'

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
    contactInfo: {
      phone: "",
      address: "",
      city: "",
      country: "",
    },
    preferences: {
      notificationEnabled: true,
      emailNotifications: true,
    },
    contributedLocations: [],
    favoriteLocations: [],
    wishlist: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('contributions');

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
    } else {
      const userData = JSON.parse(storedUser)
      setProfile((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
        profileImage: userData.profileImage || "",
      }))
    }
  }, [])


  const handleRemoveFromWishlist = async (locationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/locations/${locationId}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(prev => ({
        ...prev,
        wishlist: prev.wishlist.filter(item => item._id !== locationId)
      }));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/users/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(prev => ({
          ...prev,
          wishlist: response.data
        }));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
  
    fetchWishlist();
  }, []);

  // Add these functions after fetchWishlist
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch contributions
      const contributionsResponse = await axios.get('http://localhost:5001/api/users/contributions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        contributedLocations: contributionsResponse.data
      }));

      // Fetch favorites
      const favoritesResponse = await axios.get('http://localhost:5001/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        favoriteLocations: favoritesResponse.data
      }));

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);

// Add function to handle removing from favorites
const handleRemoveFromFavorites = async (locationId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5001/api/locations/${locationId}/favorite`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setProfile(prev => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(item => item._id !== locationId)
    }));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};
  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Add your API call here to update the profile
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating profile:", err)
    }
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!profile.name) return "U"
    return profile.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        "http://localhost:5001/api/users/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));
      // Optionally update localStorage user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.profileImage = response.data.profileImage;
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
            {profile.profileImage ? (
              <img
                src={`http://localhost:5001${profile.profileImage}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name || "My Profile"}</h1>
            <p className="text-gray-500">{profile.email}</p>
            {isEditing && (
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="block w-full text-sm text-gray-500"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              isEditing ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-blue-600 hover:bg-blue-700 text-white"
            } transition-colors duration-200 font-medium`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isEditing ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              )}
            </svg>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4a1 1 0 102 0V8zm-2 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                  placeholder="Your email address"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.contactInfo.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contactInfo: { ...profile.contactInfo, phone: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Your phone number"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={profile.preferences.notificationEnabled}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notificationEnabled: e.target.checked,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500">Receive updates about new locations</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={profile.preferences.emailNotifications}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        emailNotifications: e.target.checked,
                      },
                    })
                  }
                  disabled={!isEditing || !profile.preferences.notificationEnabled}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Contributions and Favorites */}
        <div className="lg:col-span-2 space-y-6">
          {/* Single Tabs Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('contributions')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'contributions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Contributions
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'favorites' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Favorite Locations
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'wishlist' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Wishlist
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'wishlist' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.wishlist.length > 0 ? (
                    profile.wishlist.map((location) => (
                      <div
                        key={location._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-32 bg-gray-100">
                          {location.images && location.images[0] ? (
                            <img
                              src={location.images[0]}
                              alt={location.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{location.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                            </div>
                            <button 
                              onClick={() => handleRemoveFromWishlist(location._id)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <FaBookmark className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10">
                      <FaBookmark className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No wishlist items</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't added any locations to your wishlist yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'contributions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.contributedLocations.length > 0 ? (
                    profile.contributedLocations.map((location) => (
                      <div key={location._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gray-100">
                          {location.images && location.images[0] ? (
                            <img src={location.images[0]} alt={location.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{location.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {location.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10">
                      <FaMapMarkerAlt className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't contributed any locations yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'favorites' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.favoriteLocations.length > 0 ? (
                    profile.favoriteLocations.map((location) => (
                      <div key={location._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gray-100">
                          {location.images && location.images[0] ? (
                            <img src={location.images[0]} alt={location.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{location.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{location.description}</p>
                            </div>
                            <button onClick={() => handleRemoveFromFavorites(location._id)} className="text-red-500 hover:text-red-600">
                              <FaHeart className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10">
                      <FaHeart className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't added any locations to your favorites yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

