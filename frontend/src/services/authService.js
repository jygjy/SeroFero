import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/auth/"; // Backend API URL

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data; // { message: "User registered successfully" }
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data; // { token, user }
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
