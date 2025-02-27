import axios from 'axios';

// In production, always use the production URL
// In development, use the environment variable with a fallback
const isProduction = import.meta.env.MODE === 'production';
const API_URL = isProduction 
  ? 'https://lullaibot-edu-api.onrender.com/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002/api');

console.log('API URL:', API_URL);

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (401, 403, etc.)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized - maybe redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 