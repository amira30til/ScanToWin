const REWARD_URL = "/reward";

export const getRewardsByShop = async (axios, shopId) =>
  await axios.get(`${REWARD_URL}/by-shop/${shopId}`);

export const createReward = async (axios, reward) =>
  await axios.post(REWARD_URL, reward);
