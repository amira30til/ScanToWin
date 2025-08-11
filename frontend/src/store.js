import { create } from "zustand";

const useAuthStore = create((set) => ({
  auth: null,
  setAuth: (authUpdate) =>
    set((state) => ({ auth: { ...state.auth, ...authUpdate } })),
  resetAuth: () => set(() => ({ auth: null })),
}));

export default useAuthStore;
