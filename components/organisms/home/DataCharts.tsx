'use client';

import Chart from '@/components/molecules/home/Chart';
import { useSummaryStore } from '@/store/useSummaryStore';
import { useEffect } from 'react';

export default function DataCharts() {
  const summary = useSummaryStore((state) => state.summary);
  const loading = useSummaryStore((state) => state.loading);
  const fetchSummary = useSummaryStore((state) => state.fetchSummary);

  useEffect(() => {
    fetchSummary();
  }, []);
  return (
    <div className='grid grid-cols-1 lg:grid-cols-6 gap-8'>
      <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
        <Chart data={summary?.days} />
      </div>
    </div>
  );
}
