import { boolean } from 'zod';
import { create } from 'zustand';

type newAccountState = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
};

export const useNewAccount = create<newAccountState>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
}));
