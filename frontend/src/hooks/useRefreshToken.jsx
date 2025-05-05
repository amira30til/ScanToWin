import useAuthStore from "@/store";
import { refreshToken } from "@/services/authService";

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresh = async () => {
    const response = await refreshToken();
    setAuth({
      roles: response.data.roles,
      accessToken: response.data.accessToken,
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
