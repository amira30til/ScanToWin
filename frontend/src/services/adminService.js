const ADMIN_URL = "/admins";
const GAME_URL = "/game";

export const getAdmins = async (axios) => await axios.get(ADMIN_URL);

export const getAdminById = async (axios, id) =>
  await axios.get(`${ADMIN_URL}/${id}`);

export const createAdmin = async (axios, body) =>
  await axios.post(ADMIN_URL, body);

export const deleteAdmin = async (axios, id) =>
  await axios.delete(`${ADMIN_URL}/${id}`);

export const createGame = async (axios, body) =>
  await axios.post(GAME_URL, body);

export const getGames = async (axios) => await axios.get(GAME_URL);
