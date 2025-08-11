import axios from "@/api/axios";

const GAME_URL = "/game";
const GAME_ASSIGNMENT_URL = "/active-game-assignment";

export const createGame = async (axios, formData) =>
  await axios.post(GAME_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getGames = async () => await axios.get(GAME_URL);

export const getShopGameAssignement = async (shopId) =>
  await axios.get(`${GAME_ASSIGNMENT_URL}/${shopId}/active-game`);

export const getActiveGames = async () => await axios.get(GAME_URL);

export const selectGame = async (axios, shopId, gameId, adminId, body) =>
  await axios.post(
    `${GAME_ASSIGNMENT_URL}/${shopId}/games/${gameId}/assign/${adminId}`,
    body,
  );

export const updateGame = async (axios, gameId, body) =>
  await axios.patch(`${GAME_URL}/${gameId}`, body);

export const deleteGame = async (axios, gameId) =>
  await axios.delete(`${GAME_URL}/${gameId}`);
