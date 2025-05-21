"use client"
import { useState } from "react"
import { registerUser } from "../services/authService"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Eye, EyeOff, User, Mail, Lock } from "lucide-react"

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

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" })
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
      const data = await registerUser(user)
      showToast("Registration successful! Redirecting to login...", "success")
      setTimeout(() => router.push("/login"), 1800)
    } catch (error) {
      showToast(error.message || "Registration failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Toast Message */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Left: Illustration and Welcome */}
      <div className="flex flex-col items-center justify-center md:w-[55%] w-full bg-gradient-to-br from-purple-50 to-indigo-100 p-8 md:p-16">
        <img
          src="/login-illustration.svg"
          alt="Register Illustration"
          className="max-w-xs md:max-w-md w-full h-auto mb-6 md:mb-10 drop-shadow-xl"
        />
        <div className="text-center md:mt-4">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Join SeroFero</h3>
          <p className="mt-3 text-gray-600 max-w-md mx-auto">
            Create your account to discover, review, and share your favorite locations with the community.
          </p>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex flex-col justify-center items-center md:w-[45%] w-full bg-white p-6 md:p-12">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an Account</h2>
          <p className="text-center text-gray-500 mb-8">Sign up to get started</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a Password"
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600 shadow-md hover:shadow-lg"
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
                  Creating Account...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register