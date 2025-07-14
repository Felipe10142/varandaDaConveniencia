import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  adminOnly = false
}) => {
  const {
    isAuthenticated,
    isAdmin,
    loading
  } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
export default PrivateRoute;