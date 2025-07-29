const ADMIN_URL = "/admins";

export const getAdmins = async (axios) => await axios.get(ADMIN_URL);

export const getAdminById = async (axios, id) =>
  await axios.get(`${ADMIN_URL}/${id}`);

export const createAdmin = async (axios, body) =>
  await axios.post(ADMIN_URL, body);

export const deleteAdmin = async (axios, id) => {
  return await axios.delete(`${ADMIN_URL}/${id}`);
};
