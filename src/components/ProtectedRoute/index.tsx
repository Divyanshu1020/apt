import { useAuth } from "@/context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";


type ProtectedRouteProps = {
  allowedRoles?: string[];
  children?: React.ReactNode;
};

export const AuthGuard = ({ children }: { children?: React.ReactNode }) => {
  const {isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Show loading while auth status is being determined
  if (isLoading || isAuthenticated) {
    if (location.pathname === "/auth/role-selection") {
      return <Outlet />;
    }

    return <Navigate to="/auth/role-selection" state={{ from: location }} replace />;
  }
  
  
  return children ? <>{children}</> : <Outlet />;
};

const ProtectedRoute = ({ allowedRoles = [], children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  
  if (allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = userRoles.some((role: { name: string; }) => 
      allowedRoles.includes(role.name)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated and authorized
  return children ? <>{children}</> : <Outlet />;
};

/**
 * Admin route - requires ROLE_ADMIN
 */
export const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} children={children} />
  );
};

/**
 * Manager route - requires ROLE_MANAGER
 */
export const ManagerRoute = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ProtectedRoute allowedRoles={["ROLE_MANAGER"]} children={children} />
  );
};

/**
 * User route - just requires authentication, no specific role
 */
export const UserRoute = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ProtectedRoute children={children} />
  );
};

export default ProtectedRoute;