import axios from "axios";

const axios_api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // API endpoint
});

// Add Authorization header if token exists
axios_api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios_api;
