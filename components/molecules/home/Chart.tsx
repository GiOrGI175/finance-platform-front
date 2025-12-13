import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, FileSearch, LineChart } from 'lucide-react';
import AreaVariant from './AreaVariant';
import BarVariants from './BarVariants';
import LineVariants from './LineVariants';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DayItem = {
  date: string;
  income: number;
  expenses: number;
};

type Props = {
  data?: DayItem[];
};

export default function Chart({ data = [] }: Props) {
  const [chartType, setCartType] = useState('area');

  const onTypeChange = (type: string) => {
    setCartType(type);
  };

  return (
    <div className='border-none drop-shadow-sm'>
      <CardContent className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='text-xl line-clamp-1'>Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='area'>
              <div className='flex items-center'>
                <AreaChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Area chart</p>
              </div>
            </SelectItem>
            <SelectItem value='line'>
              <div className='flex items-center'>
                <LineChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Line chart</p>
              </div>
            </SelectItem>
            <SelectItem value='bar'>
              <div className='flex items-center'>
                <BarChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Bar chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardContent>
        {data.length === 0 ? (
          <div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full'>
            <FileSearch className='size-6 text-muted-foreground' />

            <p className='text-sm text-muted-foreground'>
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {chartType === 'line' && <LineVariants data={data} />}
            {chartType === 'area' && <AreaVariant data={data} />}
            {chartType === 'bar' && <BarVariants data={data} />}
          </>
        )}
      </CardContent>
    </div>
  );
}
