import { create } from "zustand";

const useAuthStore = create((set) => ({
  auth: {},
  setAuth: (authUpdate) =>
    set((state) => ({ auth: { ...state.auth, ...authUpdate } })),
  resetAuth: () => set(() => ({ auth: {} })),

  shop: {},
  setShop: (shopUpdate) =>
    set((state) => ({ shop: { ...state.shop, ...shopUpdate } })),
}));

export default useAuthStore;
