import { create } from "zustand";

type CardModalState = {
  id?: string;
  isOpen: boolean;
  open: (id: string) => void;
  close: () => void;
};

export const useCardModal = create<CardModalState>((set) => ({
  id: undefined,
  isOpen: false,
  open: (id: string) => set({ id: id, isOpen: true }),
  close: () => set({ id: undefined, isOpen: false }),
}));
