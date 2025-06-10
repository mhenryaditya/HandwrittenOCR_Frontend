import { create } from "zustand";

const sidebarClick = create((set) => ({
    isOpen: false,
    setSidebarClick: (res) => set({ isOpen: res }),
}));

export default sidebarClick;