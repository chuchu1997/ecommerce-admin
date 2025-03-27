import { create } from "zustand";

interface useStoreModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<useStoreModalInterface>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: false }),
  onClose: () => set({ isOpen: false }),
}));
