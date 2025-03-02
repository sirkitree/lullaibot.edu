import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    // If user is not an admin, redirect to 404 page
    return <Navigate to="/not-found" replace />;
  }

  // If user is authenticated and has admin role, render the children components
  return <>{children}</>;
};

export default AdminRoute; 