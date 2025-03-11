"use client";
import { useState } from "react";
import { loginUser } from "../services/authService";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setLoading(true);

    try {
      const data = await loginUser(user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(" Login successful!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (error) {
      setMessage(" Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br  p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
