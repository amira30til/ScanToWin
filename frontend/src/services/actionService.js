import axios from "@/api/axios";

const ACTION_URL = "/actions";
const CHOSEN_ACTION_URL = "/chosen-action";

export const createAction = async (axios, body) =>
  await axios.post(ACTION_URL, body);

export const getActions = async () => await axios.get(ACTION_URL);

export const deleteAction = async (axios, id) =>
  await axios.delete(`${ACTION_URL}/${id}`);

export const getActionsByShop = async (shopId) =>
  await axios.get(`${CHOSEN_ACTION_URL}/shop/${shopId}`);

export const upsertActions = async (axios, shopId, actions) =>
  await axios.patch(`${CHOSEN_ACTION_URL}/shop/${shopId}/sync`, actions);
