const SHOP_URL = "/shops";

export const getAdminShops = async (axios, id) =>
  await axios.get(`${SHOP_URL}/admin/${id}`);

export const getAdminShop = async (axios, shopId, adminId) =>
  await axios.get(`${SHOP_URL}/${shopId}/admin/${adminId}`);

export const createShop = async (axios, id, shop) =>
  await axios.post(`${SHOP_URL}/${id}`, shop);

export const updateShop = async (axios, shopId, adminId, body) =>
  await axios.patch(`${SHOP_URL}/${shopId}/admin/${adminId}`, body);
