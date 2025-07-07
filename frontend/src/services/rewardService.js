const REWARD_URL = "/reward";

export const getRewardsByShop = async (axios, shopId) =>
  await axios.get(`${REWARD_URL}/by-shop/${shopId}`);

export const upsertRewards = async (axios, rewards) =>
  await axios.post(REWARD_URL, rewards);
