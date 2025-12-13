import { toast } from 'sonner';
import { create } from 'zustand';

export type DayItem = {
  date: string;
  income: number;
  expenses: number;
};

export type CategoryItem = {
  _id: string;
  value: number;
};

export type DashboardData = {
  remainingAmount: number;
  remainingChange: number;
  incomeAmount: number;
  incomeChange: number;
  expensesAmount: number;
  expensesChange: number;
  categories: CategoryItem[];
  days: DayItem[];
};

interface TransactionState {
  summary: DashboardData | null;
  loading: boolean;
  fetchSummary: (params?: {
    from?: string;
    to?: string;
    accountId?: string;
  }) => Promise<void>;
}

export const useSummaryStore = create<TransactionState>((set, get) => ({
  summary: null,
  loading: false,

  fetchSummary: async (params = {}) => {
    try {
      set({ loading: true });

      const query = new URLSearchParams();
      if (params.from) query.append('from', params.from);
      if (params.to) query.append('to', params.to);
      if (params.accountId && params.accountId !== 'all')
        query.append('accountId', params.accountId);

      const res = await fetch(
        `/api/summary${query.toString() ? `?${query.toString()}` : ''}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch data');

      const data = await res.json();
      set({ summary: data.data });
    } catch (err) {
      console.error('fetchSummary error:', err);
      toast.error('Failed to fetch data');
    } finally {
      set({ loading: false });
    }
  },
}));
