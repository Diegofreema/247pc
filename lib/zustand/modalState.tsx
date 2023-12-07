import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export const useModalState = create<ModalState>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
}));
