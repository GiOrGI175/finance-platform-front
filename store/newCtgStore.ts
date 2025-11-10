import { boolean } from 'zod';
import { create } from 'zustand';

type newCategoriesState = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;

  id: undefined | string;
  isOpenEdit: boolean;
  setOpenEdit: (id: string) => void;
  setCloseEdit: () => void;
};

export const useNewCategories = create<newCategoriesState>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),

  id: undefined,
  isOpenEdit: false,
  setOpenEdit: (id) => set({ id, isOpenEdit: true }),
  setCloseEdit: () => set({ isOpenEdit: false }),
}));
