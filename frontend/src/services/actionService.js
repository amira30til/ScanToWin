import axios from "@/api/axios";

const ACTION_URL = "/actions";
const CHOSEN_ACTION_URL = "/chosen-action";
const ACITON_CLICK_URL = "/action-click";
const REWARD_REDEMPTION_URL = "/reward-redemption";

export const createAction = async (axios, body) =>
  await axios.post(ACTION_URL, body);

export const getActions = async () => await axios.get(ACTION_URL);

export const getActionsByShop = async (shopId) =>
  await axios.get(`${CHOSEN_ACTION_URL}/shop/${shopId}`);

export const upsertActions = async (axios, shopId, actions) =>
  await axios.patch(`${CHOSEN_ACTION_URL}/shop/${shopId}/sync`, actions);

export const chosenActionClick = async (chosenActionId) =>
  await axios.post(
    `${CHOSEN_ACTION_URL}/clicked-action/?chosenActionId=${chosenActionId}`,
  );

export const getChosenActionClickedAt = async (chosenActionId) =>
  await axios.get(`${ACITON_CLICK_URL}/chosen-action/${chosenActionId}`);

export const getChosenActionRedeemedAt = async (chosenActionId) =>
  await axios.get(`${REWARD_REDEMPTION_URL}/chosen-action/${chosenActionId}`);

export const getShopActionClick = async (shopId) =>
  await axios.get(`${ACITON_CLICK_URL}/shop/${shopId}`);

export const getShopActionRedeem = async (shopId) =>
  await axios.get(`${REWARD_REDEMPTION_URL}/shop/${shopId}`);

export const deleteAction = async (axios, id) =>
  await axios.delete(`${ACTION_URL}/${id}`);
