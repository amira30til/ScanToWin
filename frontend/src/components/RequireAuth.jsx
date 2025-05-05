import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store";

const RequireAuth = ({ allowedRoles }) => {
  const auth = useAuthStore((state) => state.auth);
  const location = useLocation();

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
