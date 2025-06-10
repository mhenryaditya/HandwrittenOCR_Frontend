import { create } from 'zustand'

const windowWidthStore = create((set) => ({
    windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    setWindowWidth: (width) => set({ windowWidth: width }),
}));

export default windowWidthStore;