import { toast } from 'sonner';
import { create } from 'zustand';

interface Category {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  createLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategories: (values: {
    name: string;
    plaidId?: string;
  }) => Promise<void>;
  deleteCategories: (ids: string[]) => Promise<void>;
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

      if (!res.ok) throw new Error('Failed to fetch categories');

      const data = await res.json();
      console.log('Categories fetched:', data);

      set({
        categories: Array.isArray(data.categories)
          ? data.categories.filter(Boolean)
          : [],
      });
    } catch (error) {
      console.error('fetchCategories error:', error);
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

      if (!res.ok) throw new Error('Failed to create category');

      const data = await res.json();
      console.log('Category created:', data);

      set((state) => ({
        categories: [
          ...state.categories.filter(Boolean),
          data.category || data.categories,
        ].filter(Boolean),
      }));

      toast.success('Category created successfully!');
    } catch (error) {
      console.error('createCategories error:', error);
      toast.error('Failed to create category');
    } finally {
      set({ createLoading: false });
    }
  },

  deleteCategories: async (ids) => {
    try {
      console.log('🗑️ Deleting categories:', ids);

      set((state) => ({
        categories: state.categories.filter((c) => !ids.includes(c._id)),
      }));

      for (const id of ids) {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Failed to delete category: ${id}`);
      }

      toast.success(
        `${ids.length} categor${ids.length > 1 ? 'ies' : 'y'} deleted`
      );
    } catch (error) {
      console.error('deleteCategories error:', error);
      toast.error('Failed to delete categories');
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

      if (!res.ok) throw new Error('Failed to update category');

      const data = await res.json();
      console.log('Updated category:', data);

      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === id ? data.category || data.updatedCategory || c : c
        ),
      }));

      toast.success('Category updated successfully!');
    } catch (error) {
      console.error('updateCategories error:', error);
      toast.error('Failed to update category');
    }
  },
}));
