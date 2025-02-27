import axios from 'axios';

// Use the environment variable with a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const token = localStorage.getItem('auth_token');
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
      localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 