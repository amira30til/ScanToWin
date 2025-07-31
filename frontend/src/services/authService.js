import axios, { axiosAuth } from "@/api/axios";

const AUTH_URL = "/auth";

export const loginUser = async ({ email, password }) =>
  await axiosAuth.post(AUTH_URL, { email, password });

export const refreshToken = async () =>
  await axiosAuth.post(`${AUTH_URL}/refresh-token`, {});

export const logoutUser = async () =>
  await axiosAuth.post(`${AUTH_URL}/logout`, {});

export const forgotPassword = async (email) =>
  await axios.post(`${AUTH_URL}/forgot-password`, { email });

export const resetPassword = async (body) =>
  await axios.post(`${AUTH_URL}/reset-password`, body);
