const ADMIN_URL = "/admins";

export const getAdmins = async (axios) => await axios.get(ADMIN_URL);

export const getAdminById = async (axios, id) =>
  await axios.get(`${ADMIN_URL}/by-id/${id}`);

export const createAdmin = async (axios, body) =>
  await axios.post(ADMIN_URL, body);

export const restoreAdmin = async (axios, id) => {
  return await axios.patch(`${ADMIN_URL}/${id}/restore`);
};

export const archiveAdmin = async (axios, id) => {
  return await axios.delete(`${ADMIN_URL}/${id}`);
};

export const deleteAdmin = async (axios, id) => {
  return await axios.delete(`${ADMIN_URL}/delete/${id}`);
};
