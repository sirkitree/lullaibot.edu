import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, default to home
  const { from = '/' } = (location.state as LocationState) || {};
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Redirect to the page they were trying to access, or home if none
      navigate(from);
    }
    return () => {
      clearError();
    };
  }, [user, navigate, clearError, from]);
  
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;
    
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    console.log("Login form submitted, validating...");
    
    if (validateForm()) {
      console.log("Login form validation successful, attempting login...");
      try {
        await login(email, password);
        console.log("Login function called successfully");
      } catch (err) {
        console.error("Login error:", err);
      }
    } else {
      console.log("Login form validation failed", formErrors);
    }
  };
  
  return (
    <div className="page login-page">
      <div className="auth-container">
        <div className="auth-card card">
          <h2 className="text-center mb-lg">Login to Your Account</h2>
          
          {from !== '/' && (
            <div className="alert alert-info mb-md">
              Please log in to access that page
            </div>
          )}
          
          {error && (
            <div className="alert alert-error mb-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>
            
            <div className="form-group mt-lg">
              <button 
                type="submit" 
                className={`button button-primary w-full ${loading ? 'button-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          
          <div className="auth-links mt-md text-center">
            <p>
              Don't have an account? <Link to="/register" className="text-primary">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 