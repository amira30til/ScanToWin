import useAuthStore from "@/store";
import { refreshToken } from "@/services/authService";

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = async () => {
    const response = await refreshToken();
    setAuth({
      role: response.data.data.role,
      accessToken: response.data.data.accessToken,
    });
    return response;
  };
  return refresh;
};

export default useRefreshToken;
