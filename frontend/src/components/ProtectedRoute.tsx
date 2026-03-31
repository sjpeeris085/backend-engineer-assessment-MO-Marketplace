import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../utils/auth';

interface ProtectedRouteProps {
  allowedRole?: 'ADMIN' | 'CUSTOMER';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const user = getUser();

  if (!user) {
    // If not logged in, redirect to home page where they can initiate login
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If role is specific and doesn't match, redirect to home
    return <Navigate to="/" replace />;
  }

  // Valid session - render the child routes securely 
  return <Outlet />;
};
