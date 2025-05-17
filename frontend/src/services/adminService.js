const ADMIN_URL = "/admins";

export const getAdmins = async (axios) => await axios.get(ADMIN_URL);

export const getAdminById = async (axios, id) =>
  await axios.get(`${ADMIN_URL}/${id}`);

export const createAdmin = async (axios, user) =>
  await axios.post(ADMIN_URL, user);

export const deleteAdmin = async (axios, id) =>
  await axios.delete(`${ADMIN_URL}/${id}`);
