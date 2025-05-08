const ADMINS_URL = "/admins";

export const getAdmins = async (axios) => {
  return await axios.get(ADMINS_URL, {
    withCredentials: true,
  });
};

export const createAdmin = async (axios, user) => {
  return await axios.post(ADMINS_URL, user, {
    withCredentials: true,
  });
};

export const deleteAdmin = async (axios, id) => {
  return await axios.delete(`${ADMINS_URL}/${id}`, {
    withCredentials: true,
  });
};
