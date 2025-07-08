import axios from "@/api/axios";

const REWARD_URL = "/reward";

export const getRewardsByShop = async (shopId) =>
  await axios.get(`${REWARD_URL}/by-shop/${shopId}`);

export const upsertRewards = async (axios, rewards) =>
  await axios.post(REWARD_URL, rewards);

export const getShopRandomReward = async (shopId) =>
  await axios.post(`${REWARD_URL}/shops/${shopId}/random-rewards`);
