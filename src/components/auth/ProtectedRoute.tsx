import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isMasterSession } from '@/lib/authToken';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireMaster?: boolean;
}

export const ProtectedRoute = ({ children, requireMaster = false }: ProtectedRouteProps) => {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireMaster && !isMasterSession(session)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
