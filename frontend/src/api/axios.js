import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-platform-epr1.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("inkwell_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
