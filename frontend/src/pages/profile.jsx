import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear token and user info
    router.push("/login"); // Redirect to login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
        {user ? (
          <div>
            <p className="text-lg"><strong>Name:</strong> {user.name}</p>
            <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
