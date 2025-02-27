import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is authenticated, render the children components
  return <>{children}</>;
};

export default ProtectedRoute; 