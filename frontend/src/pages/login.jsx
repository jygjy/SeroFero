"use client"
import { useState } from "react"
import { loginUser } from "../services/authService"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, User } from "lucide-react"

const Toast = ({ show, message, type }) => (
  <div
    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 flex items-center gap-2 max-w-md
      ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      ${type === "success" ? "bg-emerald-600" : "bg-rose-500"}`}
  >
    {type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
    <span>{message}</span>
  </div>
)

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const showToast = (message, type = "success", duration = 2500) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ ...toast, show: false }), duration)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginUser(user)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      showToast("Login successful!", "success")
      
      // Check user role and redirect accordingly
      if (data.user.role === "admin") {
        setTimeout(() => router.push("/admin"), 1500)
      } else {
        setTimeout(() => router.push("/"), 1500)
      }
    } catch (error) {
      showToast("Invalid credentials. Try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Toast Message */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Left: Image or Illustration (75%) */}
      <div className="hidden md:flex md:w-3/4 justify-center items-center p-12">
        <img src="/login-illustration.svg" alt="Login Illustration" className="max-w-full h-auto drop-shadow-xl" />
      </div>

      {/* Right: Welcome Text and Login Form (25%) */}
      <div className="flex flex-col w-full md:w-1/4 bg-white p-6 md:p-8">
        {/* Welcome Text (moved from left side) */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Welcome to SeroFero</h3>
          <p className="mt-3 text-gray-600">Discover, review, and share your favorite locations with the community.</p>
        </div>

        {/* Login Form */}
        <div className="w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 bg-white p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-semibold hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
