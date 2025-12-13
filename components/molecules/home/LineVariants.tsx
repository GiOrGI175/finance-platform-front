import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  LineChart,
  Line,
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

export default function LineVariants({ data }: Props) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data}>
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
        <Line
          dot={false}
          dataKey='income'
          stroke='#3d82f6'
          strokeWidth={2}
          className='drop-shadow-sm'
        />
        <Line
          dot={false}
          dataKey='expenses'
          stroke='#f43f5e'
          strokeWidth={2}
          className='drop-shadow-sm'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
