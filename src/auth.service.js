// auth.service.js
import axios from "axios";

const BASE_URL = "http://localhost:9314"; // backend URL

// Create an Axios instance with credentials enabled
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important for session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   AUTH REQUESTS
========================= */

/**
 * Login user
 * POST /auth/login
 * Body: { username, password }
 * Returns user object on success
 */
export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

/**
 * Register new user
 * POST /auth/register
 * Body: { username, password, fullName, role?, patientId? }
 * Returns user object on success
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
 * Returns user object, or throws 401 if not authenticated
 */
export const fetchMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Not authenticated
      return null;
    }
    throw err;
  }
};

/**
 * Logout current user
 * POST /auth/logout
 * Returns nothing
 */
export const logout = async () => {
  await api.post("/auth/logout");
};
