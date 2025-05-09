import axios from "@/api/axios";

const LOGIN_URL = "/auth";
const REFRESH_URL = "/auth/refresh-token";
const LOGOUT_URL = "/auth/logout";
const FORGOT_URL = "/auth/forgot-password";
const RESET_URL = "/auth/reset-password";

export const loginUser = async ({ email, password }) => {
  return await axios.post(
    LOGIN_URL,
    { email, password },
    {
      withCredentials: true,
    },
  );
};

export const refreshToken = async () => {
  return await axios.post(
    REFRESH_URL,
    {},
    {
      withCredentials: true,
    },
  );
};

export const logoutUser = async () => {
  return await axios.post(
    LOGOUT_URL,
    {},
    {
      withCredentials: true,
    },
  );
};

export const forgotPassword = async (email) => {
  return await axios.post(FORGOT_URL, { email });
};

export const resetPassword = async (body) => {
  return await axios.post(RESET_URL, body);
};
