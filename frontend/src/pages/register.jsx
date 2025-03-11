"use client";
import { useState } from "react";
import { registerUser } from "../services/authService";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
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
      const data = await registerUser(user);
      setMessage("✅ " + data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setMessage("❌ " + (error.message || "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br? p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Create a Password"
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Success or Error Message */}
        {message && (
          <p className={`text-center mt-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Redirect to Login */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
