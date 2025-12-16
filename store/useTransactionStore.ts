import { toast } from 'sonner';
import { create } from 'zustand';

interface Transaction {
  _id: string;
  amount: string;
  payee: string;
  notes?: string;
  date: string;
  accountId: { _id: string; name: string };
  categoryId: { _id: string; name: string };
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
  bulkCreateTransactions: (
    rows: {
      amount: number;
      date: string;
      payee?: string;
      notes?: string;
      isImport?: boolean;
    }[]
  ) => Promise<void>;
  deleteTransactions: (ids: string[]) => Promise<void>;
  updateTransaction: (
    id: string,
    values: {
      amount?: string;
      date?: string;
      accountId?: string;
      categoryId?: string;
      payee?: string;
      notes?: string;
    }
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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create transaction');
      }

      const fetchRes = await fetch('/api/transactions', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await fetchRes.json();

      set({ transactions: data.transactions });
      toast.success('Transaction created successfully!');
    } catch (err) {
      console.error('createTransaction error:', err);
      toast.error('Failed to create transaction');
      throw err;
    } finally {
      set({ createLoading: false });
    }
  },

  bulkCreateTransactions: async (rows) => {
    try {
      set({ createLoading: true });

      console.log('🚀 Starting bulk import with rows:', rows);
      console.log('📊 Total rows to import:', rows.length);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        console.log(`📝 Processing row ${i + 1}/${rows.length}:`, row);

        try {
          const res = await fetch('/api/transactions', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row),
          });

          const data = await res.json();
          console.log(`✅ Row ${i + 1} response:`, data);

          if (!res.ok) {
            console.error(`❌ Row ${i + 1} failed:`, data);
            errorCount++;
            throw new Error(data.message || 'Failed to create transaction');
          }

          successCount++;
        } catch (error) {
          console.error(`❌ Row ${i + 1} exception:`, error);
          errorCount++;
          throw error;
        }
      }

      console.log(
        `✅ Import complete: ${successCount} success, ${errorCount} errors`
      );

      await get().fetchTransactions();
      toast.success(`${successCount} transactions imported successfully`);
    } catch (err) {
      console.error('❌ Bulk create error:', err);
      toast.error('Import failed');
      throw err;
    } finally {
      set({ createLoading: false });
    }
  },

  deleteTransactions: async (ids) => {
    try {
      console.log('Deleting transactions:', ids);
      set({ createLoading: true });

      set((state) => ({
        transactions: state.transactions.filter((t) => !ids.includes(t._id)),
      }));

      for (const id of ids) {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(
            error.message || `Failed to delete transaction: ${id}`
          );
        }
      }

      toast.success(
        `${ids.length} transaction${ids.length > 1 ? 's' : ''} deleted`
      );
    } catch (err) {
      console.error('deleteTransactions error:', err);
      toast.error('Failed to delete transactions');
      get().fetchTransactions();
      throw err;
    } finally {
      set({ createLoading: false });
    }
  },

  updateTransaction: async (id, values) => {
    try {
      set({ createLoading: true });

      console.log('Updating transaction:', id, values);

      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Update failed:', error);
        throw new Error(error.message || 'Failed to update transaction');
      }

      const data = await res.json();
      console.log('Update response:', data);

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t._id === id ? data.transaction || t : t
        ),
      }));

      toast.success('Transaction updated successfully!');
    } catch (err) {
      console.error('updateTransaction error:', err);
      toast.error('Failed to update transaction');
      throw err;
    } finally {
      set({ createLoading: false });
    }
  },
}));
