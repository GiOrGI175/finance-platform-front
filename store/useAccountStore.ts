import { toast } from 'sonner';
import { create } from 'zustand';

interface Account {
  _id: string;
  name: string;
  plaidId?: string;
  userId: string;
}

interface AccountState {
  accounts: Account[];
  loading: boolean;
  createLoading: boolean;
  fetchAccounts: () => Promise<void>;
  createAccount: (values: { name: string; plaidId?: string }) => Promise<void>;
  deleteAccounts: (ids: string[]) => void;
  //   updateAccount: (account: Account) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  loading: false,
  createLoading: false,

  fetchAccounts: async () => {
    try {
      set({ loading: true });

      const res = await fetch('/api/accounts', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch accounts');

      const { accounts } = await res.json();
      set({ accounts });
    } catch (error) {
      console.error('fetchAccounts error:', error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  createAccount: async (values) => {
    try {
      set({ createLoading: true });

      const res = await fetch('/api/accounts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to create account');

      const data = await res.json();

      set((state) => ({
        accounts: [...state.accounts, data.account],
      }));

      toast.success('Account created successfully!');
    } catch (error) {
      console.error('createAccount error:', error);
      toast.error('Failed to create account');
    } finally {
      set({ createLoading: false });
    }
  },

  deleteAccounts: async (ids) => {
    console.log(ids, 'ids');
    try {
      set((state) => ({
        accounts: state.accounts.filter((acc) => !ids.includes(acc._id)),
      }));

      for (const id of ids) {
        const res = await fetch(`/api/accounts/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Failed to delete account: ${id}`);
      }

      toast.success(
        `${ids.length} account${ids.length > 1 ? 's' : ''} deleted`
      );
    } catch (error) {
      toast.error('Failed to delete accounts');
    }
  },

  //   updateAccount: (updated) =>
  //     set((state) => ({
  //       accounts: state.accounts.map((acc) =>
  //         acc._id === updated._id ? updated : acc
  //       ),
  //     })),
}));
