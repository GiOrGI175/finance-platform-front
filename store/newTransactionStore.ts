import { create } from 'zustand';

type newTransactionState = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;

  id: undefined | string;
  isOpenEdit: boolean;
  setOpenEdit: (id: string) => void;
  setCloseEdit: () => void;
};

export const useNewTransaction = create<newTransactionState>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),

  id: undefined,
  isOpenEdit: false,
  setOpenEdit: (id) => set({ id, isOpenEdit: true }),
  setCloseEdit: () => set({ isOpenEdit: false }),
}));
