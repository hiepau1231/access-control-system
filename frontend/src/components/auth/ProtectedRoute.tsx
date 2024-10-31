import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingIndicator } from '../common/LoadingIndicator';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, initialized } = useAuth();
  const location = useLocation();
  
  // Show loading while auth is initializing
  if (!initialized || isLoading) {
    return <LoadingIndicator fullScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};