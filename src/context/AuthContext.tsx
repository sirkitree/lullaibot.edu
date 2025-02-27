import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  _id?: string; // MongoDB might return _id as well
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  points: number;
  contributions: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Using direct URL as Vite environment variables may not be properly typed
const API_URL = 'http://localhost:3002/api';

// Helper function to normalize user data
const normalizeUserData = (userData: any): User => {
  // Ensure id is always a string and is present
  const user = {
    ...userData,
    id: userData._id ? userData._id.toString() : userData.id
  };
  
  console.log('Normalized user data:', user);
  return user as User;
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Configure axios to use the token for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Fetch user profile
      fetchUserProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile using token
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.data.success) {
        // Normalize user data to ensure ID is formatted correctly
        const normalizedUser = normalizeUserData(response.data.data);
        setUser(normalizedUser);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      setToken(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to login with:", { email });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        
        // Normalize user data to ensure ID is formatted correctly
        const normalizedUser = normalizeUserData(data);
        setUser(normalizedUser);
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Login successful');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to register user:", { name, email });
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        
        // Normalize user data to ensure ID is formatted correctly
        const normalizedUser = normalizeUserData(data);
        setUser(normalizedUser);
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Registration successful');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      await axios.get(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token and user data regardless of API success
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;