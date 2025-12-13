'use client';

import DataCharts from '@/components/organisms/home/DataCharts';
import DataGrid from '@/components/organisms/home/DataGrid';

export default function Home() {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <DataGrid />
      <DataCharts />
    </div>
  );
}
