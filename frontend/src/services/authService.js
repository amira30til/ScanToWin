import axios from "@/api/axios";

const LOGIN_URL = "/auth/login";
const REGISTER_URL = "/auth/register";
const REFRESH_URL = "/auth/refresh";
const LOGOUT_URL = "/auth/logout";

export const registerUser = async ({ email, password }) => {
  return await axios.post(REGISTER_URL, JSON.stringify({ email, password }), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const loginUser = async ({ email, password }) => {
  return await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const refreshToken = async () => {
  return await axios.get(REFRESH_URL, {
    withCredentials: true,
  });
};

export const logoutUser = async () => {
  return await axios(LOGOUT_URL, {
    withCredentials: true,
  });
};
