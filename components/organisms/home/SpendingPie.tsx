import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, PieChart, Radar, Target } from 'lucide-react';
import AreaVariant from '../../molecules/home/AreaVariant';
import BarVariants from '../../molecules/home/BarVariants';
import LineVariants from '../../molecules/home/LineVariants';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PieVariant from '@/components/molecules/home/PieVariant';
import RadarVariant from '@/components/molecules/home/RadarVariant';
import RadialVariant from '@/components/molecules/home/RadialVariant';

export type CategoryItem = {
  _id: string;
  value: number;
};

type Props = {
  data?: CategoryItem[];
};

export default function SpendingPie({ data = [] }: Props) {
  const [chartType, setCartType] = useState('pie');

  const onTypeChange = (type: string) => {
    setCartType(type);
  };

  return (
    <div className='border-none drop-shadow-sm'>
      <CardContent className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='text-xl line-clamp-1'>Categories</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='pie'>
              <div className='flex items-center'>
                <PieChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Pie chart</p>
              </div>
            </SelectItem>
            <SelectItem value='radar'>
              <div className='flex items-center'>
                <Radar className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Radar chart</p>
              </div>
            </SelectItem>
            <SelectItem value='radial'>
              <div className='flex items-center'>
                <Target className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Radial chart</p>
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
            {chartType === 'pie' && <PieVariant data={data} />}
            {chartType === 'radar' && <RadarVariant data={data} />}
            {chartType === 'radial' && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </div>
  );
}
