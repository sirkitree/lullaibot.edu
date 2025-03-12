import axios from 'axios';

// Configuration priorities:
// 1. VITE_API_URL from environment variables (set in .env files)
// 2. Production URL if in production mode
// 3. Dynamic port detection for local development

// Get the current window location for dynamic port detection
const getServerPort = () => {
  // When running locally, the server is typically one port number higher than the frontend
  // This assumes the frontend is running on the current window's port
  if (typeof window !== 'undefined') {
    const currentPort = window.location.port;
    // If current port is a number, calculate server port
    if (currentPort && !isNaN(parseInt(currentPort))) {
      return parseInt(currentPort) + 1;
    }
  }
  return 3002; // Default fallback port
};

// Determine the base URL for API requests
const getBaseUrl = () => {
  // First priority: environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Second priority: production URL
  if (import.meta.env.PROD) {
    return '/api';
  }

  // Third priority: local development with dynamic port
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = getServerPort();
  return `${protocol}//${hostname}:${port}/api`;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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