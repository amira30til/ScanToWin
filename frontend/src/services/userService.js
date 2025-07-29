import axios from "@/api/axios";

const USER_URL = "/users";
const USER_GAME_URL = "/user-game";

export const createUser = async (user) => await axios.post(USER_URL, user);

export const verifyUserCooldown = async (userId, shopId) =>
  await axios.get(`${USER_GAME_URL}/verify/${userId}/${shopId}`);

export const getShopUsers = async (shopId) =>
  await axios.get(`${USER_GAME_URL}/by-shop/${shopId}`);
