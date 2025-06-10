import { create } from "zustand";

const userStore = create((set) => ({
    user: null,
    setUser: (data) => set({ user: data }),
    clearUser: () => set({ user: null }),
}));

export default userStore;