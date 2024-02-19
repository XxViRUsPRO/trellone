import { create } from "zustand";

type ProModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useProModal = create<ProModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
