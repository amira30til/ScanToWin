import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store";

const RequireAuth = ({ allowedRole }) => {
  const auth = useAuthStore((state) => state.auth);
  const location = useLocation();

  return auth?.role === allowedRole ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
