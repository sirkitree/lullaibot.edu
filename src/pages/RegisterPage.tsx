import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formErrors, setFormErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    passwordConfirm?: string;
  }>({});
  
  const { register, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => {
      clearError();
    };
  }, [user, navigate, clearError]);
  
  const validateForm = (): boolean => {
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string;
      passwordConfirm?: string;
    } = {};
    let isValid = true;
    
    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
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
    
    if (!passwordConfirm) {
      errors.passwordConfirm = 'Please confirm your password';
      isValid = false;
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    console.log("Form submitted, validating...");
    
    if (validateForm()) {
      console.log("Form validation successful, attempting registration...");
      try {
        await register(name, email, password);
        console.log("Registration function called successfully");
      } catch (err) {
        console.error("Registration error:", err);
      }
    } else {
      console.log("Form validation failed", formErrors);
    }
  };
  
  return (
    <div className="page register-page">
      <div className="auth-container">
        <div className="auth-card card">
          <h2 className="text-center mb-lg">Create an Account</h2>
          
          {error && (
            <div className="alert alert-error mb-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>
            
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
                placeholder="Create a password"
                disabled={loading}
              />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {formErrors.passwordConfirm && (
                <div className="form-error">{formErrors.passwordConfirm}</div>
              )}
            </div>
            
            <div className="form-group mt-lg">
              <button 
                type="submit" 
                className={`button button-primary w-full ${loading ? 'button-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="auth-links mt-md text-center">
            <p>
              Already have an account? <Link to="/login" className="text-primary">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 