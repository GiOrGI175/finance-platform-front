import { toast } from 'sonner';
import { create } from 'zustand';

interface Transaction {
  _id: string;
  amount: number;
  payee: string;
  notes?: string;
  date: string;
  accountId: string;
  categoryId: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  createLoading: boolean;
  fetchTransactions: (params?: {
    from?: string;
    to?: string;
    accountId?: string;
  }) => Promise<void>;
  createTransaction: (values: {
    amount: string;
    date: string;
    accountId: string;
    categoryId: string;
    payee?: string | undefined;
    notes?: string | undefined;
  }) => Promise<void>;
  deleteTransactions: (ids: string[]) => Promise<void>;
  updateTransaction: (
    id: string,
    values: Partial<Transaction>
  ) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  createLoading: false,

  fetchTransactions: async (params = {}) => {
    try {
      set({ loading: true });

      const query = new URLSearchParams();
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);
      if (params.accountId) query.append('accountId', params.accountId);

      const res = await fetch(`/api/transactions?${query.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch transactions');

      const data = await res.json();
      set({
        transactions: Array.isArray(data.transactions) ? data.transactions : [],
      });
    } catch (err) {
      console.error('fetchTransactions error:', err);
      toast.error('Failed to fetch transactions');
    } finally {
      set({ loading: false });
    }
  },

  createTransaction: async (values) => {
    try {
      set({ createLoading: true });

      const res = await fetch('/api/transactions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to create transaction');

      const data = await res.json();
      console.log('Transaction created:', data);

      set((state) => ({
        transactions: [
          ...state.transactions.filter(Boolean),
          data.transaction || data.transactions,
        ].filter(Boolean),
      }));

      toast.success('Transaction created successfully!');
    } catch (err) {
      console.error('createTransaction error:', err);
      toast.error('Failed to create transaction');
    } finally {
      set({ createLoading: false });
    }
  },

  deleteTransactions: async (ids) => {
    try {
      console.log('Deleting transactions:', ids);

      set((state) => ({
        transactions: state.transactions.filter((t) => !ids.includes(t._id)),
      }));

      for (const id of ids) {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to delete transaction: ${id}`);
      }

      toast.success(
        `${ids.length} transaction${ids.length > 1 ? 's' : ''} deleted`
      );
    } catch (err) {
      console.error('deleteTransactions error:', err);
      toast.error('Failed to delete transactions');
    }
  },

  updateTransaction: async (id, values) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to update transaction');

      const data = await res.json();
      console.log('Updated transaction:', data);

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t._id === id ? data.transaction || data.updatedTransaction || t : t
        ),
      }));

      toast.success('Transaction updated successfully!');
    } catch (err) {
      console.error('updateTransaction error:', err);
      toast.error('Failed to update transaction');
    }
  },
}));
