import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001", // Flask server URL
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

// ===== Crisis Monitoring =====
export const getCrisisStatus = () => API.get("/crisis-status");
export const getCrisisDataInfo = () => API.get("/crisis-data/info");
export const startCrisisMonitoring = () => API.post("/crisis-monitoring/start");
export const stopCrisisMonitoring = () => API.post("/crisis-monitoring/stop");
