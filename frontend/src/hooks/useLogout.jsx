import { logoutUser } from "@/services/authService";
import useAuthStore from "@/store";

const useLogout = () => {
  const resetAuth = useAuthStore((state) => state.resetAuth);

  const logout = async () => {
    try {
      await logoutUser();
      resetAuth();
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
