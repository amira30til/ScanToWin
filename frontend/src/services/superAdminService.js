const ADMIN_URL = "/admins";
const SHOP_URL = "/shops";

export const getAdmins = async (axios) => await axios.get(ADMIN_URL);

export const getAdminById = async (axios, id) =>
  await axios.get(`${ADMIN_URL}/${id}`);

export const createAdmin = async (axios, user) =>
  await axios.post(ADMIN_URL, user);

export const deleteAdmin = async (axios, id) =>
  await axios.delete(`${ADMIN_URL}/${id}`);

export const getAdminShops = async (axios, id) =>
  await axios.get(`${SHOP_URL}/admin/${id}`);

export const getAdminShop = async (axios, shopId, adminId) =>
  await axios.get(`${SHOP_URL}/${shopId}/admin/${adminId}`);

export const createShop = async (axios, id, shop) =>
  await axios.post(`${SHOP_URL}/${id}`, shop);
