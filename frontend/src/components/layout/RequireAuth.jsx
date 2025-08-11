import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store";

const RequireAuth = ({ allowedRole }) => {
  const auth = useAuthStore((state) => state.auth);
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.role !== allowedRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
