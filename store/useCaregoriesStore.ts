import { toast } from 'sonner';
import { create } from 'zustand';

interface Categories {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
}

interface CategoriesState {
  categories: Categories[];
  loading: boolean;
  createLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategories: (values: {
    name: string;
    plaidId?: string;
  }) => Promise<void>;
  deleteCategories: (ids: string[]) => void;
  updateCategories: (
    id: string,
    values: Partial<{ name: string; plaidId?: string }>
  ) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  createLoading: false,

  fetchCategories: async () => {
    try {
      set({ loading: true });

      const res = await fetch('/api/categories', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch accounts');

      const { categories } = await res.json();
      set({ categories });
    } catch (error) {
      console.error('fetchAccounts error:', error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  createCategories: async (values) => {
    try {
      set({ createLoading: true });

      const res = await fetch('/api/categories', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to create account');

      const data = await res.json();

      set((state) => ({
        categories: [...state.categories, data.categories],
      }));

      toast.success('categories created successfully!');
    } catch (error) {
      console.error('create categories error:', error);
      toast.error('Failed to create account');
    } finally {
      set({ createLoading: false });
    }
  },

  deleteCategories: async (ids) => {
    console.log(ids, 'ids');
    try {
      set((state) => ({
        categories: state.categories.filter((ctg) => !ids.includes(ctg._id)),
      }));

      for (const id of ids) {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Failed to delete account: ${id}`);
      }

      toast.success(
        `${ids.length} categor${ids.length > 1 ? 'ies' : 'y'} deleted`
      );
    } catch (error) {
      toast.error('Failed to delete accounts');
    }
  },

  updateCategories: async (id, values) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to update account');

      const data = await res.json();

      set((state) => ({
        categories: state.categories.map((ctg) =>
          ctg._id === id ? data.account : ctg
        ),
      }));

      toast.success('categories updated successfully!');
    } catch (error) {
      console.error('update categories error:', error);
      toast.error('Failed to update account');
    }
  },
}));
