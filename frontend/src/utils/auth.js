import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  if (token) {
    try {
      const { sub } = jwtDecode(token);
      return sub;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return null;
};
