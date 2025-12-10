'use client';

import DataCard from '@/components/molecules/home/DataCard';
import { formatDateRange } from '@/lib/utils';
import { useSummaryStore } from '@/store/useSummaryStore';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';

export default function DataGrid() {
  const summary = useSummaryStore((state) => state.summary);
  const loading = useSummaryStore((state) => state.loading);
  const fetchSummary = useSummaryStore((state) => state.fetchSummary);

  useEffect(() => {
    fetchSummary();
  }, []);

  const params = useSearchParams();

  const to = params.get('to') || undefined;
  const from = params.get('from') || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
      <DataCard
        title='Remainig'
        value={summary?.remainingAmount}
        precentageChange={summary?.remainingChange}
        icon={FaPiggyBank}
        variant='default'
        dateRange={dateRangeLabel}
        loading={loading}
      />
      <DataCard
        title='Income'
        value={summary?.incomeAmount}
        precentageChange={summary?.incomeChange}
        icon={FaArrowTrendUp}
        variant='default'
        dateRange={dateRangeLabel}
        loading={loading}
      />
      <DataCard
        title='Expenses'
        value={summary?.expensesAmount}
        precentageChange={summary?.expensesChange}
        icon={FaArrowTrendDown}
        variant='default'
        dateRange={dateRangeLabel}
        loading={loading}
      />
    </div>
  );
}
