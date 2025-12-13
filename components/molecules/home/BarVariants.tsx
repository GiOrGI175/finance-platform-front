import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import CustomToolTip from '@/components/atoms/home/CustomToolTip';

type DayItem = {
  date: string;
  income: number;
  expenses: number;
};

type Props = {
  data?: DayItem[];
};

export default function BarVariants({ data }: Props) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomToolTip />} />
        <Bar dataKey='income' fill='#3d82f6' className='drop-shadow-sm' />
        <Bar dataKey='expenses' fill='#f43f5e' className='drop-shadow-sm' />
      </BarChart>
    </ResponsiveContainer>
  );
}
