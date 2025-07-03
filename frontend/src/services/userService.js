import axios from "@/api/axios";

const USER_URL = "/users";

export const createUser = async (user) => await axios.post(USER_URL, user);
