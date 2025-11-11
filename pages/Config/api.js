import axios from "axios";

const API = axios.create({
  baseURL: "https://clinic-management-be-production.up.railway.app",
});

// Headers token integeration
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
