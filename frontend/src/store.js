import { create } from "zustand";

const useAuthStore = create((set) => ({
  auth: {},
  setAuth: (authUpdate) =>
    set((state) => ({ auth: { ...state.auth, ...authUpdate } })),
  resetAuth: () => set(() => ({ auth: {} })),
}));

export default useAuthStore;
