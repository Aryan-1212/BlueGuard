import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// ===== Auth =====
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const googleAuth = () => API.get("/auth/google");
export const checkGoogleStatus = () => API.get("/auth/google/status");
export const logoutUser = () => API.post("/auth/logout");
export const getCurrentUser = () => API.get("/auth/me");

// ===== Contact =====
export const sendContact = (data) => API.post("/contact", data);

// ===== AI Chat =====
export const askAI = (prompt) => API.post("/ai", { prompt });
