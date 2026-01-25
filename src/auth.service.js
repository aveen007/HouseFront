// auth.service.js
import axios from "axios";
import { setStoredAuth, clearStoredAuth } from './auth';
const BASE_URL = "http://localhost:9314"; // backend URL

// Create Axios instance without withCredentials
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add interceptor to automatically attach JWT to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   AUTH REQUESTS
========================= */

/**
 * Login user
 * POST /auth/login
 * Body: { username, password }
 * Stores JWT in localStorage
 */

export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  const data = res.data;

  if (data.token) {
    // Use the storage utility
    setStoredAuth({
      token: data.token,
      userId: data.userId,
      username: data.username
    });
  }
console.log('Login successful!');
console.log('Token stored at jwtToken:', localStorage.getItem('jwtToken'));
console.log('Token stored at authCredentials:', localStorage.getItem('authCredentials'));
console.log('Full localStorage:', { ...localStorage });
  return data;
};

export const logout = () => {
  clearStoredAuth();  // Use the utility
};
/**
 * Register new user
 */
export const register = async ({
  username,
  password,
  fullName,
  role = "PATIENT",
  patientId,
}) => {
  const payload = { username, password, fullName, role };
  if (patientId !== undefined && patientId !== null) {
    payload.patientId = patientId;
  }
  const res = await api.post("/auth/register", payload);
  return res.data;
};

/**
 * Fetch current logged-in user
 * GET /auth/me
 */
export const fetchMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Token missing or invalid
      return null;
    }
    throw err;
  }
};


