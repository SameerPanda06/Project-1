import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  // If token is missing, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render children
  return children;
};

export default ProtectedRoute;
